"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useTheme from "next-theme";
import { useRouter } from "next/navigation";
import clsx from "clsx";

import useCampaigns from "@/hooks/useCampaigns";
import CsvUploadPanel from "@/Components/campaigns/CsvUploadPanel";
import { INITIAL_COLUMN_MAPPINGS } from "@/Components/campaigns/columnConfig";
import useCsvWorker from "@/hooks/useCsvWorker";
import { previewCsvFile } from "@/utility/csv-parser";
import { getApiConfig, getApiHeaders } from "@/utility/api-config";

const HOURS = Array.from({ length: 12 }, (_, index) =>
  String(index + 1).padStart(2, "0")
);
const MINUTES = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, "0")
);
const MERIDIEM = ["AM", "PM"];
const DEFAULT_TIMEZONES =
  typeof Intl !== "undefined" && typeof Intl.supportedValuesOf === "function"
    ? Intl.supportedValuesOf("timeZone")
    : [
        "UTC",
        "America/New_York",
        "America/Los_Angeles",
        "Europe/London",
        "Europe/Berlin",
        "Asia/Dubai",
        "Asia/Kolkata",
        "Asia/Singapore",
        "Australia/Sydney",
      ];

const buildDateOptions = () => {
  const today = new Date();
  const options = [];
  for (let dayOffset = 0; dayOffset < 14; dayOffset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + dayOffset);
    options.push({
      value: date.toISOString().split("T")[0],
      label: date.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    });
  }
  return options;
};

const padTwo = (value) => String(value).padStart(2, "0");

const getTimeZoneOffsetMinutes = (date, timeZone) => {
  if (typeof Intl === "undefined" || typeof Intl.DateTimeFormat !== "function") {
    return null;
  }
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const parts = formatter.formatToParts(date);
    const partValues = parts.reduce((acc, part) => {
      if (part.type !== "literal") {
        acc[part.type] = part.value;
      }
      return acc;
    }, {});
    const asUTC = Date.UTC(
      Number(partValues.year),
      Number(partValues.month) - 1,
      Number(partValues.day),
      Number(partValues.hour),
      Number(partValues.minute),
      Number(partValues.second)
    );
    return (asUTC - date.getTime()) / 60000;
  } catch {
    return null;
  }
};

const buildTimestampWithTimezone = ({
  date,
  hour,
  minute,
  meridiem,
  timezone,
}) => {
  if (!date || !hour || !minute || !meridiem || !timezone) {
    return null;
  }
  const [year, month, day] = date.split("-").map((segment) => Number(segment));
  if ([year, month, day].some((value) => Number.isNaN(value))) {
    return null;
  }
  let hourValue = Number(hour);
  const minuteValue = Number(minute);
  if (Number.isNaN(hourValue) || Number.isNaN(minuteValue)) {
    return null;
  }
  if (meridiem === "PM" && hourValue !== 12) {
    hourValue += 12;
  } else if (meridiem === "AM" && hourValue === 12) {
    hourValue = 0;
  }
  const baseUtc = Date.UTC(year, month - 1, day, hourValue, minuteValue, 0, 0);
  const baseDate = new Date(baseUtc);
  const offsetMinutes = getTimeZoneOffsetMinutes(baseDate, timezone);
  if (offsetMinutes == null) {
    return null;
  }
  const zonedInstant = new Date(baseUtc - offsetMinutes * 60 * 1000);
  const offsetSign = offsetMinutes >= 0 ? "+" : "-";
  const absOffsetMinutes = Math.abs(offsetMinutes);
  const offsetHours = Math.floor(absOffsetMinutes / 60);
  const offsetRemainingMinutes = absOffsetMinutes % 60;
  const offsetString = `${offsetSign}${padTwo(offsetHours)}:${padTwo(
    offsetRemainingMinutes
  )}`;
  return zonedInstant.toISOString().replace("Z", offsetString);
};

const EMPTY_CSV_STATE = {
  headers: [],
  previewRows: [],
  rows: [],
  invalidRows: [],
  summary: null,
};

