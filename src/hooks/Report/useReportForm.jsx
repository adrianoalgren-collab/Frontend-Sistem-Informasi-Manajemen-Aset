import { useState, useEffect, useRef, useCallback } from "react";
import api from "../../services/api";
import { useParams } from "react-router-dom";

// ── Konstanta validasi file (sinkron dengan backend) ──
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_SIZE_MB    = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// ── Utility ──────────────────────────────────────────
export const formatSize = (bytes) => {
  if (bytes < 1024)        return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

export const getFileIcon = (name) => {
  if (!name) return "fa-file";
  if (name.endsWith(".pdf"))                           return "fa-file-pdf";
  if (name.endsWith(".doc") || name.endsWith(".docx")) return "fa-file-word";
  return "fa-file-alt";
};

const validateFile = (file) => {
  if (!ALLOWED_MIME_TYPES.includes(file.type))
    return "File harus berformat PDF, DOC, atau DOCX.";
  if (file.size > MAX_FILE_SIZE_BYTES)
    return `Ukuran file maksimal ${MAX_FILE_SIZE_MB}MB.`;
  return null;
};

// ======================================================
// === CUSTOM HOOK FORM REPORT
// ======================================================

export const useReportForm = ({ defaultValues = {} } = {}) => {

  const { id } = useParams();
  const isEdit = Boolean(id);
  const fileInputRef = useRef(null);

  // ── STATE FORM ───────────────────────────────────────
  const [form, setForm] = useState({
    judul:   "",
    tanggal: new Date().toISOString().split("T")[0],
    status:  "pending", // dibutuhkan EditReport untuk badge & select admin
    ...defaultValues,
  });

  // ── STATE UI ─────────────────────────────────────────
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver,     setDragOver]     = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState(null);
  const [fileError,    setFileError]    = useState(null);

  // ── HANDLE CHANGE INPUT ──────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ── FILE HELPERS ─────────────────────────────────────
  const applyFile = (file) => {
    if (!file) return;
    const validationError = validateFile(file);
    if (validationError) { setFileError(validationError); return; }
    setFileError(null);
    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop      = (e) => { e.preventDefault(); setDragOver(false); applyFile(e.dataTransfer.files[0]); };
  const handleFileInput = (e) => applyFile(e.target.files[0]);

  // ── FETCH BY ID ──────────────────────────────────────
  const fetchById = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res  = await api.get(`/report/${id}`);
      const data = res.data?.data ?? res.data;
      if (!data) throw new Error("Data kosong");

      setForm((prev) => ({
        ...prev,
        judul:   data.judul   || "",
        tanggal: data.tanggal || "",
        status:  data.status  || "pending", // set status untuk badge & select admin
      }));
    } catch {
      setError("Gagal mengambil data report. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchById(); }, [fetchById]);

  // ── STORE ─────────────────────────────────────────────
  const storeReport = async () => {
    // Validasi file wajib ada sebelum kirim
    if (!selectedFile) {
      setFileError("File wajib diupload.");
      throw new Error("File wajib diupload.");
    }

    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("judul",   form.judul);
      formData.append("tanggal", form.tanggal);
      formData.append("file",    selectedFile);
      // status tidak dikirim — backend kunci ke 'pending'

      return await api.post("/report", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (err) {
      setError("Gagal menyimpan report. Silakan coba lagi.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ── UPDATE ────────────────────────────────────────────
  const updateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("judul",   form.judul);
      formData.append("tanggal", form.tanggal);
      formData.append("status",  form.status); // admin bisa ubah status
      formData.append("_method", "PUT");

      // File opsional saat edit
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      return await api.post(`/report/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (err) {
      setError("Gagal mengupdate report. Silakan coba lagi.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ── RETURN ───────────────────────────────────────────
  return {
    form,
    handleChange,
    storeReport,
    updateReport,
    id,
    isEdit,
    loading,
    error,
    fileError,
    fileInputRef,
    selectedFile,
    dragOver,      setDragOver,
    handleDrop,
    handleFileInput,
    removeFile,
  };
};