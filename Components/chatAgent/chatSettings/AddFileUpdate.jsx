import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFileUpdate,
  setFileWordCounts,
} from "../../../store/reducers/fileSliceUpdate";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import "pdfjs-dist/build/pdf.worker.mjs";
import mammoth from "mammoth";
import { ContainedButton } from "@/Components/buttons/ContainedButton";

const AddFile = ({ existingFile, setExistingFile }) => {
  const dispatch = useDispatch();
  const file = useSelector((state) => state.fileUpdate.file);
  const { fileWordCounts } = useSelector((state) => state.fileUpdate);
  const [fileNames, setFileNames] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const inputFileRef = useRef(null);

  useEffect(() => {
    console.log(fileWordCounts);
    if ((file && file.length > 0) || existingFile) {
      const initialFileNames = file?.map((f) => f.name) || [];
      const keys = Object.keys(existingFile);
      const totalFileNames = [...initialFileNames, ...keys];
      setFileNames(totalFileNames);

      let initialWordCounts = { ...fileWordCounts };

      file?.forEach((f) => {
        if (f.type === "application/pdf") {
          extractTextFromPDF(f).then((wordCount) => {
            const updatedWordCounts = {
              ...initialWordCounts,
              [f.name]: wordCount,
            };
            initialWordCounts = updatedWordCounts;
            dispatch(setFileWordCounts(updatedWordCounts));
          });
        } else if (
          f.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          extractTextFromDOCX(f).then((wordCount) => {
            const updatedWordCounts = {
              ...initialWordCounts,
              [f.name]: wordCount,
            };
            initialWordCounts = updatedWordCounts;
            dispatch(setFileWordCounts(updatedWordCounts));
          });
        } else {
          const reader = new FileReader();
          reader.onload = (event) => {
            const fileContent = event.target.result;
            const wordCount = fileContent.split(/\s+/).filter(Boolean).length;
            const updatedWordCounts = {
              ...initialWordCounts,
              [f.name]: wordCount,
            };
            initialWordCounts = updatedWordCounts;
            dispatch(setFileWordCounts(updatedWordCounts));
          };
          reader.readAsText(f);
        }
      });
    }
    console.log(fileWordCounts);
  }, [existingFile]);

  // useEffect(()=>{
  //   console.log(fileNames)
  //   if(existingFile) {
  //     const keys = Object.keys(existingFile);
  //     const updatedFileNames=[...keys,...fileNames]
  //     setFileNames(updatedFileNames)
  // const updatedFileCount={...fileWordCounts,...existingFile}
  // setFileWordCounts(updatedFileCount);
  //   }
  // },[])

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      validateAndDispatchFiles(files);
      inputFileRef.current.value = null;
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      validateAndDispatchFiles(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const validateAndDispatchFiles = (files) => {
    const maxSize = 50 * 1024 * 1024; // 50MB limit
    const allowedTypes = [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/pdf",
    ];

    // Ensure `files` is an array, even if it's null or undefined
    let validFiles = Array.isArray(file) ? [...file] : [];
    let validFileNames = [...fileNames];
    let wordCounts = { ...fileWordCounts };

    files.forEach((file) => {
      if (file.size > maxSize) {
        setError("File size exceeds the 50MB limit!");
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        setError("Unsupported file type!");
        return;
      }

      validFiles.push(file);
      validFileNames.push(file.name);

      if (file.type === "application/pdf") {
        extractTextFromPDF(file).then((wordCount) => {
          const updatedWordCounts = { ...wordCounts, [file.name]: wordCount };
          wordCounts = updatedWordCounts;
          dispatch(setFileWordCounts(updatedWordCounts));
        });
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        extractTextFromDOCX(file).then((wordCount) => {
          const updatedWordCounts = { ...wordCounts, [file.name]: wordCount };
          wordCounts = updatedWordCounts;
          dispatch(setFileWordCounts(updatedWordCounts));
        });
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const fileContent = event.target.result;
          const wordCount = fileContent.split(/\s+/).filter(Boolean).length;
          const updatedWordCounts = { ...wordCounts, [file.name]: wordCount };
          wordCounts = updatedWordCounts;
          dispatch(setFileWordCounts(updatedWordCounts));
        };
        reader.readAsText(file);
      }
    });
    setFileNames(validFileNames);
    dispatch(setFileUpdate(validFiles));
  };

  const extractTextFromPDF = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = new Uint8Array(event.target.result);
        pdfjsLib
          .getDocument(fileContent)
          .promise.then((pdf) => {
            let textContent = "";
            let numPages = pdf.numPages;

            const extractPageText = (pageNum) => {
              pdf
                .getPage(pageNum)
                .then((page) => {
                  page
                    .getTextContent()
                    .then((text) => {
                      text.items.forEach((item) => {
                        textContent += item.str + " ";
                      });

                      if (pageNum < numPages) {
                        extractPageText(pageNum + 1);
                      } else {
                        const wordCount = textContent
                          .split(/\s+/)
                          .filter(Boolean).length;
                        resolve(wordCount);
                      }
                    })
                    .catch(reject); // Add error handling
                })
                .catch(reject); // Add error handling
            };

            extractPageText(1);
          })
          .catch(reject); // Add error handling
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const extractTextFromDOCX = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target.result;
        try {
          const result = await mammoth.extractRawText({ arrayBuffer });
          const textContent = result.value;
          const wordCount = textContent.split(/\s+/).filter(Boolean).length;
          resolve(wordCount);
        } catch (error) {
          console.error("Error extracting text from DOCX:", error);
          reject(error);
        }
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const handleDelete = (fileName) => {
    const updatedFileNames = fileNames.filter((name) => name !== fileName);
    const updatedWordCounts = { ...fileWordCounts };
    delete updatedWordCounts[fileName];
    dispatch(setFileWordCounts(updatedWordCounts));

    const updatedFiles = file?.filter((f) => f.name !== fileName);
    dispatch(setFileUpdate(updatedFiles));
    setFileNames(updatedFileNames);

    const updatedExistingFiles = { ...existingFile };
    delete updatedExistingFiles[fileName];
    setExistingFile(updatedExistingFiles);
  };

  return (
    <div className="flex flex-col items-center justify-center ">
      {error && <p className="text-red-500">{error}</p>}
      <DropZone
        dragActive={dragActive}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        inputFileRef={inputFileRef}
        handleFileChange={handleFileChange}
      />
      <div className="mt-[2vh] w-full max-h-[40vh] overflow-y-auto">
        <FileList
          fileNames={fileNames}
          fileWordCounts={fileWordCounts}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
};

const DropZone = ({
  dragActive,
  onDragOver,
  onDragLeave,
  onDrop,
  inputFileRef,
  handleFileChange,
}) => (
  <div className="h-full w-full flex justify-center items-center">
    <div
      className={`flex flex-col h-[20vh] items-center justify-center w-full border-[0.104vw] border-dashed rounded-[0.417vw] ${
        dragActive ? "border-blue-500" : "border-gray-300"
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <p className="Hmd font-bold">Drag & Drop any Document</p>
      <p className="text-sm text-gray-500 mb-4">
        (Support doc, txt file, pdf)
      </p>

      {/* Hidden input element */}
      <input
        ref={inputFileRef}
        type="file"
        id="fileInput"
        className="hidden"
        onChange={handleFileChange}
        accept=".doc,.docx,.pdf,application/msword,.txt"
        multiple
      />

      {/* Button to trigger file selection */}
      <ContainedButton onClick={() => inputFileRef.current.click()}>
        Choose Files
      </ContainedButton>
      {/* <button
        type="button"
        className="mt-[1.6vh] px-[0.833vw] py-[0.8vh] bg-[#702963] text-white rounded-[0.313vw] shadow-sm Hmd"
        onClick={() => inputFileRef.current.click()}
      >
        Choose Files
      </button> */}
    </div>
  </div>
);

const FileList = ({ fileNames, fileWordCounts = {}, handleDelete }) => (
  <div className="text-sm">
    {fileNames.map((name, index) => {
      return (
        <div
        key={index}
        className="flex justify-between border p-[.5vw] mb-[2vh]"
      >
        <span>{name}</span>
        <div>
          <span className="mr-4">{fileWordCounts[name] || 0} words</span>
          <ContainedButton backgroundColor={"rgb(239 68 68 / var(--tw-bg-opacity))"} onClick={() => handleDelete(name)}>
            Delete
          </ContainedButton>
        </div>
      </div>
      )

    })}
  </div>
);

export default AddFile;
