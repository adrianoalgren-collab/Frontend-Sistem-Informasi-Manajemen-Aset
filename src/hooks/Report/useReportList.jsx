import { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

export const useReportList = () => {

  // ── STATE ────────────────────────────────────────────
  const [reports,      setReports]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [search,       setSearch]       = useState("");
  const [currentPage,  setCurrentPage]  = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy,       setSortBy]       = useState("id_report");
  const [sortDir,      setSortDir]      = useState("asc");

  // ── FETCH ────────────────────────────────────────────

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/report");

      // Handle response Laravel paginator: { data: [...], current_page, ... }
      const raw = res.data.data;
      const items = Array.isArray(raw) ? raw : (raw?.data ?? []);

      setReports(items);
    } catch (err) {
      setError("Gagal mengambil data report. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // ── SEARCH / FILTER ──────────────────────────────────

  const filteredData = reports.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.judul?.toLowerCase().includes(q)   ||
      item.tanggal?.toLowerCase().includes(q) ||
      item.status?.toLowerCase().includes(q)
    );
  });

  // ── SORT ─────────────────────────────────────────────

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

  // ── PAGINATION ───────────────────────────────────────

  const totalPages  = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const startIndex  = (currentPage - 1) * itemsPerPage;

  // Nomor urut dihitung dari posisi global, bukan index lokal
  const currentData = sortedData
    .slice(startIndex, startIndex + itemsPerPage)
    .map((item, index) => ({ ...item, no: startIndex + index + 1 }));

  // Reset ke halaman 1 jika search berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // ── DELETE ───────────────────────────────────────────

  const handleDelete = async (id_report) => {
    try {
      await api.delete(`/report/${id_report}`);
      setReports((prev) => prev.filter((item) => item.id_report !== id_report));
    } catch {
      setError("Gagal menghapus data report. Silakan coba lagi.");
    }
  };

  // ── RETURN ───────────────────────────────────────────

  return {
    loading,
    error,
    search,       setSearch,
    currentPage,  setCurrentPage,
    itemsPerPage, setItemsPerPage,
    totalPages,
    currentData,
    sortBy,       setSortBy,
    sortDir,      setSortDir,
    handleDelete,
    refetch: fetchReports,
  };
};