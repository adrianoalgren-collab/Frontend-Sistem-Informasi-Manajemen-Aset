// ======================================================
// === IMPORT
// ======================================================

import { useState, useEffect } from "react";
import api from "../../services/api";

// ======================================================
// === CUSTOM HOOK LIST REQUEST PENGADAAN
// ======================================================

export const useRequestPengadaanList = () => {

  // ======================================================
  // === STATE DATA
  // ======================================================

  const [requestPengadaan, setRequestPengadaan] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [sortBy, setSortBy] = useState("id_request_pengadaan");
  const [sortDir, setSortDir] = useState("asc");

  // ======================================================
  // === FETCH DATA
  // ======================================================

  const fetchRequestPengadaan = async () => {
    try {
      setLoading(true);

      const res = await api.get("/request/pengadaan");
      const data = res.data.data || res.data;

      // Pastikan relasi department dan user tersedia
      const mappedData = data.map((item) => ({
        ...item,
        department: item.department || null,
        user: item.user || null,
      }));

      setRequestPengadaan(mappedData);

    } catch (error) {
      console.error("Gagal mengambil data request pengadaan", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestPengadaan();
  }, []);

  // ======================================================
  // === SEARCH FILTER
  // ======================================================

  const filteredData = requestPengadaan.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.nama_pengadaan?.toLowerCase().includes(keyword) ||
      item.kategori_pengadaan?.toLowerCase().includes(keyword) ||
      item.user?.name?.toLowerCase().includes(keyword) ||
      item.department?.nama_department?.toLowerCase().includes(keyword) ||
      item.status_approval?.toLowerCase().includes(keyword)
    );
  });

  // ======================================================
  // === SORTING
  // ======================================================

  const sortedData = [...filteredData].sort((a, b) => {
    const aVal =
      a[sortBy] ??
      (a.department ? a.department[sortBy] : null) ??
      (a.user ? a.user[sortBy] : null);

    const bVal =
      b[sortBy] ??
      (b.department ? b.department[sortBy] : null) ??
      (b.user ? b.user[sortBy] : null);

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

  const handleDelete = async (id) => {
    try {
      await api.delete(`/request/pengadaan/${id}`);

      setRequestPengadaan((prev) =>
        prev.filter(
          (item) => item.id_request_pengadaan !== id
        )
      );

    } catch (error) {
      console.error(error);
      alert("Gagal menghapus request pengadaan");
    }
  };

  // ======================================================
  // === RETURN
  // ======================================================

  return {
    // DATA
    requestPengadaan,
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
    fetchRequestPengadaan,
  };
};