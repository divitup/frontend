import React, { useState, ChangeEvent, useEffect } from "react";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { styled } from "@mui/system";
import { getReceiptProcessingStatus, uploadReceiptImage } from "../Service/api";
import { extractExpensesFromReceipt } from "./utility";
import { Expense } from "./interface";

// Styled image upload input component
const Input = styled("input")({
  display: "none",
});

// Allow user to upload an receipt image to call backend to extract expenses,
// then retrieves a backend job id for querying job status.
export default function ImageUploader(props: {
  addExpenses: (expenses: Expense[]) => void;
}) {
  const [open, setOpen] = useState(false); // State to control the dialog visibility
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // State to store the selected image file
  const [preview, setPreview] = useState<string | null>(null); // State to store the image preview URL
  const [message, setMessage] = useState<string | null>(null); // State to store any message (e.g., success or error)

  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    let interval: any = null;
    if (sessionId) {
      let interval = setInterval(async () => {
        try {
          const result = await getReceiptProcessingStatus(sessionId);
          if (result.error) {
            if (result.error === "Image processing not finished yet") {
              console.log("Processing...");
            } else {
              console.error(result.error);
              setMessage(result.error);
              clearInterval(interval);
              setSessionId(null);
            }
          } else if (result.result) {
            console.log("Processing complete:", result.result);
            setMessage("Processing complete.");
            clearInterval(interval);
            setSessionId(null);
          }
        } catch (error) {
          console.error("Error during processing check:", error);
          setMessage("Failed to check processing status.");
          clearInterval(interval);
          setSessionId(null);
        }
      }, 500); // Check every 5 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
      setSessionId(null);
    };
  }, [sessionId]);

  // Function to handle the opening of the dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Function to handle the closing of the dialog and reset states
  const handleClose = () => {
    setOpen(false);

    // Uncomment below if want to reset selected image on close
    // setSelectedImage(null);
    // setPreview(null);
    // setMessage(null);
  };

  // Function to handle the change event when an image is selected
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedImage(file);

    // Generate a preview URL for the selected image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  // Function to handle the image upload process
  const handleUpload = async () => {
    if (!selectedImage) return;
    try {
      const response = await uploadReceiptImage(selectedImage); // Upload the image to the backend
      setSessionId(response.session_id ? response.session_id : null);
      setMessage("Image uploaded successfully"); // Set success message
      handleClose(); // Close the dialog
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("Error uploading image"); // Set error message
    }
  };

  return (
    <div>
      {/* File upload button that opens upload selection dialog */}
      <IconButton
        onClick={handleClickOpen}
        sx={{ padding: "0px", margin: "0px", marginLeft: "20px" }}
      >
        <DriveFolderUploadIcon sx={{ fontSize: 24 }} />
      </IconButton>
      {/* File upload dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            minWidth: "500px",
            padding: "16px",
          },
        }} // Set minimum width and padding of the dialog
      >
        <DialogContent
          sx={{
            margin: "0px",
            padding: "16px",
            overflow: "hidden",
          }}
        >
          <Typography
            sx={{
              fontSize: 20,
              margin: "0px",
              padding: "0px",
              paddingBottom: "16px",
            }}
            color="text.primary"
            gutterBottom
          >
            Upload Receipt
          </Typography>
          {/* Image selection input */}
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="upload-image">
              <Input
                accept="image/*"
                id="upload-image"
                type="file"
                onChange={handleImageChange}
              />
              <Button variant="contained" component="span" color="primary">
                Choose File
              </Button>
            </label>
          </div>
          {/* Preview image */}
          <div
            style={{
              maxHeight: "50vh", // Set the maximum height to 50% of the viewport height
              maxWidth: "50vw", // Set the maximum width to 50% of the viewport width
              overflow: "auto", // Add scrollbars if content exceeds the container size
            }}
          >
            {preview && (
              <img
                src={preview}
                alt="Preview"
                style={{ width: "100%", height: "100%", display: "block" }}
              />
            )}
          </div>
          {/* Error or Success message display */}
          {message && <Typography color="red">{message}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpload} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
