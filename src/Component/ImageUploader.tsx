import React, { useState, ChangeEvent } from "react";
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
import { uploadReceiptImage } from "../Service/api";
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
      console.log(response); // Print the response from the backend
      if (response?.result) {
        console.error("Error: did not receive receipt scan result", response);
      }
      const newExpenses = extractExpensesFromReceipt((response as any).result);
      props.addExpenses(newExpenses);
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Upload Image</DialogTitle>
        <DialogContent>
          {/* Image selection input */}
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
          {/* Preview image */}
          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{ maxWidth: "100%", marginTop: "10px" }}
            />
          )}
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
