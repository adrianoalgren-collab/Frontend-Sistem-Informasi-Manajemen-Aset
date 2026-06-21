// ======================================================
// === IMPORT
// ======================================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";


// ======================================================
// === HOOK: useAsetBarangPakaiList
// Hook ini mengelola semua kebutuhan halaman daftar aset barang pakai:
// ambil data, cari, urutkan, paginasi, hapus, dan state modal.
// ======================================================

export const useAsetBarangPakaiList = () => {

  const navigate = useNavigate();

  // ── DATA ──
  const [asetBarangPakai, setAsetBarangPakai] = useState([]);
  const [loading,         setLoading]         = useState(true);

  // ── SEARCH ──
  const [search,          setSearch]          = useState("");

  // ── PAGINATION ──
  const [currentPage,     setCurrentPage]     = useState(1);
  const [itemsPerPage,    setItemsPerPage]    = useState(10);

  // ── SORTING ──
  const [sortBy,          setSortBy]          = useState("id_barang_pakai");
  const [sortDir,         setSortDir]         = useState("asc");

  // ── MODAL HAPUS ──
  const [showModal,       setShowModal]       = useState(false);
  const [selectedId,      setSelectedId]      = useState(null);

  // ── MODAL INFO ──
  const [selectedAset,    setSelectedAset]    = useState(null);
  const [showInfoModal,   setShowInfoModal]   = useState(false);


  // ======================================================
  // === AMBIL DATA DARI API
  // ======================================================

  const fetchAsetBarangPakai = async () => {
    try {
      const res = await api.get("/asetbarangpakai");

      setAsetBarangPakai(res.data.map((item, index) => ({
        ...item,
        no: index + 1,
      })));
    } catch (error) {
      console.error("Gagal mengambil data aset barang pakai", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsetBarangPakai();
  }, []);


  // ======================================================
  // === FILTER PENCARIAN
  // Mencari berdasarkan kode, nama, dan lokasi.
  // ======================================================

  const filteredData = asetBarangPakai.filter(
    (item) =>
      item.kode_asetbarangpakai?.toLowerCase().includes(search.toLowerCase())  ||
      item.nama_asetbarangpakai?.toLowerCase().includes(search.toLowerCase())  ||
      item.lokasi_asetbarangpakai?.toLowerCase().includes(search.toLowerCase())
  );


  // ======================================================
  // === SORTING
  // ======================================================

  const sortedData = [...filteredData].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];

    if (aVal == null) return 1;
    if (bVal == null) return -1;

    if (typeof aVal === "number") {
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    }

    return sortDir === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });


  // ======================================================
  // === PAGINATION
  // ======================================================

  const totalPages  = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const startIndex  = (currentPage - 1) * itemsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);


  // ======================================================
  // === HAPUS DATA
  // ======================================================

  const handleDelete = async (id_barang_pakai) => {
    try {
      await api.delete(`/asetbarangpakai/${id_barang_pakai}`);

      setAsetBarangPakai((prev) =>
        prev.filter((item) => item.id_barang_pakai !== id_barang_pakai)
      );
    } catch (error) {
      alert("Gagal menghapus data aset barang pakai");
    }
  };


  // ======================================================
  // === RETURN
  // ======================================================

  return {
    // data & loading
    asetBarangPakai,
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
    selectedAset,   setSelectedAset,
    showInfoModal,  setShowInfoModal,
  };
};