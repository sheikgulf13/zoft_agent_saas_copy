import Papa from "papaparse";

const DEFAULT_SAMPLE_SIZE = 25;

const normalizeHeaders = (headers = []) =>
  headers.map((header) => (typeof header === "string" ? header.trim() : header ?? ""));

const normalizeRows = (rows = [], headers = []) =>
  rows.map((row) => {
    const normalized = {};
    headers.forEach((header) => {
      normalized[header] = row?.[header] ?? "";
    });
    return normalized;
  });

export const previewCsvFile = (file, { sampleSize = DEFAULT_SAMPLE_SIZE } = {}) =>
  new Promise((resolve, reject) => {
    if (typeof File !== "undefined" && !(file instanceof File)) {
      reject(new Error("Only CSV file inputs are supported."));
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: "greedy",
      preview: sampleSize,
      error: (error) => reject(error ?? new Error("Unable to read CSV file.")),
      complete: (results) => {
        const headers = normalizeHeaders(results.meta?.fields ?? []);
        resolve({
          headers,
          rows: normalizeRows(results.data ?? [], headers),
        });
      },
    });
  });

export const readCsvFile = (file, options) => previewCsvFile(file, options);

