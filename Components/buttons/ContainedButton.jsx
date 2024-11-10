import React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import CircularProgress from "@mui/material/CircularProgress";

const ContainedButton = ({ children, onClick, isLoading, className, backgroundColor }) => {
  return (
    <LoadingButton
      variant="contained"
      onClick={onClick}
      style={{ backgroundColor: backgroundColor ? backgroundColor : "#702963" }}
      loading={isLoading}
      className={`${className}`}
      loadingIndicator={
        <CircularProgress
          sx={{ color: "white" }}  // Custom color using sx prop
          size={24}                 // Customize size as needed
        />
      }
    >
      {children}
    </LoadingButton>
  );
};

export { ContainedButton };
