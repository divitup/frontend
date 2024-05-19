import axios from "axios";
import { UploadReceiptResponse } from "../Component/interface";

// Base URL for the API
let baseURL = "http://127.0.0.1:5000/";
axios.defaults.headers.post["Content-Type"] = "application/json";

// Function to get a hello message from the backend
export const fetchHelloMessage = async () => {
  try {
    const response = await axios.get(baseURL + "api/v1/hello");
    return response.data; // Returns the message from the server
  } catch (error) {
    console.error("Failed to fetch hello message:", error);
    throw error; // Rethrows the error to be handled by the caller
  }
};

// Function to upload an image to the backend server
export const uploadReceiptImage = async (
  file: File
): Promise<UploadReceiptResponse> => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onloadend = async () => {
      if (typeof reader.result === "string") {
        const base64String = reader.result.split(",")[1]; // Extract the base64 part

        try {
          // Posting to the '/api/v1/upload' endpoint
          const response = await axios.post(baseURL + "api/v1/upload", {
            image: base64String,
          });
          console.log(response);
          resolve(response.data);
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error("FileReader result is not a string"));
      }
    };

    reader.onerror = (error) => reject(error);

    // Convert image file to Data URL (base64)
    reader.readAsDataURL(file);
  });
};
