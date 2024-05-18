import axios from "axios";

// Upload an image to backend server to extract expenses
export const uploadReceiptImage = async (file: File) => {
  // Encode image to base64
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onloadend = async () => {
      if (typeof reader.result === "string") {
        const base64String = reader.result.split(",")[1]; // Extract the base64 part
        try {
          const response = await axios.post("http://localhost:3000/upload", {
            image: base64String,
            name: file.name,
          });
          resolve(response.data);
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error("FileReader result is not a string"));
      }
    };

    reader.onerror = (error) => reject(error);

    reader.readAsDataURL(file);
  });
};
