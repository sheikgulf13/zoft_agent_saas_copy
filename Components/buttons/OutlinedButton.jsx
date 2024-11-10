import LoadingButton from "@mui/lab/LoadingButton";
import React from "react";

const OutlinedButton = ({ children, onClick, className }) => {
  return (
    <LoadingButton variant="outlined" onClick={onClick} style={{color: "#702963", borderColor: "#702963"}} className={`hover:bg-white !important; ${className}`} >
      {children}
    </LoadingButton>
  );
};

export { OutlinedButton };