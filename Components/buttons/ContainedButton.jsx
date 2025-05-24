import React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import CircularProgress from "@mui/material/CircularProgress";

const ContainedButton = ({ children, onClick, isLoading, className, backgroundColor }) => {
  return (
    <LoadingButton
      variant="contained"
      onClick={onClick}
      style={{ 
        backgroundColor: backgroundColor ? backgroundColor : "#4D55CC",
        backgroundImage: "linear-gradient(to right, #4D55CC, #211C84)",
        boxShadow: "0 2px 4px rgba(77, 85, 204, 0.2)",
        transition: "all 0.3s ease"
      }}
      loading={isLoading}
      className={`${className} hover:shadow-lg hover:scale-[1.02]`}
      loadingIndicator={
        <CircularProgress
          sx={{ 
            color: "white",
            width: "20px !important",
            height: "20px !important"
          }}
        />
      }
    >
      {children}
    </LoadingButton>
  );
};

export { ContainedButton };
