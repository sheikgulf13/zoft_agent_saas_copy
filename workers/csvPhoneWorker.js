import Papa from "papaparse";
import { normalizeAustralianNumber } from "@/utility/phoneNumber";

const ctx = self;

let activeParser = null;
let activeJobId = null;
let debugLogCount = 0;

const post = (type, payload) => {
  ctx.postMessage({ type, payload });
};

const abortActiveParse = () => {
  if (activeParser) {
    try {
      activeParser.abort();
    } catch {
      // ignore
    }
    activeParser = null;
    activeJobId = null;
  }
};

const createSummary = ({ totalRows, validRows, invalidRows, startedAt }) => {
  return {
    totalRows,
    validCount: validRows.length,
    invalidCount: invalidRows.length,
    durationMs: Date.now() - startedAt,
    successRate: totalRows === 0 ? 0 : Math.round((validRows.length / totalRows) * 1000) / 10,
    failureRate: totalRows === 0 ? 0 : Math.round((invalidRows.length / totalRows) * 1000) / 10,
    errorSamples: invalidRows.slice(0, 10),
  };
};

const processFile = ({ file, phoneColumn, jobId }) => {
  if (!(file instanceof File)) {
    post("ERROR", { jobId, message: "CSV file missing or invalid." });
    return;
  }

  debugLogCount = 0;
  try {
    console.log(`[CSV Worker] Starting job ${jobId} with phoneColumn="${phoneColumn}" fileSize=${file?.size ?? "?"}`);
  } catch {
    // ignore logging errors
  }

  if (!phoneColumn) {
    post("ERROR", { jobId, message: "Select a phone column before processing." });
    return;
  }

  let headers = [];
  let totalRows = 0;
  const validRows = [];
  const invalidRows = [];
  const startedAt = Date.now();

  abortActiveParse();

  activeJobId = jobId;
  activeParser = Papa.parse(file, {
    header: true,
    skipEmptyLines: "greedy",
    chunkSize: 1024 * 512,
    chunk: (results, parser) => {
      if (jobId !== activeJobId) {
        parser.abort();
        return;
      }

      if (!headers.length && Array.isArray(results.meta?.fields)) {
        headers = results.meta.fields.map((field) => field?.trim?.() ?? field);
      }

      for (const row of results.data) {
        if (!row || Object.values(row).every((value) => value === undefined || value === null || value === "")) {
          continue;
        }
        totalRows += 1;
        const rawNumber = row?.[phoneColumn] ?? "";
        const validation = normalizeAustralianNumber(rawNumber);
        if (debugLogCount < 150) {
          try {
            console.log(
              `[CSV Worker] row=${totalRows} raw="${rawNumber}" -> valid=${validation.valid}` +
                (validation.valid
                  ? ` type=${validation.type} national=${validation.national} e164=${validation.international}`
                  : ` reason=${validation.reason}`)
            );
          } catch {
            // ignore logging errors
          }
          debugLogCount += 1;
        }
        if (validation.valid) {
          validRows.push({
            ...row,
            __normalizedPhone: validation.national,
            __e164: validation.international,
            __phoneType: validation.type,
          });
        } else {
          invalidRows.push({
            rowIndex: totalRows,
            value: rawNumber,
            reason: validation.reason,
          });
        }
      }

      const percent = results.meta?.cursor
        ? Math.min(100, Math.round((results.meta.cursor / file.size) * 1000) / 10)
        : null;

      post("PROGRESS", {
        jobId,
        processedRows: totalRows,
        validCount: validRows.length,
        invalidCount: invalidRows.length,
        percent,
      });
    },
    error: (error) => {
      if (jobId !== activeJobId) {
        return;
      }
      abortActiveParse();
      try {
        console.log(`[CSV Worker] ERROR job=${jobId}: ${error?.message ?? error}`);
      } catch {
        // ignore
      }
      post("ERROR", { jobId, message: error?.message ?? "Unable to parse CSV file." });
    },
    complete: () => {
      if (jobId !== activeJobId) {
        return;
      }
      const summary = createSummary({ totalRows, validRows, invalidRows, startedAt });
      try {
        console.log(
          `[CSV Worker] RESULT job=${jobId} total=${summary.totalRows} valid=${summary.validCount} invalid=${summary.invalidCount}`
        );
      } catch {
        // ignore
      }
      post("RESULT", {
        jobId,
        headers,
        validRows,
        invalidRows,
        summary,
      });
      abortActiveParse();
    },
  });
};

ctx.addEventListener("message", (event) => {
  const { type, payload } = event.data ?? {};
  switch (type) {
    case "PROCESS":
      processFile(payload ?? {});
      break;
    case "CANCEL":
      abortActiveParse();
      post("CANCELLED", { jobId: payload?.jobId });
      break;
    default:
      break;
  }
});

post("READY", {});

