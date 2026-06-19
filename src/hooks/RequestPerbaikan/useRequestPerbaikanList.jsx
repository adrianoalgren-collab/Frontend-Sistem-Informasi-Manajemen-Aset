// ======================================================
// === IMPORT
// ======================================================

import { useState, useEffect } from "react";
import api from "../../services/api";

// ======================================================
// === CUSTOM HOOK LIST REQUEST PERBAIKAN
// ======================================================

export const useRequestPerbaikanList = () => {

  // ======================================================
  // === STATE DATA
  // ======================================================

  const [requestPerbaikan, setRequestPerbaikan] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [sortBy, setSortBy] = useState("id_request_perbaikan");
  const [sortDir, setSortDir] = useState("asc");

  // ======================================================
  // === FETCH DATA
  // ======================================================

  const fetchRequestPerbaikan = async () => {
    try {
      setLoading(true);

      const res = await api.get("/request/perbaikan");
      const data = res.data.data || res.data;

      // Petakan semua relasi: aset, user, dan kode_barang
      const mappedData = data.map(item => ({
        ...item,
        aset:        item.aset        || null,
        user:        item.user        || null,
        kode_barang: item.kode_barang || null,   // ← relasi tambahan
      }));

      setRequestPerbaikan(mappedData);

    } catch (error) {
      console.error("Gagal mengambil data request perbaikan", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestPerbaikan();
  }, []);

  // ======================================================
  // === SEARCH FILTER
  // ======================================================

  const filteredData = requestPerbaikan.filter((item) => {
    const keyword = search.toLowerCase();
    return (
      item.aset?.nama_asetoperasional?.toLowerCase().includes(keyword)   ||
      item.user?.name?.toLowerCase().includes(keyword)                   ||
      item.kode_barang?.kode_barang?.toLowerCase().includes(keyword) ||  // ← searchable
      item.status_request?.toLowerCase().includes(keyword)
    );
  });

  // ======================================================
  // === SORTING
  // ======================================================

  const sortedData = [...filteredData].sort((a, b) => {
    const resolve = (item) =>
      item[sortBy]
      ?? item.aset?.[sortBy]
      ?? item.user?.[sortBy]
      ?? item.kode_barang?.[sortBy]   // ← ikut di-resolve saat sort
      ?? null;

    const aVal = resolve(a);
    const bVal = resolve(b);

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

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  // ======================================================
  // === DELETE DATA
  // ======================================================

  const handleDelete = async (id) => {
    try {
      await api.delete(`/request/perbaikan/${id}`);
      // Filter pakai id_request_perbaikan sesuai primary key migration
      setRequestPerbaikan(prev =>
        prev.filter(item => item.id_request_perbaikan !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus request perbaikan");
    }
  };

  // ======================================================
  // === RETURN
  // ======================================================

  return {
    // DATA
    requestPerbaikan,
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
    fetchRequestPerbaikan
  };
};