const CampaignForm = ({ onCsvParsed }) => {
  const { theme } = useTheme();
  const router = useRouter();
  const { launch, launchStatus } = useCampaigns();
  const [agents, setAgents] = useState([]);
  const [agentsStatus, setAgentsStatus] = useState("idle");
  const [agentsError, setAgentsError] = useState(null);
  const agentsRequestRef = useRef(null);

  const agentsEndpoint = useMemo(() => {
    const baseUrl = process.env.url;
    if (!baseUrl) {
      return null;
    }
    return `${baseUrl.replace(/\/$/, "")}/public/workspace/get_phone_agents`;
  }, []);

  const isLaunching = launchStatus === "loading";
  const dateOptions = useMemo(buildDateOptions, []);
  const [formValues, setFormValues] = useState(() => ({
    name: "",
    voiceId: "",
    startType: "immediate",
    startDate: dateOptions[0]?.value ?? "",
    hour: "09",
    minute: "00",
    meridiem: "AM",
    timezone: "Australia/Sydney",
  }));

  const [csvMeta, setCsvMeta] = useState(() => ({ ...EMPTY_CSV_STATE }));
  const [csvError, setCsvError] = useState(null);
  const [fileName, setFileName] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [isPreviewingCsv, setPreviewingCsv] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [feedbackTone, setFeedbackTone] = useState("neutral");
  const [isTimePickerOpen, setTimePickerOpen] = useState(false);
  const timePickerRef = useRef(null);
  const voiceDropdownRef = useRef(null);
  const dateDropdownRef = useRef(null);
  const timezoneDropdownRef = useRef(null);
  const [dropdowns, setDropdowns] = useState({
    voice: false,
    date: false,
    timezone: false,
  });
  const [columnMappings, setColumnMappings] = useState(INITIAL_COLUMN_MAPPINGS);
  const {
    status: workerStatus,
    progress: workerProgress,
    result: workerResult,
    error: workerError,
    startProcessing,
    reset: resetWorker,
  } = useCsvWorker();

  const normalizeAgents = useCallback((payload) => {
    const list = Array.isArray(payload?.phone_agents) ? payload.phone_agents : [];
    return list
      .filter((agent) => agent?.id && agent?.phone_agent_name)
      .map((agent) => ({
        id: String(agent.id),
        name: agent.phone_agent_name,
      }));
  }, []);

  const fetchAgents = useCallback(async () => {
    if (agentsRequestRef.current) {
      agentsRequestRef.current.abort();
    }

    if (!agentsEndpoint) {
      setAgentsStatus("error");
      setAgentsError("Agent endpoint is not configured.");
      setAgents([]);
      return;
    }

    const controller = new AbortController();
    agentsRequestRef.current = controller;
    setAgentsStatus("loading");
    setAgentsError(null);
    const formdata = new FormData();
    formdata.append("workspace_id", "f5e9b9b5-f8d4-4dc7-a0ae-254d83649c44");

    try {
      const response = await fetch(agentsEndpoint, {
        ...getApiConfig(),
        method: "GET",
    
        headers: new Headers({
          ...getApiHeaders(),
        }),
        cache: "no-cache",
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("Unable to load agents.");
      }

      const payload = await response.json();
      const normalized = normalizeAgents(payload);
      setAgents(normalized);
      setAgentsStatus("success");
      if (!normalized.length) {
        setAgentsError("No agents available.");
      }
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }
      setAgentsStatus("error");
      setAgentsError(error?.message ?? "Unable to load agents.");
      setAgents([]);
    } finally {
      if (agentsRequestRef.current === controller) {
        agentsRequestRef.current = null;
      }
    }
  }, [agentsEndpoint, normalizeAgents]);

  const isLoadingAgents = agentsStatus === "loading" && agents.length === 0;
  const agentError = agentsError;
  const hasCsvHeaders = Array.isArray(csvMeta.headers) && csvMeta.headers.length > 0;

  useEffect(() => {
    fetchAgents();
    return () => {
      agentsRequestRef.current?.abort();
    };
  }, [fetchAgents]);

  useEffect(() => {
    if (!hasCsvHeaders) {
      setColumnMappings(INITIAL_COLUMN_MAPPINGS);
      return;
    }
    setColumnMappings((prev) => {
      let mutated = false;
      const next = { ...prev };
      Object.entries(prev).forEach(([key, value]) => {
        if (value && !csvMeta.headers.includes(value)) {
          next[key] = null;
          mutated = true;
        }
      });
      return mutated ? next : prev;
    });
  }, [csvMeta.headers, hasCsvHeaders]);

  useEffect(() => {
    if (!onCsvParsed) {
      return;
    }
    if (!csvMeta.headers.length) {
      onCsvParsed({ headers: [], rows: [] });
      return;
    }
    const previewRows =
      csvMeta.rows.length > 0
        ? csvMeta.rows
        : csvMeta.previewRows;
    onCsvParsed({
      headers: csvMeta.headers,
      rows: previewRows,
    });
  }, [csvMeta.headers, csvMeta.previewRows, csvMeta.rows, onCsvParsed]);

  useEffect(() => {
    if (!workerResult) {
      return;
    }
    setCsvMeta((prev) => ({
      ...prev,
      rows: workerResult.validRows ?? [],
      invalidRows: workerResult.invalidRows ?? [],
      summary: workerResult.summary ?? null,
    }));
  }, [workerResult]);

  const updateForm = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const clearCsvState = useCallback(() => {
    setCsvFile(null);
    setFileName("");
    setCsvMeta({ ...EMPTY_CSV_STATE });
    setColumnMappings(INITIAL_COLUMN_MAPPINGS);
    resetWorker();
  }, [resetWorker]);

  const handleCsvUpload = useCallback(
    async (file) => {
      if (!file) {
        return;
      }

      if (!file.name?.toLowerCase?.().endsWith(".csv")) {
        setCsvError("Only .csv files are supported.");
        return;
      }

      setCsvError(null);
      setFeedback(null);
      setPreviewingCsv(true);
      try {
        const preview = await previewCsvFile(file, { sampleSize: 1000 });
        setCsvFile(file);
        setFileName(file.name);
        setCsvMeta({
          headers: preview.headers,
          previewRows: preview.rows,
          rows: [],
          invalidRows: [],
          summary: null,
        });
        setColumnMappings(INITIAL_COLUMN_MAPPINGS);
        resetWorker();
      } catch (error) {
        setCsvError(error?.message ?? "Unable to read CSV file.");
        clearCsvState();
      } finally {
        setPreviewingCsv(false);
      }
    },
    [clearCsvState, resetWorker]
  );

  const handleClearCsv = useCallback(() => {
    clearCsvState();
    setCsvError(null);
    setFeedback(null);
    setFeedbackTone("neutral");
    onCsvParsed?.({ headers: [], rows: [] });
  }, [clearCsvState, onCsvParsed]);

  const handleMappingChange = useCallback(
    (key, value) => {
      setColumnMappings((prev) => {
        if (prev[key] === value) {
          return prev;
        }
        return { ...prev, [key]: value };
      });

      if (key !== "phone") {
        return;
      }

      if (value && csvFile) {
        try {
          startProcessing({ file: csvFile, phoneColumn: value });
        } catch (error) {
          setCsvError(error?.message ?? "Unable to validate phone numbers.");
        }
      } else {
        setCsvMeta((prev) => ({
          ...prev,
          rows: [],
          invalidRows: [],
          summary: null,
        }));
        resetWorker();
      }
    },
    [csvFile, resetWorker, startProcessing]
  );

  const scheduleTimestamp = useMemo(() => {
    if (formValues.startType !== "schedule") {
      return null;
    }
    if (
      !formValues.startDate ||
      !formValues.hour ||
      !formValues.minute ||
      !formValues.meridiem ||
      !formValues.timezone
    ) {
      return null;
    }
    return buildTimestampWithTimezone({
      date: formValues.startDate,
      hour: formValues.hour,
      minute: formValues.minute,
      meridiem: formValues.meridiem,
      timezone: formValues.timezone,
    });
  }, [formValues]);

  useEffect(() => {
    if (formValues.startType !== "schedule") {
      return;
    }
    console.log("Schedule selection", {
      date: formValues.startDate,
      time: `${formValues.hour}:${formValues.minute} ${formValues.meridiem}`,
      timezone: formValues.timezone,
      timestamp: scheduleTimestamp,
    });
  }, [
    formValues.hour,
    formValues.meridiem,
    formValues.minute,
    formValues.startDate,
    formValues.startType,
    formValues.timezone,
    scheduleTimestamp,
  ]);

  const canSubmit = useMemo(() => {
    if (!formValues.name.trim() || !formValues.voiceId) {
      return false;
    }
    if (!csvFile || workerStatus !== "success" || csvMeta.rows.length === 0) {
      return false;
    }
    if (!columnMappings.phone || !columnMappings.name) {
      return false;
    }
    if (formValues.startType === "schedule") {
      return Boolean(
        formValues.startDate &&
          formValues.hour &&
          formValues.minute &&
          formValues.meridiem &&
          formValues.timezone &&
          scheduleTimestamp
      );
    }
    return true;
  }, [
    columnMappings.name,
    columnMappings.phone,
    csvFile,
    csvMeta.rows.length,
    formValues,
    scheduleTimestamp,
    workerStatus,
  ]);

  const selectedTimeLabel = useMemo(() => {
    const time = `${formValues.hour}:${formValues.minute} ${formValues.meridiem}`;
    return formValues.startType === "schedule" ? time : "Immediate";
  }, [formValues]);

  const validationErrors = useMemo(() => {
    const errors = {};
    if (!formValues.name.trim()) {
      errors.name = "required.";
    }
    if (!formValues.voiceId) {
      errors.voice = "required.";
    }
    if (!csvFile) {
      errors.csv = "CSV upload required.";
    } else if (workerStatus === "success" && csvMeta.rows.length === 0) {
      errors.csv = "No valid Australian phone numbers found.";
    }
    if (!columnMappings.phone) {
      errors.phoneMapping = "required.";
    } else if (workerStatus === "error") {
      errors.phoneMapping = workerError?.message ?? "Unable to validate phone column.";
    } else if (workerStatus !== "success") {
      errors.phoneMapping = "Validating phone numbers...";
    }
    if (!columnMappings.name) {
      errors.nameMapping = "required.";
    } 
    if (formValues.startType === "schedule") {
      if (!formValues.startDate) {
        errors.startDate = "required.";
      }
      if (!formValues.hour || !formValues.minute || !formValues.meridiem) {
        errors.startTime = "required.";
      }
      if (!formValues.timezone) {
        errors.timezone = "required.";
      }
      if (
        formValues.startDate &&
        formValues.hour &&
        formValues.minute &&
        formValues.meridiem &&
        formValues.timezone &&
        !scheduleTimestamp
      ) {
        errors.startTime = "Invalid schedule configuration.";
      }
    }
    return errors;
  }, [
    columnMappings.name,
    columnMappings.phone,
    csvFile,
    csvMeta.rows.length,
    formValues,
    scheduleTimestamp,
    workerError,
    workerStatus,
  ]);

  const buildPayload = () => ({
    campaignName: formValues.name.trim(),
    campaignDescription: "",
    agentId: formValues.voiceId,
    columnMap: {
      name: columnMappings.name,
      phone: columnMappings.phone,
      email: columnMappings.email,
      additionalInfo: columnMappings.info,
    },
    scheduleType: formValues.startType === "schedule" ? "schedule" : "immediate",
    scheduledAt:
      formValues.startType === "schedule" ? scheduleTimestamp : "",
    csvFile,
  });

  const toggleDropdown = useCallback((key) => {
    setDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const closeDropdown = useCallback((key) => {
    setDropdowns((prev) => ({ ...prev, [key]: false }));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const mappings = [
        { open: isTimePickerOpen, close: () => setTimePickerOpen(false), ref: timePickerRef },
        { open: dropdowns.voice, close: () => closeDropdown("voice"), ref: voiceDropdownRef },
        { open: dropdowns.date, close: () => closeDropdown("date"), ref: dateDropdownRef },
        { open: dropdowns.timezone, close: () => closeDropdown("timezone"), ref: timezoneDropdownRef },
      ];

      mappings.forEach(({ open, close, ref }) => {
        if (open && ref?.current && !ref.current.contains(event.target)) {
          close();
        }
      });
    };

    if (isTimePickerOpen || dropdowns.voice || dropdowns.date || dropdowns.timezone) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeDropdown, dropdowns.date, dropdowns.timezone, dropdowns.voice, isTimePickerOpen]);

  const handleLaunchCampaign = async () => {
    if (!canSubmit) {
      setFeedbackTone("error");
      const missingFields = [];
      if (!formValues.name.trim()) missingFields.push("Campaign Name");
      if (!formValues.voiceId) missingFields.push("Select Agent");
      if (!csvFile) missingFields.push("CSV Upload");
      else if (workerStatus !== "success" || csvMeta.rows.length === 0) missingFields.push("CSV Validation");
      if (!columnMappings.phone) missingFields.push("Phone Number Column Mapping");
      if (formValues.startType === "schedule") {
        if (!formValues.startDate) missingFields.push("Start Date");
        if (!formValues.hour || !formValues.minute || !formValues.meridiem) missingFields.push("Start Time");
        if (!formValues.timezone) missingFields.push("Timezone");
      }
      setFeedback(
        missingFields.length > 0
          ? `Please complete the following required fields: ${missingFields.join(", ")}.`
          : "Please complete all required fields before launching."
      );
      return;
    }
    setFeedback(null);
    try {
      const response = await launch(buildPayload());
      setFeedbackTone("success");
      setFeedback(
        response?.name
          ? `Campaign "${response.name}" queued for launch.`
          : "Campaign launch initiated."
      );
      router.push("/campaigns");
    } catch (error) {
      setFeedbackTone("error");
      setFeedback(error?.message ?? "Unable to launch campaign.");
    }
  };

  return (
    <div
      className={`w-full h-[95vh] border-r-[0.2vw] p-[1.5vw] flex flex-col ${
        theme === "dark"
          ? "border-[#2A2E37] bg-[#151821] text-white"
          : "border-gray-200 bg-white text-gray-900"
      }`}
    >
      <div className="space-y-[1.2vw] overflow-auto pr-[0.5vw] pb-[1vw]">
        <div>
          <label className="text-[0.85vw] font-semibold">
            Campaign Name
            <span className="ml-[0.2vw] text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formValues.name}
            onChange={(event) => updateForm("name", event.target.value)}
            placeholder="Spring Product Launch"
            className={clsx(
              "mt-[0.5vw] w-full rounded-[0.6vw] border px-[1vw] py-[0.4vw] text-[0.85vw] focus:outline-none focus:ring-2 focus:ring-[#4D55CC]",
              validationErrors.name ? "border-red-500" : "border-gray-300"
            )}
          />
          {validationErrors.name && (
            <p className="mt-[0.3vw] text-[0.75vw] text-red-500">{validationErrors.name}</p>
          )}
        </div>

        <div ref={voiceDropdownRef} className="relative">
          <label className="text-[0.85vw] font-semibold">
            Select Agent
            <span className="ml-[0.2vw] text-red-500">*</span>
          </label>
          <button
            type="button"
            disabled={isLoadingAgents}
            onClick={() => !isLoadingAgents && toggleDropdown("voice")}
            className={clsx(
              "mt-[0.5vw] w-full rounded-[0.6vw] border px-[1vw] py-[0.4vw] text-[0.85vw] flex items-center justify-between bg-transparent",
              isLoadingAgents ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
              validationErrors.voice ? "border-red-500" : "border-gray-300"
            )}
          >
            <span>
              {formValues.voiceId
                ? agents.find((agent) => agent.id === formValues.voiceId)?.name ?? "Selected agent"
                : isLoadingAgents
                ? "Loading agents..."
                : "Choose an agent"}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-transform ${
                dropdowns.voice ? "rotate-180" : ""
              } ${isLoadingAgents ? "hidden" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {dropdowns.voice && (
            <div
              className={`absolute top-full mt-[0.6vw] left-0 right-0 rounded-[0.6vw] border bg-white shadow-xl z-20 ${
                theme === "dark" ? "border-[#2A2E37] bg-[#151821] text-white" : "border-gray-200"
              }`}
            >
              <div className="max-h-[14vw] overflow-y-auto p-[0.8vw] space-y-[0.4vw]">
                {agents.length === 0 ? (
                  <p className="text-[0.8vw] text-gray-500 text-center">
                    {agentError ?? "No agents available"}
                  </p>
                ) : (
                  agents.map((agent) => (
                    <button
                      key={agent.id}
                      type="button"
                      onClick={() => {
                        updateForm("voiceId", agent.id);
                        closeDropdown("voice");
                      }}
                      className={clsx(
                        "w-full text-left px-[0.8vw] py-[0.4vw] rounded-[0.5vw] text-[0.85vw]",
                        formValues.voiceId === agent.id
                          ? "bg-[#4D55CC] text-white"
                          : theme === "dark"
                          ? "hover:bg-[#1F2230]"
                          : "hover:bg-gray-100"
                      )}
                    >
                      {agent.name}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
          {agentError && <p className="mt-[.3vw] text-[.75vw] text-red-500">{agentError}</p>}
          {validationErrors.voice && !agentError && (
            <p className="mt-[0.3vw] text-[0.75vw] text-red-500">{validationErrors.voice}</p>
          )}
        </div>

        <CsvUploadPanel
          theme={theme}
          fileName={fileName}
          csvError={csvError}
          onFileSelected={handleCsvUpload}
          onClearFile={csvFile ? handleClearCsv : undefined}
          headers={csvMeta.headers}
          columnMappings={columnMappings}
          onMappingChange={handleMappingChange}
          validationErrors={{
            csv: validationErrors.csv,
            phoneMapping: validationErrors.phoneMapping,
            nameMapping: validationErrors.nameMapping,
          }}
          processingState={{
            status: workerStatus,
            progress: workerProgress,
            summary: csvMeta.summary,
            error: workerError,
          }}
          invalidRows={csvMeta.invalidRows}
          isPreviewing={isPreviewingCsv}
        />

        <div>
          <label className="text-[0.85vw] font-semibold">Choose when to start</label>
          <div className="mt-[0.5vw] flex gap-[0.8vw]">
            {["immediate", "schedule"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => updateForm("startType", type)}
                className={clsx(
                  "flex-1 rounded-[.6vw] border px-[1vw] py-[0.4vw] text-[0.85vw] font-medium capitalize cursor-pointer",
                  formValues.startType === type
                    ? "border-[#4D55CC] bg-[#4D55CC]/10 text-[#4D55CC]"
                    : "border-gray-300 hover:border-[#4D55CC]/60"
                )}
              >
                {type === "immediate" ? "Start immediately" : "Schedule for later"}
              </button>
            ))}
          </div>
        </div>

        {formValues.startType === "schedule" && (
          <div className="space-y-[0.8vw] rounded-[.6vw] border border-dashed border-gray-300 p-[1vw]">
            <div>
              <label className="text-[0.7vw] uppercase tracking-[0.05em] text-gray-500">
                Start at
                <span className="ml-[0.2vw] text-red-500">*</span>
              </label>
              <div className="mt-[0.6vw] flex gap-[0.8vw] items-start">
                <div ref={dateDropdownRef} className="relative flex-1">
                  <button
                    type="button"
                    onClick={() => toggleDropdown("date")}
                    className={clsx(
                      "w-full rounded-[0.6vw] border px-[1vw] py-[0.4vw] text-[0.85vw] flex items-center justify-between bg-white cursor-pointer",
                      validationErrors.startDate ? "border-red-500" : "border-gray-300"
                    )}
                  >
                    <span>
                      {dateOptions.find((option) => option.value === formValues.startDate)?.label ??
                        "Select date"}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 transition-transform ${dropdowns.date ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {dropdowns.date && (
                    <div
                      className={`absolute bottom-full mb-[0.6vw] left-0 right-0 rounded-[0.6vw] border bg-white shadow-xl z-20 ${
                        theme === "dark" ? "border-[#2A2E37] bg-[#151821] text-white" : "border-gray-200"
                      }`}
                    >
                      <div className="max-h-[12vw] overflow-y-auto p-[0.8vw] space-y-[0.4vw]">
                        {dateOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              updateForm("startDate", option.value);
                              closeDropdown("date");
                            }}
                            className={clsx(
                              "w-full text-left px-[0.8vw] py-[0.4vw] rounded-[0.5vw] text-[0.85vw]",
                              formValues.startDate === option.value
                                ? "bg-[#4D55CC] text-white"
                                : theme === "dark"
                                ? "hover:bg-[#1F2230]"
                                : "hover:bg-gray-100"
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {validationErrors.startDate && (
                    <p className="mt-[0.3vw] text-[0.75vw] text-red-500">{validationErrors.startDate}</p>
                  )}
                </div>
                <div ref={timePickerRef} className="relative w-[10vw]">
                  <button
                    type="button"
                    onClick={() => setTimePickerOpen((prev) => !prev)}
                    className={clsx(
                      "w-full rounded-[0.6vw] border px-[1vw] py-[0.4vw] text-[0.85vw] flex items-center justify-between bg-white focus:outline-none",
                      validationErrors.startTime ? "border-red-500" : "border-gray-300"
                    )}
                  >
                    <span>{selectedTimeLabel}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 transition-transform ${isTimePickerOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isTimePickerOpen && (
                    <div
                      className={`absolute bottom-full mb-[0.6vw] w-[22vw] rounded-[1vw] border bg-white shadow-xl ${
                        theme === "dark" ? "border-[#2A2E37] bg-[#151821] text-white" : "border-gray-200"
                      }`}
                    >
                      <div className="flex p-[1vw] gap-[1vw]">
                        <div className="flex-1">
                          <p className="text-[0.7vw] text-gray-500 mb-[0.4vw]">Hour</p>
                          <div className="max-h-[12vw] overflow-y-auto space-y-[0.4vw] pr-[0.5vw]">
                            {HOURS.map((hour) => (
                              <button
                                key={hour}
                                type="button"
                                onClick={() => updateForm("hour", hour)}
                                className={clsx(
                                  "w-full rounded-[0.5vw] px-[0.8vw] py-[0.4vw] text-[0.85vw] text-left",
                                  formValues.hour === hour
                                    ? "bg-[#4D55CC] text-white"
                                    : theme === "dark"
                                    ? "hover:bg-[#1F2230]"
                                    : "hover:bg-gray-100"
                                )}
                              >
                                {hour}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-[0.7vw] text-gray-500 mb-[0.4vw]">Minute</p>
                          <div className="max-h-[12vw] overflow-y-auto space-y-[0.4vw] pr-[0.5vw]">
                            {MINUTES.map((minute) => (
                              <button
                                key={minute}
                                type="button"
                                onClick={() => updateForm("minute", minute)}
                                className={clsx(
                                  "w-full rounded-[0.5vw] px-[0.8vw] py-[0.4vw] text-[0.85vw] text-left",
                                  formValues.minute === minute
                                    ? "bg-[#4D55CC] text-white"
                                    : theme === "dark"
                                    ? "hover:bg-[#1F2230]"
                                    : "hover:bg-gray-100"
                                )}
                              >
                                {minute}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="w-[5vw]">
                          <p className="text-[0.7vw] text-gray-500 mb-[0.4vw]">AM / PM</p>
                          <div className="flex flex-col gap-[0.5vw]">
                            {MERIDIEM.map((period) => (
                              <button
                                key={period}
                                type="button"
                                onClick={() => updateForm("meridiem", period)}
                                className={clsx(
                                  "w-full rounded-[0.5vw] px-[0.5vw] py-[0.4vw] text-[0.85vw]",
                                  formValues.meridiem === period
                                    ? "bg-[#4D55CC] text-white"
                                    : theme === "dark"
                                    ? "border border-[#2A2E37]"
                                    : "border border-gray-300"
                                )}
                              >
                                {period}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-[0.6vw] border-t px-[1vw] py-[0.4vw]">
                        <button
                          type="button"
                          onClick={() => setTimePickerOpen(false)}
                          className="text-[0.85vw] text-gray-500 hover:text-gray-700"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                  {validationErrors.startTime && (
                    <p className="mt-[0.3vw] text-[0.75vw] text-red-500">{validationErrors.startTime}</p>
                  )}
                </div>
                <div ref={timezoneDropdownRef} className="relative flex-1">
                  <button
                    type="button"
                    onClick={() => toggleDropdown("timezone")}
                    className={clsx(
                      "w-full rounded-[0.6vw] border px-[0.8vw] py-[0.4vw] text-[0.85vw] flex items-center justify-between bg-white cursor-pointer",
                      validationErrors.timezone ? "border-red-500" : "border-gray-300"
                    )}
                  >
                    <span>{formValues.timezone || "Select timezone"}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 transition-transform ${dropdowns.timezone ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {dropdowns.timezone && (
                    <div
                      className={`absolute bottom-full mb-[0.6vw] left-0 right-0 rounded-[0.6vw] border bg-white shadow-xl z-20 ${
                        theme === "dark" ? "border-[#2A2E37] bg-[#151821] text-white" : "border-gray-200"
                      }`}
                    >
                      <div className="max-h-[14vw] overflow-y-auto p-[0.8vw] space-y-[0.4vw]">
                        {DEFAULT_TIMEZONES.map((zone) => (
                          <button
                            key={zone}
                            type="button"
                            onClick={() => {
                              updateForm("timezone", zone);
                              closeDropdown("timezone");
                            }}
                            className={clsx(
                              "w-full text-left px-[0.8vw] py-[0.4vw] rounded-[0.5vw] text-[0.85vw]",
                              formValues.timezone === zone
                                ? "bg-[#4D55CC] text-white"
                                : theme === "dark"
                                ? "hover:bg-[#1F2230]"
                                : "hover:bg-gray-100"
                            )}
                          >
                            {zone}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {validationErrors.timezone && (
                    <p className="mt-[0.3vw] text-[0.75vw] text-red-500">{validationErrors.timezone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {feedback && (
          <div
            className={clsx(
              "rounded-[1vw] px-[1.2vw] py-[0.4vw] text-[0.85vw]",
              feedbackTone === "success"
                ? "bg-emerald-50 text-emerald-700"
                : feedbackTone === "error"
                ? "bg-red-50 text-red-600"
                : "bg-gray-100 text-gray-700"
            )}
          >
            {feedback}
          </div>
        )}
      </div>

      <div className="mt-auto pt-[1vw] mb-[1vw]">
        <button
          type="button"
          onClick={handleLaunchCampaign}
          disabled={isLaunching || !canSubmit}
          className={clsx(
            "w-full rounded-[.6vw] px-[1vw] py-[0.4vw] text-center font-semibold transition-all duration-200 text-[0.85vw] cursor-pointer",
            isLaunching || !canSubmit
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#4D55CC] text-white hover:bg-[#3A41AA]"
          )}
        >
          {isLaunching ? "Launching..." : "Launch Campaign"}
        </button>
      </div>
    </div>
  );
};

export default CampaignForm;

