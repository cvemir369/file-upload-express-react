import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [fileInfo, setFileInfo] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = (e) => {
    console.log(e.target.files);
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadStatus("File uploaded successfully!");
      setFileInfo(response.data.fileInfo);
      setImageUrl(`http://localhost:3000/${response.data.fileInfo.path}`); // Set the image URL
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Failed to upload file. File type not allowed.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>File Upload with React and Express</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button
          type="submit"
          style={{ marginTop: "10px", padding: "10px 20px", cursor: "pointer" }}
        >
          Upload
        </button>
      </form>

      {uploadStatus && <p>{uploadStatus}</p>}

      {fileInfo && (
        <div style={{ marginTop: "20px" }}>
          <h2>File Details:</h2>
          <p>
            <strong>Original Name:</strong> {fileInfo.originalName}
          </p>
          <p>
            <strong>File Name:</strong> {fileInfo.fileName}
          </p>
          <p>
            <strong>Size:</strong> {fileInfo.size} bytes
          </p>
          <p>
            <strong>MIME Type:</strong> {fileInfo.mimetype}
          </p>
          <p>
            <strong>Path:</strong> <a href={imageUrl}>{imageUrl}</a>
          </p>
        </div>
      )}

      {imageUrl && (
        <div style={{ marginTop: "20px" }}>
          <h2>Uploaded Image:</h2>
          <img
            src={imageUrl}
            alt="Uploaded"
            style={{
              maxWidth: "100%",
              height: "auto",
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "5px",
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
