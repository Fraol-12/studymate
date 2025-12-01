import React, { useRef, useState } from "react";
import api from "../utils/api";
import { Upload } from "lucide-react";

export default function FileUploader({ notebookId, onExtracted }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !notebookId) return;
    const form = new FormData();
    form.append("file", file);
    form.append("notebook_id", notebookId);
    setUploading(true);
    try {
      const res = await api.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onExtracted?.(res.data.extracted_text);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading || !notebookId}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs md:text-sm bg-white border border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-slate-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Upload size={16} />
        {uploading ? "Uploading…" : "Upload PDF / DOCX / Image"}
      </button>
    </div>
  );
}


