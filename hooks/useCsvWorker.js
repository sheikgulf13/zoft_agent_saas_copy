import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const INITIAL_PROGRESS = {
  processedRows: 0,
  validCount: 0,
  invalidCount: 0,
  percent: 0,
};

const createWorker = () =>
  new Worker(new URL("@/workers/csvPhoneWorker.js", import.meta.url), { type: "module" });

const useCsvWorker = () => {
  const workerRef = useRef(null);
  const jobIdRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(INITIAL_PROGRESS);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const worker = createWorker();
    workerRef.current = worker;

    const handleMessage = (event) => {
      const { type, payload } = event.data ?? {};
      switch (type) {
        case "READY":
          setStatus((prev) => (prev === "idle" ? "ready" : prev));
          break;
        case "PROGRESS":
          if (payload?.jobId !== jobIdRef.current) return;
          setStatus("processing");
          setProgress((prev) => ({
            ...prev,
            processedRows: payload.processedRows ?? prev.processedRows,
            validCount: payload.validCount ?? prev.validCount,
            invalidCount: payload.invalidCount ?? prev.invalidCount,
            percent: payload.percent ?? prev.percent,
          }));
          break;
        case "RESULT":
          if (payload?.jobId !== jobIdRef.current) return;
          setResult(payload);
          setStatus("success");
          setProgress((prev) => ({
            ...prev,
            processedRows: payload.summary?.totalRows ?? prev.processedRows,
            validCount: payload.summary?.validCount ?? payload.validRows?.length ?? prev.validCount,
            invalidCount: payload.summary?.invalidCount ?? payload.invalidRows?.length ?? prev.invalidCount,
            percent: 100,
          }));
          break;
        case "ERROR":
          if (payload?.jobId !== jobIdRef.current) return;
          setError(payload);
          setStatus("error");
          break;
        case "CANCELLED":
          if (payload?.jobId !== jobIdRef.current) return;
          setStatus("cancelled");
          break;
        default:
          break;
      }
    };

    worker.addEventListener("message", handleMessage);
    return () => {
      worker.removeEventListener("message", handleMessage);
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const startProcessing = useCallback(
    ({ file, phoneColumn }) => {
      if (!workerRef.current) {
        throw new Error("Worker not initialised yet.");
      }
      if (!file) {
        throw new Error("CSV file is required.");
      }
      if (!phoneColumn) {
        throw new Error("Phone column is required.");
      }
      const jobId = Date.now();
      jobIdRef.current = jobId;
      setStatus("processing");
      setResult(null);
      setError(null);
      setProgress(INITIAL_PROGRESS);
      workerRef.current.postMessage({
        type: "PROCESS",
        payload: { file, phoneColumn, jobId },
      });
    },
    []
  );

  const cancel = useCallback(() => {
    if (!workerRef.current || jobIdRef.current == null) {
      return;
    }
    workerRef.current.postMessage({
      type: "CANCEL",
      payload: { jobId: jobIdRef.current },
    });
  }, []);

  const reset = useCallback(() => {
    jobIdRef.current = null;
    setStatus("idle");
    setProgress(INITIAL_PROGRESS);
    setResult(null);
    setError(null);
  }, []);

  return useMemo(
    () => ({
      status,
      progress,
      result,
      error,
      startProcessing,
      cancel,
      reset,
    }),
    [cancel, error, progress, reset, result, startProcessing, status]
  );
};

export default useCsvWorker;

