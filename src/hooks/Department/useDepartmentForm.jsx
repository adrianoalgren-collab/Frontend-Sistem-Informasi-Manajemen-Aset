// ======================================================
// === IMPORT
// ======================================================

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api"; // service untuk panggil API backend


// ======================================================
// === HOOK: useDepartmentForm
// Hook ini dipakai bersama oleh AddDepartment dan EditDepartment.
// Mengelola nilai form, perubahan input, ambil data lama (edit),
// simpan data baru, dan update data yang sudah ada.
// ======================================================

export const useDepartmentForm = () => {

  // ambil ID dari URL — ada isinya kalau halaman edit, kosong kalau tambah
  const { id }   = useParams();

  // dipakai untuk redirect setelah simpan berhasil
  const navigate = useNavigate();


  // ── NILAI FORM ──
  // Semua field diinisialisasi kosong.
  // Kalau edit, nilai ini akan diisi ulang saat data lama berhasil diambil.
  const [form, setForm] = useState({
    kode_department:            "",
    nama_department:            "",
    penanggungjawab_department: "",
    email_department:           "",
    nomor_telepon_department:   "",
  });

  // true saat data berhasil disimpan — dipakai untuk tampilkan modal sukses
  const [showSuccess, setShowSuccess] = useState(false);


  // ======================================================
  // === HANDLE PERUBAHAN INPUT
  // Dipanggil setiap kali user mengetik di salah satu field.
  // Mengupdate hanya field yang berubah, sisanya tetap.
  // ======================================================

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  // ======================================================
  // === AMBIL DATA LAMA (untuk halaman edit)
  // Dijalankan otomatis saat id tersedia di URL.
  // Mengisi form dengan data yang sudah ada di database.
  // ======================================================

  useEffect(() => {
    if (!id) return; // kalau tidak ada id, berarti halaman tambah — skip

    const fetchById = async () => {
      try {
        const res  = await api.get(`/department/${id}`);
        const data = res.data.data;

        // isi form dengan data lama, fallback ke string kosong kalau null
        setForm({
          kode_department:            data.kode_department            ?? "",
          nama_department:            data.nama_department            ?? "",
          penanggungjawab_department: data.penanggungjawab_department ?? "",
          email_department:           data.email_department           ?? "",
          nomor_telepon_department:   data.nomor_telepon_department   ?? "",
        });

      } catch (error) {
        console.error("Gagal mengambil data department berdasarkan ID", error);
      }
    };

    fetchById();
  }, [id]); // dijalankan ulang kalau id berubah


  // ======================================================
  // === SIMPAN DATA BARU (untuk halaman tambah)
  // Kirim data form ke API dengan method POST.
  // ======================================================

  const storeDepartment = async () => {
    return await api.post("/department", form);
  };

  // fungsi submit untuk AddDepartment
  const handleSubmitAdd = (e) => {
    e.preventDefault(); // cegah halaman reload
    storeDepartment()
      .then(() => {
        setShowSuccess(true);
        // setelah 2 detik, tutup modal dan pindah ke halaman daftar
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/indexDepartment");
        }, 2000);
      })
      .catch(() => alert("Gagal menyimpan data department"));
  };


  // ======================================================
  // === UPDATE DATA (untuk halaman edit)
  // Kirim data form ke API dengan method PUT + ID di URL.
  // ======================================================

  const updateDepartment = async () => {
    return await api.put(`/department/${id}`, form);
  };

  // fungsi submit untuk EditDepartment
  const handleSubmitEdit = async (e) => {
    e.preventDefault(); // cegah halaman reload
    try {
      await updateDepartment();
      setShowSuccess(true);
      // setelah 2 detik, tutup modal dan pindah ke halaman daftar
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/indexDepartment");
      }, 2000);
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui data department");
    }
  };


  // ======================================================
  // === RETURN
  // Kembalikan semua state dan fungsi yang dibutuhkan komponen.
  // ======================================================

  return {
    form,             // nilai tiap field form
    handleChange,     // fungsi update field saat user mengetik
    storeDepartment,  // kirim data baru ke API (jarang dipakai langsung)
    updateDepartment, // kirim perubahan ke API (jarang dipakai langsung)
    id,               // ID dari URL (ada saat edit, null saat tambah)
    navigate,         // fungsi pindah halaman
    showSuccess,      // status berhasil simpan (untuk modal)
    handleSubmitAdd,  // submit untuk halaman tambah
    handleSubmitEdit, // submit untuk halaman edit
  };
};