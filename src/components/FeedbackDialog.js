import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const FeedbackDialog = ({ open, onClose, state, operation }) => {
  const messages = {
    create: {
      loading: "Creating...",
      success: "Created successfully!",
      error: "Failed to create.",
    },
    edit: {
      loading: "Updating...",
      success: "Updated successfully!",
      error: "Failed to update.",
    },
    delete: {
      loading: "Deleting...",
      success: "Deleted successfully!",
      error: "Failed to delete.",
    },
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{operation.toUpperCase()} Status</DialogTitle>
      <DialogContent sx={{ textAlign: "center", p: 4 }}>
        {state === "loading" && (
          <>
            <CircularProgress />
            <Typography mt={2}>{messages[operation].loading}</Typography>
          </>
        )}
        {state === "success" && (
          <>
            <CheckCircleIcon sx={{ fontSize: 60, color: "green" }} />
            <Typography mt={2}>{messages[operation].success}</Typography>
          </>
        )}
        {state === "error" && (
          <>
            <ErrorIcon sx={{ fontSize: 60, color: "red" }} />
            <Typography mt={2}>{messages[operation].error}</Typography>
          </>
        )}
      </DialogContent>
      {state !== "loading" && (
        <DialogActions>
          <Button variant="contained" onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default FeedbackDialog;
