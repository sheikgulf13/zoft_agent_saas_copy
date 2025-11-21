"use client";

import React from "react";
import useTheme from "next-theme";

const CsvPreview = ({ headers = [], rows = [] }) => {
  const { theme } = useTheme();
  const hasData = headers.length > 0 && rows.length > 0;
  const previewRows = rows;

  return (
    <div
      className={`h-[95vh] w-full p-[1.2vw] overflow-hidden ${
        theme === "dark"
          ? "border-[#2A2E37] bg-[#1C1F27] text-white"
          : "border-gray-200 bg-gray-50 text-gray-900"
      }`}
    >
      <div className="flex items-center justify-between mb-[1.2vw]">
        <p className="font-semibold text-[1vw]">CSV Preview</p>
        {hasData && (
          <span className="text-[0.75vw] text-gray-500">
            Showing {previewRows.length} of {rows.length} rows
          </span>
        )}
      </div>

      {!hasData ? (
        <div className="h-full flex flex-col items-center justify-center text-center gap-[0.8vw] text-[0.85vw] text-gray-500 px-[1vw]">
          <p>Upload a CSV file to preview contact rows here.</p>
          <p>Accepted format: UTF-8 CSV with headers on the first row.</p>
        </div>
      ) : (
        <div className="overflow-auto h-[90%] rounded-[1vw] border border-dashed border-gray-300">
          <table className="min-w-full divide-y divide-gray-200 text-[0.85vw]">
            <thead className="bg-gray-100">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="px-[0.9vw] py-[0.4vw] text-left font-semibold text-gray-600"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {previewRows.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {headers.map((header) => (
                    <td key={header} className="px-[0.9vw] py-[0.4vw] text-gray-700">
                      {row[header]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CsvPreview;

