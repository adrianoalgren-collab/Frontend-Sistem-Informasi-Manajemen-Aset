// ======================================================
// FILE: hooks/User/useUserList.js
// FUNGSI: Mengelola semua kebutuhan halaman daftar user:
//         ambil data, cari, urutkan, paginasi, hapus,
//         state modal, dan handler UI.
// ======================================================

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";



export const useUserList = () => {

  const navigate = useNavigate();

  // ── DATA ──
  const [user,         setUser]         = useState([]);
  const [loading,      setLoading]      = useState(true);

  // ── SEARCH ──
  const [search,       setSearch]       = useState("");

  // ── PAGINATION ──
  const [currentPage,  setCurrentPage]  = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ── SORTING ──
  const [sortBy,       setSortBy]       = useState("id");
  const [sortDir,      setSortDir]      = useState("asc");

  // ── MODAL HAPUS ──
  const [showModal,    setShowModal]    = useState(false);
  const [selectedId,   setSelectedId]  = useState(null);


  // ======================================================
  // AMBIL DATA DARI API
  // Dipanggil sekali saat halaman pertama kali dibuka.
  // ======================================================

  const fetchUser = async () => {
    try {
      const res     = await api.get("/user");
      const rawData = res.data.data || [];

      // Normalisasi data: ambil nama relasi (department & role)
      const dataWithExtras = rawData.map((item, index) => ({
        ...item,
        no:         index + 1,
        department: item.department?.nama_department || "-",
        role:       item.role?.nama_role             || "-",
      }));

      setUser(dataWithExtras);
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    } finally {
      setLoading(false); // matikan loading, baik berhasil maupun gagal
    }
  };

  useEffect(() => {
    fetchUser(); // jalankan sekali saat komponen mount
  }, []);


  // ======================================================
  // FILTER PENCARIAN
  // Saring data berdasarkan nama, email, department, atau role.
  // ======================================================

  const filteredData = user.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())       ||
    item.email?.toLowerCase().includes(search.toLowerCase())      ||
    item.department?.toLowerCase().includes(search.toLowerCase()) ||
    item.role?.toLowerCase().includes(search.toLowerCase())
  );


  // ======================================================
  // SORTING
  // Urutkan hasil filter berdasarkan kolom & arah yang dipilih.
  // ======================================================

  const sortedData = [...filteredData].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];

    if (aVal == null) return 1;   // null → taruh paling bawah
    if (bVal == null) return -1;

    if (typeof aVal === "number") {
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    }

    // teks: pakai localeCompare agar huruf besar/kecil tidak berpengaruh
    return sortDir === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });


  // ======================================================
  // PAGINATION
  // Potong data sesuai halaman aktif dan jumlah baris per halaman.
  // ======================================================

  const totalPages  = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const startIndex  = (currentPage - 1) * itemsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);


  // ======================================================
  // HAPUS DATA
  // Kirim DELETE ke API, lalu update state lokal langsung
  // agar tabel refresh tanpa perlu fetch ulang ke server.
  // ======================================================

  const handleDelete = async (id) => {
    try {
      await api.delete(`/user/${id}`);
      setUser((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      alert("Gagal menghapus data user");
      console.error(error);
    }
  };


  // ======================================================
  // HANDLER UI
  // Dikumpulkan di hook supaya komponen tidak perlu tahu
  // detail logikanya — cukup panggil fungsinya.
  // ======================================================

  // Buka modal dan simpan id user yang dipilih.
  // useCallback: referensi fungsi stabil → baris tabel tidak re-render ulang.
  const openDeleteModal = useCallback((id) => {
    setSelectedId(id);
    setShowModal(true);
  }, [setSelectedId, setShowModal]);

  // Dipanggil saat user klik "Ya, Hapus" di modal.
  const confirmDelete = useCallback(() => {
    if (selectedId) {
      handleDelete(selectedId);
    }
    setShowModal(false);
  }, [selectedId, handleDelete, setShowModal]);

  // Ganti jumlah baris per halaman → reset ke halaman 1
  // supaya tidak ada halaman yang kosong.
  const handleItemsPerPageChange = useCallback((e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  }, [setItemsPerPage, setCurrentPage]);

  // Ketik di kotak cari → reset ke halaman 1
  // supaya hasil pencarian selalu mulai dari awal.
  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  }, [setSearch, setCurrentPage]);


  // ======================================================
  // RETURN
  // Semua yang dibutuhkan komponen IndexUser.
  // ======================================================

  return {
    // data & status
    user,
    loading,

    // search
    search,
    filteredData,

    // pagination
    currentPage,  setCurrentPage,
    itemsPerPage,
    totalPages,
    currentData,
    startIndex,

    // sorting
    sortedData,
    sortBy,       setSortBy,
    sortDir,      setSortDir,

    // aksi hapus
    handleDelete,
    navigate,

    // modal hapus
    showModal,    setShowModal,
    selectedId,

    // handler UI (siap pakai di komponen)
    openDeleteModal,
    confirmDelete,
    handleItemsPerPageChange,
    handleSearchChange,
  };
};