import React from "react";
import ReactDOM from "react-dom/client";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const ConfirmationModal = (props) => {
  const { content, onSuccess, onCancel } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
      <Dialog
        fullScreen={fullScreen}
        open={true}
        onClose={onCancel}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSuccess} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
  );
};

const showConfirmationModal = (content, onSuccess) => {
    const modalContainer = document.createElement("div");
    document.body.appendChild(modalContainer);

    const unmount = () => {
        root.unmount();
        document.body.removeChild(modalContainer);
    }
  
    const root = ReactDOM.createRoot(modalContainer);
    root.render(<ConfirmationModal content={content} onSuccess={() => {
        onSuccess();
        unmount();
    }} onCancel={unmount}/>);
  };

export { ConfirmationModal, showConfirmationModal };
