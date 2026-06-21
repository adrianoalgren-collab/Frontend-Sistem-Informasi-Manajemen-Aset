// ======================================================
// === IMPORT
// ======================================================

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";


// ======================================================
// === HOOK: useAsetBarangPakaiForm
// Hook ini dipakai bersama oleh AddAsetBarangPakai dan EditAsetBarangPakai.
// Mengelola nilai form, perubahan input, ambil data lama (edit),
// simpan data baru, dan update data yang sudah ada.
// ======================================================

export const useAsetBarangPakaiForm = () => {

  const { id }   = useParams();
  const navigate = useNavigate();

  // ── NILAI FORM ──
  const [form, setForm] = useState({
    kode_asetbarangpakai:     "",
    nama_asetbarangpakai:     "",
    lokasi_asetbarangpakai:   "",
    stok_asetbarangpakai:     1,
    satuan_asetbarangpakai:   "pcs",
    foto_asetbarangpakai:     null,
  });

  const [showSuccess, setShowSuccess] = useState(false);


  // ======================================================
  // === HANDLE PERUBAHAN INPUT
  // ======================================================

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    // kalau input file (foto), ambil file-nya langsung
    if (type === "file") {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };


  // ======================================================
  // === AMBIL DATA LAMA (untuk halaman edit)
  // ======================================================

  useEffect(() => {
    if (!id) return;

    const fetchById = async () => {
      try {
        const res  = await api.get(`/asetbarangpakai/${id}`);
        const data = res.data.data;

        setForm({
          kode_asetbarangpakai:     data.kode_asetbarangpakai     ?? "",
          nama_asetbarangpakai:     data.nama_asetbarangpakai     ?? "",
          lokasi_asetbarangpakai:   data.lokasi_asetbarangpakai   ?? "",
          stok_asetbarangpakai:     data.stok_asetbarangpakai     ?? 1,
          satuan_asetbarangpakai:   data.satuan_asetbarangpakai   ?? "pcs",
          foto_asetbarangpakai:     null, // foto tidak diisi ulang, biarkan kosong
        });

      } catch (error) {
        console.error("Gagal mengambil data aset barang pakai berdasarkan ID", error);
      }
    };

    fetchById();
  }, [id]);


  // ======================================================
  // === SIMPAN DATA BARU (untuk halaman tambah)
  // Pakai FormData karena ada upload foto.
  // ======================================================

  const storeAsetBarangPakai = async () => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        formData.append(key, value);
      }
    });
    return await api.post("/asetbarangpakai", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      await storeAsetBarangPakai();
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/asetbarangpakai");
      }, 2000);
    } catch {
      alert("Gagal menyimpan data aset barang pakai");
    }
  };


  // ======================================================
  // === UPDATE DATA (untuk halaman edit)
  // Pakai FormData + method spoofing _method=PUT untuk file upload.
  // ======================================================

  const updateAsetBarangPakai = async () => {
    const formData = new FormData();
    formData.append("_method", "PUT"); // Laravel method spoofing
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        formData.append(key, value);
      }
    });
    return await api.post(`/asetbarangpakai/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      await updateAsetBarangPakai();
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/asetbarangpakai");
      }, 2000);
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui data aset barang pakai");
    }
  };


  // ======================================================
  // === RETURN
  // ======================================================

  return {
    form,
    handleChange,
    storeAsetBarangPakai,
    updateAsetBarangPakai,
    id,
    navigate,
    showSuccess,
    handleSubmitAdd,
    handleSubmitEdit,
  };
};