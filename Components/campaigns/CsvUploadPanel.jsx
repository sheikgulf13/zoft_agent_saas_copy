"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";

import {
  COLUMN_FIELD_CONFIG,
  COLUMN_FIELD_PAIRS,
  INITIAL_COLUMN_MAPPINGS,
} from "@/Components/campaigns/columnConfig";

const INITIAL_COLUMN_DROPDOWNS = {
  name: false,
  phone: false,
  email: false,
  info: false,
};

const CsvUploadPanel = ({
  theme,
  fileName,
  csvError,
  onFileSelected,
  onClearFile,
  headers,
  columnMappings,
  onMappingChange,
  validationErrors = {},
  processingState = { status: "idle", progress: null, summary: null, error: null },
  invalidRows = [],
  isPreviewing = false,
}) => {
  const [columnDropdowns, setColumnDropdowns] = useState(INITIAL_COLUMN_DROPDOWNS);

  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const infoRef = useRef(null);
  const dropdownRefs = useMemo(
    () => ({
      name: nameRef,
      phone: phoneRef,
      email: emailRef,
      info: infoRef,
    }),
    []
  );

  const safeHeaders = Array.isArray(headers) ? headers : [];
  const normalizedMappings =
    columnMappings && typeof columnMappings === "object" && !Array.isArray(columnMappings)
      ? columnMappings
      : INITIAL_COLUMN_MAPPINGS;
  const hasHeaders = safeHeaders.length > 0;

  useEffect(() => {
    setColumnDropdowns(INITIAL_COLUMN_DROPDOWNS);
  }, [safeHeaders.join("|")]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.entries(columnDropdowns).forEach(([key, open]) => {
        if (!open) return;
        const ref = dropdownRefs[key];
        if (ref?.current && !ref.current.contains(event.target)) {
          setColumnDropdowns((prev) => ({ ...prev, [key]: false }));
        }
      });
    };

    if (Object.values(columnDropdowns).some(Boolean)) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [columnDropdowns]);

  const selectedColumns = useMemo(() => {
    try {
      if (!normalizedMappings || typeof normalizedMappings !== "object") {
        return [];
      }
      const values = Object.values(normalizedMappings);
      return Array.isArray(values)
        ? values.filter((value) => typeof value === "string" && value.length > 0)
        : [];
    } catch {
      return [];
    }
  }, [normalizedMappings]);

  const getAvailableColumns = useCallback(
    (fieldKey) => {
      if (!hasHeaders) {
        return [];
      }
      const currentValue = normalizedMappings[fieldKey];
      return safeHeaders.filter(
        (header) => header === currentValue || !selectedColumns.includes(header)
      );
    },
    [normalizedMappings, safeHeaders, hasHeaders, selectedColumns]
  );

  const toggleDropdown = (key) => {
    setColumnDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMappingSelect = (key, value) => {
    if (normalizedMappings[key] === value) {
      toggleDropdown(key);
      return;
    }
    onMappingChange?.(key, value);
    setColumnDropdowns((prev) => ({ ...prev, [key]: false }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelected?.(file);
    }
    // reset so selecting same file again fires change event
    // eslint-disable-next-line no-param-reassign
    event.target.value = "";
  };

  const renderColumnDropdown = (fieldKey) => {
    const config = COLUMN_FIELD_CONFIG[fieldKey];
    const selectedValue = normalizedMappings[fieldKey];
    const isOpen = columnDropdowns[fieldKey];
    const options = getAvailableColumns(fieldKey);
    const disabled = !hasHeaders;
    const buttonLabel = selectedValue ?? (hasHeaders ? "Select column" : "Upload CSV to map");

    return (
      <div key={fieldKey} ref={dropdownRefs[fieldKey]} className="relative flex-1">
        <label className="text-[0.75vw] font-semibold">
          {config.label}
          {config.required && <span className="ml-[0.2vw] text-red-500">*</span>}
        </label>
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && toggleDropdown(fieldKey)}
          className={clsx(
            "mt-[0.4vw] w-full rounded-[0.6vw] border px-[0.8vw] py-[0.4vw] text-[0.85vw] flex items-center justify-between",
            theme === "dark" ? "border-[#2A2E37] bg-[#151821]" : "border-gray-300 bg-white",
            disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
            config.required && !selectedValue && hasHeaders && "border-red-500"
          )}
        >
          <span className={clsx(!selectedValue && hasHeaders && "text-gray-500")}>{buttonLabel}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div
            className={clsx(
              "absolute top-full mt-[0.4vw] left-0 right-0 rounded-[0.6vw] border shadow-xl z-20",
              theme === "dark"
                ? "border-[#2A2E37] bg-[#151821] text-white"
                : "border-gray-200 bg-white"
            )}
          >
            <div className="max-h-[12vw] overflow-y-auto p-[0.8vw] space-y-[0.3vw]">
              {!hasHeaders ? (
                <p className="text-[0.8vw] text-gray-500 text-center">Upload a CSV to map columns.</p>
              ) : options.length === 0 ? (
                <p className="text-[0.8vw] text-gray-500 text-center">All columns already mapped.</p>
              ) : (
                options.map((header) => (
                  <button
                    key={header}
                    type="button"
                    onClick={() => handleMappingSelect(fieldKey, header)}
                    className={clsx(
                      "w-full text-left px-[0.8vw] py-[0.4vw] rounded-[0.5vw] text-[0.85vw]",
                      selectedValue === header
                        ? "bg-[#4D55CC] text-white"
                        : theme === "dark"
                        ? "hover:bg-[#1F2230]"
                        : "hover:bg-gray-100"
                    )}
                  >
                    {header}
                  </button>
                ))
              )}
            </div>
            {selectedValue && (
              <button
                type="button"
                onClick={() => handleMappingSelect(fieldKey, null)}
                className={clsx(
                  "w-full text-left px-[0.8vw] py-[0.4vw] text-[0.8vw] font-medium",
                  theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
                )}
              >
                Clear selection
              </button>
            )}
          </div>
        )}
        {config.required && hasHeaders && !selectedValue && (
          <p className="mt-[0.3vw] text-[0.75vw] text-red-500">This mapping is required.</p>
        )}
      </div>
    );
  };

  const { status = "idle", progress, summary, error } = processingState;
  const isProcessing = status === "processing";

  const showSummary = summary && status === "success";
  const invalidSamples = invalidRows.slice(0, 5);

  useEffect(() => {
    try {
      console.log(
        `[CsvUploadPanel] status=${status} processed=${progress?.processedRows ?? 0} valid=${progress?.validCount ?? 0} invalid=${progress?.invalidCount ?? 0}`,
        { summary }
      );
    } catch {
      // ignore logging errors
    }
  }, [status, progress, summary]);

  return (
    <div className="space-y-[1vw]">
      <div>
        <label className="text-[0.85vw] font-semibold">
          Upload CSV
          <span className="ml-[0.2vw] text-red-500">*</span>
        </label>
        <label
          className={clsx(
            "mt-[0.5vw] flex flex-col items-center justify-center gap-[0.5vw] rounded-[.6vw] border border-dashed px-[1.5vw] py-[1.5vw] text-[0.9vw] cursor-pointer",
            theme === "dark" ? "bg-[#1F2230]" : "bg-[#F8F8FF]",
            csvError ? "border-red-500" : "border-[#4D55CC]"
          )}
        >
          <input type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
          <span className="font-medium text-[#4D55CC]">
            {isPreviewing ? "Reading file..." : "Click to upload CSV"}
          </span>
          <p className="text-[0.75vw] text-gray-500">Unlimited rows • UTF-8 CSV only</p>
          {fileName && <p className="text-[0.75vw] text-gray-400">Selected: {fileName}</p>}
          {fileName && onClearFile && (
            <button
              type="button"
              onClick={onClearFile}
              className="text-[0.7vw] text-red-500 underline underline-offset-2"
            >
              Clear file
            </button>
          )}
        </label>
        {csvError && <p className="mt-[0.4vw] text-[0.85vw] text-red-500">{csvError}</p>}
        {validationErrors.csv && !csvError && (
          <p className="mt-[0.3vw] text-[0.75vw] text-red-500">{validationErrors.csv}</p>
        )}
      </div>

      <div className="rounded-[.6vw] border border-dashed border-gray-300 p-[1vw] space-y-[0.8vw]">
        <div>
          <label className="text-[0.85vw] font-semibold">Map your columns</label>
          <p className="text-[0.75vw] text-gray-500">
            Match CSV headers to campaign fields. Phone number mapping is required for validation.
          </p>
        </div>
        {!hasHeaders ? (
          <p className="text-[0.8vw] text-gray-500">Upload a CSV with headers to start mapping.</p>
        ) : (
          <div className="space-y-[0.8vw]">
            {COLUMN_FIELD_PAIRS.map((pair) => (
              <div key={pair.join("-")} className="flex flex-col md:flex-row gap-[0.8vw]">
                {pair.map((fieldKey) => renderColumnDropdown(fieldKey))}
              </div>
            ))}
          </div>
        )}
    
        {validationErrors.phoneMapping && (
          <p className="text-[0.75vw] text-red-500">{validationErrors.phoneMapping}</p>
        )}
        {validationErrors.nameMapping && (
          <p className="text-[0.75vw] text-red-500">{validationErrors.nameMapping}</p>
        )}
      </div>

      {hasHeaders && (
        <div
          className={clsx(
            "rounded-[0.8vw] border p-[1vw] space-y-[0.8vw]",
            theme === "dark" ? "border-[#2A2E37] bg-[#12141D]" : "border-gray-200 bg-gray-50"
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.85vw] font-semibold">Validation status</p>
              <p className="text-[0.75vw] text-gray-500">
                {status === "idle" && "Select a phone column to validate numbers."}
                {status === "processing" && "Crunching numbers in the background..."}
                {status === "success" && "Phone numbers validated successfully."}
                {status === "error" && "Unable to validate. Please review the errors below."}
                {status === "cancelled" && "Validation cancelled."}
              </p>
            </div>
            <span
              className={clsx(
                "text-[0.75vw] font-semibold px-[0.6vw] py-[0.2vw] rounded-full",
                status === "success" && "bg-green-100 text-green-700",
                status === "processing" && "bg-blue-100 text-blue-700",
                status === "error" && "bg-red-100 text-red-700",
                status === "idle" && "bg-gray-100 text-gray-600",
                status === "cancelled" && "bg-yellow-100 text-yellow-700"
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>

          {progress && (
            <div className="space-y-[0.4vw]">
              <div className="flex items-center justify-between text-[0.75vw] text-gray-500">
                <span>
                  Processed {progress.processedRows?.toLocaleString?.() ?? 0} rows • Valid{" "}
                  {progress.validCount?.toLocaleString?.() ?? 0} • Invalid{" "}
                  {progress.invalidCount?.toLocaleString?.() ?? 0}
                </span>
                {typeof progress.percent === "number" && (
                  <span>{progress.percent.toFixed(1)}%</span>
                )}
              </div>
              <div className="h-[0.5vw] w-full rounded-full bg-gray-200 overflow-hidden">
                <div
                  className={clsx(
                    "h-full transition-all duration-300",
                    status === "success" ? "bg-green-500" : "bg-[#4D55CC]"
                  )}
                  style={{
                    width: `${Math.min(100, progress?.percent ?? (isProcessing ? 30 : 0))}%`,
                  }}
                />
              </div>
            </div>
          )}

          {error?.message && (
            <p className="text-[0.8vw] text-red-500">Worker error: {error.message}</p>
          )}

          {showSummary && (
            <div className="space-y-[0.8vw]">
              <div className="flex flex-wrap gap-[1vw] text-[0.8vw]">
                <div className="flex-1 min-w-[8vw] rounded-[0.6vw] bg-white/60 p-[0.8vw] shadow-sm">
                  <p className="text-gray-500 text-[0.7vw] uppercase tracking-[0.1em]">Total</p>
                  <p className="text-[1vw] font-semibold">{summary.totalRows.toLocaleString()}</p>
                </div>
                <div className="flex-1 min-w-[8vw] rounded-[0.6vw] bg-green-50 p-[0.8vw] shadow-sm">
                  <p className="text-green-600 text-[0.7vw] uppercase tracking-[0.1em]">
                    Valid rows ({summary.successRate}%)
                  </p>
                  <p className="text-[1vw] font-semibold text-green-700">
                    {summary.validCount.toLocaleString()}
                  </p>
                </div>
                <div className="flex-1 min-w-[8vw] rounded-[0.6vw] bg-red-50 p-[0.8vw] shadow-sm">
                  <p className="text-red-600 text-[0.7vw] uppercase tracking-[0.1em]">
                    Invalid rows ({summary.failureRate}%)
                  </p>
                  <p className="text-[1vw] font-semibold text-red-700">
                    {summary.invalidCount.toLocaleString()}
                  </p>
                </div>
              </div>

              {invalidSamples.length > 0 && (
                <div>
                  <p className="text-[0.8vw] font-semibold mb-[0.4vw]">
                    Top invalid numbers ({invalidRows.length.toLocaleString()})
                  </p>
                  <div className="max-h-[10vw] overflow-y-auto border rounded-[0.6vw]">
                    <table className="w-full text-[0.75vw]">
                      <thead>
                        <tr className="text-left bg-gray-100 text-black">
                          <th className="px-[0.6vw] py-[0.4vw]">Row</th>
                          <th className="px-[0.6vw] py-[0.4vw]">Value</th>
                          <th className="px-[0.6vw] py-[0.4vw]">Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invalidSamples.map((row) => (
                          <tr key={`${row.rowIndex}-${row.reason}`} className="border-t">
                            <td className="px-[0.6vw] py-[0.4vw] font-mono text-black">{row.rowIndex}</td>
                            <td className="px-[0.6vw] py-[0.4vw] text-black">{row.value || "—"}</td>
                            <td className="px-[0.6vw] py-[0.4vw] text-red-500">{row.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CsvUploadPanel;

