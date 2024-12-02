import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFile } from "../../store/reducers/fileSlice";
import { setUpdatedFile } from "../../store/reducers/fileSlice";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import "pdfjs-dist/build/pdf.worker.mjs";
import mammoth from "mammoth";
import { ContainedButton } from "../buttons/ContainedButton";

const AddFile = ({ setFileWordCounts, fileWordCounts }) => {
  const { file } = useSelector((state) => state.file) || [];
  const [fileNames, setFileNames] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const inputFileRef = useRef(null);

  useEffect(() => {
    console.log("Use effect mai jakar", file); // Correct logging
    if (file && file.length > 0) {
      const initialFileNames = file.map((f) => f.name);
      setFileNames(initialFileNames);

      let initialWordCounts = { ...fileWordCounts };

      // Process all files
      file.forEach((f) => {
        if (f.type === "application/pdf") {
          extractTextFromPDF(f).then((wordCount) => {
            const updatedWordCounts = { ...initialWordCounts, [f.name]: wordCount };
            setFileWordCounts(updatedWordCounts);
          });
        } else if (f.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          extractTextFromDOCX(f).then((wordCount) => {
            const updatedWordCounts = { ...initialWordCounts, [f.name]: wordCount };
            setFileWordCounts(updatedWordCounts);
          });
        } else {
          const reader = new FileReader();
          reader.onload = (event) => {
            const wordCount = event.target.result.split(/\s+/).filter(Boolean).length;
            const updatedWordCounts = { ...initialWordCounts, [f.name]: wordCount };
            setFileWordCounts(updatedWordCounts);
          };
          reader.readAsText(f);
        }
      });
    }
  }, [file]); // Only re-run the effect when `file` changes

  const handleFileChange = (e) => {
  
    console.log("Handle File Changes mai jakar", e.target.files); // Correct logging
    const files = Array.from(e.target.files);
  
    if (files) {
     
        validateAndDispatchFiles(files);
 } else {
        console.log("No new unique files to add");
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

  const validateAndDispatchFiles = async (files) => {
    console.log("Validate And Dispatch Function in mai jakar", files); // Correct logging
    const maxSize = 50 * 1024 * 1024; // 50MB limit
    const allowedTypes = [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/pdf",
    ];

    let validFiles = [];
    let wordCounts = {};
    console.log("BEFORE WORD COUNT IS", wordCounts); // Correct logging

    const wordCountPromises = files.map((file) => {
      if (file.size > maxSize) {
        setError("File size exceeds the 50MB limit!");
        return null;
      }

      if (!allowedTypes.includes(file.type)) {
        setError("Unsupported file type!");
        return null;
      }

      validFiles.push(file);

      if (file.type === "application/pdf") {
        return extractTextFromPDF(file).then((wordCount) => {
          wordCounts[file.name] = wordCount;
        });
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        return extractTextFromDOCX(file).then((wordCount) => {
          wordCounts[file.name] = wordCount;
        });
      } else {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const wordCount = event.target.result.split(/\s+/).filter(Boolean).length;
            wordCounts[file.name] = wordCount;
            resolve();
          };
          reader.readAsText(file);
        });
      }
    });

    await Promise.all(wordCountPromises); 
    
    // Ensure word counts are updated before dispatching

    


    console.log("ALL HE VALID FILE ARE",validFiles)
    const newArray = [...fileNames, ...validFiles.map((file) => file.name)]; 

    // setFileNames(validFiles.map((file) => file.name));
    setFileNames(newArray);
    console.log("AFTER WORD COUNT IS", wordCounts); // Correct logging
    const newWord={...fileWordCounts, ...wordCounts};

    setFileWordCounts(newWord);
    dispatch(setFile(validFiles));
  };

  const handleDelete = (fileName) => {
    const updatedFileNames = fileNames.filter((name) => name !== fileName);
    const updatedWordCounts = { ...fileWordCounts };
    delete updatedWordCounts[fileName];

    setFileNames(updatedFileNames);
    setFileWordCounts(updatedWordCounts);

    const updatedFiles = file.filter((f) => f.name !== fileName);
    dispatch(setUpdatedFile(updatedFiles));
  };

  const removeFileHandler = (index) => {
    const updatedFiles = fileNames.filter((_, i) => i !== index);
    setFileNames(updatedFiles);
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
        removeFileHandler={removeFileHandler}
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
  removeFileHandler,
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
    </div>
  </div>
);

const FileList = ({ fileNames, fileWordCounts, handleDelete }) => (

  <div className="text-sm">
    {fileNames.map((name, index) => (
      <div
        key={index}
        className="flex justify-between border p-[.5vw] mb-[2vh]"
      >
        <span>{name}</span>
        <div>
          <span>{fileWordCounts[name]} words</span>
          <button
            onClick={() => handleDelete(name)}
            className="ml-[1vw] bg-red-500 text-white p-[.2vw] rounded"
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
);

const extractTextFromPDF = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      const typedarray = new Uint8Array(e.target.result);
      const pdf = await pdfjsLib.getDocument(typedarray).promise;
      let textContent = "";

      for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const text = await page.getTextContent();
        text.items.forEach((item) => {
          textContent += item.str + " ";
        });
      }
      resolve(textContent.split(/\s+/).filter(Boolean).length);
    };
    fileReader.onerror = reject;
    fileReader.readAsArrayBuffer(file);
  });
};

const extractTextFromDOCX = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const arrayBuffer = reader.result;
      try {
        const { value } = await mammoth.extractRawText({ arrayBuffer });
        resolve(value.split(/\s+/).filter(Boolean).length);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export default AddFile;