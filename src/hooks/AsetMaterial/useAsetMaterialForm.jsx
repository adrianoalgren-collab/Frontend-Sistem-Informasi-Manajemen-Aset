// ======================================================
// === IMPORT
// ======================================================

import { useState, useEffect } from "react"; // React state & effect
import api from "../../services/api"; // Service API untuk CRUD
import { useParams } from "react-router-dom"; // Ambil parameter URL

// ======================================================
// === CUSTOM HOOK FORM ASET MATERIAL
// ======================================================

/**
 * Custom Hook: useAsetMaterialForm
 * Logic khusus FORM (Tambah & Edit)
 */
export const useAsetMaterialForm = () => {

  // ======================================================
  // === ROUTING / URL PARAMS
  // ======================================================

  const { id } = useParams(); // Ambil ID dari URL (jika edit)

  // ======================================================
  // === STATE FORM
  // ======================================================

  const [form, setForm] = useState({
    kode: "",       // Kode aset
    nama: "",       // Nama aset
    jumlah: "",     // Jumlah / stok
    keterangan: "", // Keterangan tambahan
  });

  // ======================================================
  // === HANDLE CHANGE INPUT
  // ======================================================

  const handleChange = (e) => {
    setForm({
      ...form,                 // Copy state lama
      [e.target.name]: e.target.value, // Update field yang diubah
    });
  };

  // ======================================================
  // === STORE (TAMBAH DATA BARU)
  // ======================================================

  const storeAsetMaterial = async () => {
    return await api.post("/AddAsetMaterial", form); // POST ke API
  };

  // ======================================================
  // === FETCH BY ID (UNTUK EDIT)
  // ======================================================

  useEffect(() => {
    const fetchById = async () => {
      try {
        const res = await api.get(`/EditAsetMaterial/${id}`); // GET data by ID

        setForm({
          kode: res.data.kode,                     // Set kode
          nama: res.data.nama,                     // Set nama
          jumlah: res.data.jumlah,                 // Set jumlah
          keterangan: res.data.keterangan ?? "",   // Set keterangan, default ""
        });

      } catch (error) {
        console.error("Gagal mengambil data berdasarkan ID", error); // Log error
      }
    };

    if (id) {
      fetchById(); // Panggil fetch jika id tersedia (edit mode)
    }
  }, [id]);

  // ======================================================
  // === UPDATE DATA
  // ======================================================

  const updateAsetMaterial = async () => {
    return await api.put(`/UpdateAsetMaterial/${id}`, form); // PUT ke API
  };

  // ======================================================
  // === RETURN STATE & FUNCTION
  // ======================================================

  return {
    form,                // State form
    handleChange,        // Function untuk input change
    storeAsetMaterial,   // Function simpan data baru
    updateAsetMaterial,  // Function update data
    id,                  // ID dari URL (untuk edit)
  };
};