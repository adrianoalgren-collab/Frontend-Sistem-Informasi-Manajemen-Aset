// ======================================================
// === IMPORT
// ======================================================

import { useState, useEffect } from "react";
import api from "../../services/api";

// ======================================================
// === CUSTOM HOOK LIST ASET BARANG PAKAI
// ======================================================

export const useAsetBarangPakaiList = () => {

  // ======================================================
  // === STATE DATA
  // ======================================================

  const [asetBarangPakai, setAsetBarangPakai] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [sortBy, setSortBy] = useState("id_barang_pakai");
  const [sortDir, setSortDir] = useState("asc");

  // ======================================================
  // === FETCH DATA
  // ======================================================

  const fetchAsetBarangPakai = async () => {

    try {
      setLoading(true);

      const res = await api.get("/asetbarangpakai");
      const data = res.data.data || res.data;

      // Pastikan setiap item punya relasi manufacturer
      const mappedData = data.map(item => ({
        ...item,
        manufacturer: item.manufacturer || null
      }));

      setAsetBarangPakai(mappedData);

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
  // === SEARCH FILTER
  // ======================================================

  const filteredData = asetBarangPakai.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.nama_asetbarangpakai?.toLowerCase().includes(keyword) ||
      item.kode_asetbarangpakai?.toLowerCase().includes(keyword) ||
      item.kategori_asetbarangpakai?.toLowerCase().includes(keyword) ||
      item.lokasi_asetbarangpakai?.toLowerCase().includes(keyword) ||
      item.manufacturer?.nama_manufacturer?.toLowerCase().includes(keyword)
    );
  });

  // ======================================================
  // === SORTING
  // ======================================================

  const sortedData = [...filteredData].sort((a, b) => {
    const aVal = a[sortBy] ?? (a.manufacturer ? a.manufacturer[sortBy] : null);
    const bVal = b[sortBy] ?? (b.manufacturer ? b.manufacturer[sortBy] : null);

    if (aVal == null) return 1;
    if (bVal == null) return -1;

    if (typeof aVal === "number") {
      return sortDir === "asc"
        ? aVal - bVal
        : bVal - aVal;
    }

    return sortDir === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  // ======================================================
  // === PAGINATION
  // ======================================================

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentData = sortedData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ======================================================
  // === DELETE DATA
  // ======================================================

  const handleDelete = async (id_barang_pakai) => {
    try {
      await api.delete(`/asetbarangpakai/${id_barang_pakai}`);

      setAsetBarangPakai(prev =>
        prev.filter(item => item.id_barang_pakai !== id_barang_pakai)
      );

    } catch (error) {
      console.error(error);
      alert("Gagal menghapus data aset barang pakai");
    }
  };

  // ======================================================
  // === GET FOTO URL
  // ======================================================

  const getFotoUrl = (filename) => {
    if (!filename) return null;
    return `http://127.0.0.1:8000/uploads/aset/${filename}`;
  };

  // ======================================================
  // === RETURN
  // ======================================================

  return {
    // DATA
    asetBarangPakai,
    loading,

    // SEARCH
    search,
    setSearch,
    filteredData,

    // PAGINATION
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    startIndex,
    currentData,

    // SORT
    sortedData,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,

    // ACTION
    handleDelete,

    // REFRESH
    fetchAsetBarangPakai,

    // FOTO
    getFotoUrl
  };

};