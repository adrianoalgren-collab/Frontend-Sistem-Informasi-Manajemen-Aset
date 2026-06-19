// ======================================================
// === IMPORT
// ======================================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"; // service untuk panggil API backend


// ======================================================
// === HOOK: useDepartmentList
// Hook ini mengelola semua kebutuhan halaman daftar department:
// ambil data, cari, urutkan, paginasi, hapus, dan state modal.
// Komponen tinggal pakai hasilnya tanpa perlu urus logic sendiri.
// ======================================================

export const useDepartmentList = () => {

  // dipakai untuk pindah halaman (navigasi)
  const navigate = useNavigate();

  // ── DATA ──
  const [department,   setDepartment]   = useState([]);   // semua data department dari API
  const [loading,      setLoading]      = useState(true); // true saat data sedang diambil

  // ── SEARCH ──
  const [search,       setSearch]       = useState("");   // teks yang diketik di kotak cari

  // ── PAGINATION ──
  const [currentPage,  setCurrentPage]  = useState(1);   // halaman yang sedang aktif
  const [itemsPerPage, setItemsPerPage] = useState(10);  // berapa baris per halaman

  // ── SORTING ──
  const [sortBy,       setSortBy]       = useState("id_department"); // kolom yang diurutkan
  const [sortDir,      setSortDir]      = useState("asc");           // arah urutan: asc = naik, desc = turun

  // ── MODAL HAPUS ──
  const [showModal,    setShowModal]    = useState(false); // buka/tutup modal konfirmasi hapus
  const [selectedId,   setSelectedId]  = useState(null);  // id department yang mau dihapus

  // ── MODAL INFO ──
  const [selectedDepartment, setSelectedDepartment] = useState(null);  // data department yang dipilih
  const [showInfoModal,      setShowInfoModal]       = useState(false); // buka/tutup modal info


  // ======================================================
  // === AMBIL DATA DARI API
  // Dipanggil sekali saat halaman pertama kali dibuka.
  // ======================================================

  const fetchDepartment = async () => {
    try {
      const res = await api.get("/department");

      // tambahkan nomor urut ke setiap item
      setDepartment(res.data.map((item, index) => ({
        ...item,
        no: index + 1,
      })));
    } catch (error) {
      console.error("Gagal mengambil data department", error);
    } finally {
      setLoading(false); // matikan loading baik berhasil maupun gagal
    }
  };

  useEffect(() => {
    fetchDepartment(); // jalankan saat komponen pertama kali muncul
  }, []);


  // ======================================================
  // === FILTER PENCARIAN
  // Menyaring data berdasarkan teks yang diketik user.
  // Pencarian berlaku di beberapa kolom sekaligus.
  // ======================================================

  const filteredData = department.filter(
    (item) =>
      item.nama_department?.toLowerCase().includes(search.toLowerCase())             ||
      item.kode_department?.toLowerCase().includes(search.toLowerCase())             ||
      item.penanggungjawab_department?.toLowerCase().includes(search.toLowerCase())  ||
      item.contact_department?.toLowerCase().includes(search.toLowerCase())
  );


  // ======================================================
  // === SORTING
  // Mengurutkan data hasil filter berdasarkan kolom dan arah yang dipilih.
  // ======================================================

  const sortedData = [...filteredData].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];

    // kalau salah satu null, taruh di paling bawah
    if (aVal == null) return 1;
    if (bVal == null) return -1;

    // kalau angka, bandingkan langsung
    if (typeof aVal === "number") {
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    }

    // kalau teks, pakai localeCompare agar huruf besar/kecil tidak berpengaruh
    return sortDir === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });


  // ======================================================
  // === PAGINATION
  // Potong data sesuai halaman aktif dan jumlah per halaman.
  // ======================================================

  const totalPages  = Math.max(1, Math.ceil(sortedData.length / itemsPerPage)); // minimal 1 halaman
  const startIndex  = (currentPage - 1) * itemsPerPage;                         // index awal baris
  const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);  // data untuk halaman ini


  // ======================================================
  // === HAPUS DATA
  // Kirim request DELETE ke API, lalu hapus dari state lokal
  // agar tabel langsung terupdate tanpa perlu fetch ulang.
  // ======================================================

  const handleDelete = async (id_department) => {
    try {
      await api.delete(`/department/${id_department}`);

      // hapus dari state lokal
      setDepartment((prev) =>
        prev.filter((item) => item.id_department !== id_department)
      );
    } catch (error) {
      alert("Gagal menghapus data department");
    }
  };


  // ======================================================
  // === RETURN
  // Kembalikan semua state dan fungsi yang dibutuhkan komponen.
  // ======================================================

  return {
    // data & loading
    department,
    loading,

    // search
    search,       setSearch,
    filteredData,

    // pagination
    currentPage,  setCurrentPage,
    itemsPerPage, setItemsPerPage,
    totalPages,
    currentData,
    startIndex,

    // sorting
    sortedData,
    sortBy,       setSortBy,
    sortDir,      setSortDir,

    // aksi
    handleDelete,
    navigate,

    // modal hapus
    showModal,    setShowModal,
    selectedId,   setSelectedId,

    // modal info
    selectedDepartment, setSelectedDepartment,
    showInfoModal,      setShowInfoModal,
  };
};