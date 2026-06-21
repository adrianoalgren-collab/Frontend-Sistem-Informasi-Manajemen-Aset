// ======================================================
// === IMPORT
// ======================================================

import { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import { useParams } from "react-router-dom";

// ======================================================
// === CUSTOM HOOK FORM REQUEST PEMAKAIAN
// ======================================================

export const useRequestPemakaianForm = ({ defaultValues = {} } = {}) => {
  const { id } = useParams();

  // ======================================================
  // === TANGGAL HARI INI
  // ======================================================

  const today = new Date().toISOString().split("T")[0];

  // ======================================================
  // === REF FILE INPUT
  // ======================================================

  const fileInputRef = useRef(null);

  // ======================================================
  // === STATE FORM
  // ======================================================

  const [form, setForm] = useState({
    id_barang_pakai: "",
    jumlah_pemakaian: "",
    keterangan_pemakaian: "",
    id_department: "",
    id_user: "",
    status_approval: "Pending",
    catatan_manager: "",
    file_request: "",
    tanggal_request: today,

    // relasi untuk readonly detail
    department: null,
    user: null,
    barangPakai: null,

    ...defaultValues,
  });

  // ======================================================
  // === STATE FILE UI
  // ======================================================

  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  // ======================================================
  // === STATE DAFTAR BARANG PAKAI (DROPDOWN)
  // ======================================================

  const [daftarBarangPakai, setDaftarBarangPakai] = useState([]);
  const [loadingBarangPakai, setLoadingBarangPakai] = useState(false);

  useEffect(() => {
    const fetchBarangPakai = async () => {
      try {
        setLoadingBarangPakai(true);

        const res = await api.get("/asetbarangpakai");
        const data = res.data.data || res.data;

        setDaftarBarangPakai(data || []);
      } catch (error) {
        console.error("Gagal mengambil daftar aset barang pakai:", error);
      } finally {
        setLoadingBarangPakai(false);
      }
    };

    fetchBarangPakai();
  }, []);

  // ======================================================
  // === HANDLE CHANGE
  // ======================================================

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file") {
      setForm((prev) => ({
        ...prev,
        file_request: files[0] ?? null,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // ======================================================
  // === FILE HELPERS
  // ======================================================

  const applyFile = (file) => {
    if (!file) return;

    setSelectedFile(file);

    setForm((prev) => ({
      ...prev,
      file_request: file,
    }));
  };

  const removeFile = () => {
    setSelectedFile(null);

    setForm((prev) => ({
      ...prev,
      file_request: null,
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    applyFile(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    applyFile(file);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + " KB";
    }

    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = (name) => {
    if (!name) return "fa-file";

    if (name.endsWith(".pdf")) {
      return "fa-file-pdf";
    }

    if (
      name.endsWith(".doc") ||
      name.endsWith(".docx")
    ) {
      return "fa-file-word";
    }

    return "fa-file-alt";
  };

  // ======================================================
  // === STORE REQUEST
  // ======================================================

  const storeRequestPemakaian = async () => {
    try {
      const formData = new FormData();

      formData.append(
        "id_barang_pakai",
        form.id_barang_pakai
      );

      formData.append(
        "jumlah_pemakaian",
        form.jumlah_pemakaian
      );

      formData.append(
        "keterangan_pemakaian",
        form.keterangan_pemakaian
      );

      formData.append(
        "id_department",
        form.id_department
      );

      formData.append(
        "id_user",
        form.id_user
      );

      formData.append(
        "status_approval",
        form.status_approval
      );

      formData.append(
        "tanggal_request",
        form.tanggal_request
      );

      formData.append(
        "file_request",
        form.file_request
      );

      return await api.post(
        "/request/pemakaian",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );
    } catch (error) {
      console.log("ERROR:");
      console.log(error.response);

      console.log("ERROR DATA:");
      console.log(error.response?.data);

      throw error;
    }
  };

  // ======================================================
  // === FETCH DETAIL BY ID
  // ======================================================

  useEffect(() => {
    if (!id) return;

    const fetchById = async () => {
      try {
        const response = await api.get(
          `/request/pemakaian/${id}`
        );

        // FIX PENTING:
        // backend return:
        // { message: "...", data: {...} }

        const data = response.data.data;

        if (!data) {
          console.error(
            "Data request pemakaian kosong"
          );
          return;
        }

        setForm((prev) => ({
          ...prev,

          id_barang_pakai:
            data.id_barang_pakai || "",

          jumlah_pemakaian:
            data.jumlah_pemakaian || "",

          keterangan_pemakaian:
            data.keterangan_pemakaian || "",

          id_department:
            data.id_department || "",

          id_user:
            data.id_user || "",

          status_approval:
            data.status_approval || "Pending",

          catatan_manager:
            data.catatan_manager || "",

          tanggal_request:
            data.tanggal_request || today,

          file_request:
            data.file_request || "",

          // relasi readonly
          department:
            data.department || null,

          user:
            data.user || null,

          barangPakai:
            data.barang_pakai || null,
        }));
      } catch (error) {
        console.error(
          "Gagal mengambil detail request pemakaian:",
          error
        );
      }
    };

    fetchById();
  }, [id]);

  // ======================================================
  // === UPDATE REQUEST
  // ======================================================

  const updateRequestPemakaian = async () => {
    const formData = new FormData();

    formData.append(
      "status_approval",
      form.status_approval
    );

    formData.append(
      "catatan_manager",
      form.catatan_manager || ""
    );

    formData.append("_method", "PUT");

    return await api.post(
      `/request/pemakaian/${id}`,
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );
  };

  // ======================================================
  // === RETURN
  // ======================================================

  return {
    form,
    setForm,
    handleChange,

    storeRequestPemakaian,
    updateRequestPemakaian,

    id,
    today,

    fileInputRef,
    selectedFile,
    dragOver,
    setDragOver,

    handleDrop,
    handleFileInput,
    removeFile,

    formatSize,
    getFileIcon,

    // dropdown barang pakai
    daftarBarangPakai,
    loadingBarangPakai,
  };
};