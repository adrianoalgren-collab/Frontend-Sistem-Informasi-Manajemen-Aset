// ======================================================
// === IMPORT
// ======================================================

import { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import { useParams } from "react-router-dom";

// ======================================================
// === CUSTOM HOOK FORM REQUEST PERBAIKAN
// ======================================================

export const useRequestPerbaikanForm = ({ defaultValues = {} } = {}) => {

  // ======================================================
  // === PARAMS
  // ======================================================

  const params = useParams();
  const id = params?.id;

  // ======================================================
  // === BASIC STATE
  // ======================================================

  const today = new Date().toISOString().split("T")[0];
  const fileInputRef = useRef(null);

  // ======================================================
  // === FORM STATE
  //
  // Nama field disesuaikan 1:1 dengan kolom FK di migration:
  //   id_operasional  → FK ke aset_operasional
  //   id_kodebarang   → FK ke kode_barang
  //   id_user         → FK ke users
  // ======================================================

  const [form, setForm] = useState({
    id_operasional: "",   // untuk filter dropdown kode barang
    id_kodebarang:  "",   // yang dikirim ke backend
    id_user:        "",
    file_request:   null,
    status_request: "Pending",
    ...defaultValues,
  });

  // ======================================================
  // === UI STATE
  // ======================================================

  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  // ======================================================
  // === DROPDOWN STATE
  // ======================================================

  // Struktur yang diharapkan dari backend:
  // [
  //   {
  //     id_operasional: 1,
  //     nama_asetoperasional: "Laptop Dell",
  //     kode_barang: [
  //       { id_kodebarang: 10, kode_barang: "OFF001", kondisi_asetoperasional: "Baik" },
  //       { id_kodebarang: 11, kode_barang: "OFF002", kondisi_asetoperasional: "Rusak Ringan" },
  //     ]
  //   },
  //   ...
  // ]
  const [asetList, setAsetList] = useState([]);

  // Unit (kode_barang) dari aset yang sedang dipilih
  const [kodeList, setKodeList] = useState([]);

  // Data relasi lengkap untuk tampilan readonly di halaman edit
  const [detail, setDetail] = useState(null);

  // ======================================================
  // === HANDLE CHANGE INPUT
  // ======================================================

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files?.[0] || null;
      setSelectedFile(file);
      setForm((prev) => ({ ...prev, file_request: file }));
      return;
    }

    // Saat id_operasional berubah → reset id_kodebarang dan update kodeList
    if (name === "id_operasional") {
      const selected = asetList.find(
        (a) => String(a.id_operasional) === String(value)
      );
      setKodeList(selected?.kode_barang ?? []);
      setForm((prev) => ({ ...prev, id_operasional: value, id_kodebarang: "" }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ======================================================
  // === FILE HANDLING
  // ======================================================

  const applyFile = (file) => {
    if (!file) return;
    setSelectedFile(file);
    setForm((prev) => ({ ...prev, file_request: file }));
  };

  const removeFile = () => {
    setSelectedFile(null);
    setForm((prev) => ({ ...prev, file_request: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    applyFile(e.dataTransfer.files?.[0]);
  };

  const handleFileInput = (e) => {
    applyFile(e.target.files?.[0]);
  };

  const formatSize = (bytes = 0) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = (name = "") => {
    if (name.endsWith(".pdf")) return "fa-file-pdf";
    if (name.endsWith(".doc") || name.endsWith(".docx")) return "fa-file-word";
    return "fa-file-alt";
  };

  // ======================================================
  // === FETCH DATA ASET OPERASIONAL + KODE BARANG
  // ======================================================
  //
  // Endpoint ini harus mengembalikan aset beserta relasi
  // kode_barang-nya (eager load di Laravel):
  //
  //   AsetOperasional::with('kodeBarang')->get()
  //
  // Pastikan route-nya: GET /asetoperasional
  // dan response-nya mengandung field "kode_barang" (array)
  // di setiap item.

  useEffect(() => {
    const fetchAsetOperasional = async () => {
      try {
        const res = await api.get("/asetoperasional");

        const data =
          res.data?.data ||
          res.data?.aset_operasional ||
          res.data ||
          [];

        setAsetList(Array.isArray(data) ? data : []);

      } catch (error) {
        console.error("Gagal mengambil data aset operasional:", error);
        setAsetList([]);
      }
    };

    fetchAsetOperasional();
  }, []);

  // ======================================================
  // === FETCH DETAIL BY ID (EDIT)
  // ======================================================

  useEffect(() => {
    if (!id) return;

    const fetchById = async () => {
      try {
        const res = await api.get(`/request/perbaikan/${id}`);
        const data = res.data?.data ?? res.data;
        if (!data) return;

        // Simpan data lengkap untuk readonly display
        setDetail(data);

        // Gunakan nama kolom sesuai migration (id_operasional, id_kodebarang, id_user)
        setForm((prev) => ({
          ...prev,
          id_operasional: data.id_operasional || "",
          id_kodebarang:  data.id_kodebarang  || "",
          id_user:        data.id_user        || "",
          status_request: data.status_request || "Pending",
          file_request:   null,
        }));

      } catch (error) {
        console.error("Gagal mengambil detail request perbaikan:", error);
      }
    };

    fetchById();
  }, [id]);

  // Saat edit: sync kodeList setelah asetList & form.id_operasional keduanya terisi
  useEffect(() => {
    if (!form.id_operasional || !asetList.length) return;

    const selected = asetList.find(
      (a) => String(a.id_operasional) === String(form.id_operasional)
    );
    setKodeList(selected?.kode_barang ?? []);
  }, [form.id_operasional, asetList]);

  // ======================================================
  // === STORE DATA
  // ======================================================

  const storeRequestPerbaikan = async () => {
    const formData = new FormData();

    // Kirim dengan nama field 1:1 sesuai kolom DB & validasi Laravel
    formData.append("id_operasional", form.id_operasional);
    formData.append("id_kodebarang",  form.id_kodebarang);
    formData.append("id_user",        form.id_user);

    if (form.file_request) {
      formData.append("file_request", form.file_request);
    }

    return await api.post("/request/perbaikan", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  // ======================================================
  // === UPDATE DATA
  // ======================================================

  const updateRequestPerbaikan = async (id) => {
    const formData = new FormData();

    // Kirim dengan nama field 1:1 sesuai kolom DB & validasi Laravel
    formData.append("id_operasional", form.id_operasional);
    formData.append("id_kodebarang",  form.id_kodebarang);
    formData.append("id_user",        form.id_user);
    formData.append("status_request", form.status_request);

    if (form.file_request) {
      formData.append("file_request", form.file_request);
    }

    formData.append("_method", "PUT");

    return await api.post(`/request/perbaikan/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  // ======================================================
  // === RETURN
  // ======================================================

  return {
    form,
    handleChange,

    storeRequestPerbaikan,
    updateRequestPerbaikan,

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

    asetList,
    kodeList,
    detail,   // ← data relasi lengkap untuk readonly display
  };
};