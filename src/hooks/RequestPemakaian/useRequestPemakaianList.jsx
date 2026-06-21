// ======================================================
// === IMPORT
// ======================================================

import { useState, useEffect } from "react";
import api from "../../services/api";

// ======================================================
// === CUSTOM HOOK LIST REQUEST PEMAKAIAN
// ======================================================

export const useRequestPemakaianList = () => {

  // ======================================================
  // === STATE DATA
  // ======================================================

  const [requestPemakaian, setRequestPemakaian] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [sortBy, setSortBy] = useState("id_request_pemakaian");
  const [sortDir, setSortDir] = useState("asc");

  // ======================================================
  // === FETCH DATA
  // ======================================================

  const fetchRequestPemakaian = async () => {
    try {
      setLoading(true);

      const res = await api.get("/request/pemakaian");
      const data = res.data.data || res.data;

      // Pastikan relasi department, user, dan barangPakai tersedia
      const mappedData = data.map((item) => ({
        ...item,
        department: item.department || null,
        user: item.user || null,
        barangPakai: item.barang_pakai || null,
      }));

      setRequestPemakaian(mappedData);

    } catch (error) {
      console.error("Gagal mengambil data request pemakaian", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestPemakaian();
  }, []);

  // ======================================================
  // === SEARCH FILTER
  // ======================================================

  const filteredData = requestPemakaian.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.keterangan_pemakaian?.toLowerCase().includes(keyword) ||
      item.barangPakai?.nama_asetbarangpakai?.toLowerCase().includes(keyword) ||
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
      await api.delete(`/request/pemakaian/${id}`);

      setRequestPemakaian((prev) =>
        prev.filter(
          (item) => item.id_request_pemakaian !== id
        )
      );

    } catch (error) {
      console.error(error);
      alert("Gagal menghapus request pemakaian");
    }
  };

  // ======================================================
  // === RETURN
  // ======================================================

  return {
    // DATA
    requestPemakaian,
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
    fetchRequestPemakaian,
  };
};