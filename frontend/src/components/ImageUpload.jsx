import axios from "axios";
import React, { useState } from "react";

const ImageUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an image first!");
    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/vendor/uploadImage`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (onUpload) onUpload(data.url);

      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border border-gray-300 rounded-lg shadow-md w-full max-w-md bg-orange-50">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-green-50 file:text-green-700
                   hover:file:bg-green-100"
      />

      {preview && (
        <div className="w-80 h-32 overflow-hidden rounded-lg border relative">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white font-bold">
              Uploading...
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`px-4 py-2 cursor-pointer font-semibold rounded-lg shadow transition
                    ${uploading ? "!bg-gray-400" : "!bg-green-600 hover:!bg-green-700 !text-white"}`}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default ImageUpload;
