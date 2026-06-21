// ======================================================
// === IMPORT
// ======================================================

import { useState, useEffect } from "react";
import api from "../../services/api";

// ======================================================
// === CUSTOM HOOK LIST MANUFACTURER
// ======================================================

export const useManufacturerList = () => {

  // ======================================================
  // === STATE DATA UTAMA
  // ======================================================

  const [manufacturer, setManufacturer] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ======================================================
  // === FETCH DATA (GET /manufacturers)
  // ======================================================

  const fetchManufacturer = async () => {
  try {
    const res = await api.get("/manufacturer"); // ✅ RESTful, pastikan API sudah with('asets')

    const dataWithNo = res.data.map((item, index) => ({
      ...item,
      no: index + 1,
      jumlah_aset: item.asets?.length ?? 0, // hitung jumlah aset langsung
    }));

    setManufacturer(dataWithNo);
  } catch (error) {
    console.error("Gagal mengambil data manufacturer", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchManufacturer();
  }, []);

  // ======================================================
  // === FILTER / SEARCH
  // ======================================================

  const filteredData = manufacturer.filter(
    (item) =>
      item.nama_manufacturer?.toLowerCase().includes(search.toLowerCase()) ||
      item.email_manufacturer?.toLowerCase().includes(search.toLowerCase()) ||
      item.telfon_manufacturer?.toLowerCase().includes(search.toLowerCase())
  );

  // ======================================================
  // === PAGINATION
  // ======================================================

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ======================================================
  // === DELETE (DELETE /manufacturers/{id})
  // ======================================================

  const handleDelete = async (id_manufacturer) => {
    try {
      await api.delete(`/manufacturer/${id_manufacturer}`); // ✅ RESTful

      setManufacturer((prev) =>
        prev.filter((item) => item.id_manufacturer !== id_manufacturer)
      );
    } catch (error) {
      alert("Gagal menghapus data manufacturer");
    }
  };

  // ======================================================
  // === SORTING
  // ======================================================

  const [sortBy, setSortBy] = useState("id_manufacturer");
  const [sortDir, setSortDir] = useState("asc");

  const sortedData = [...currentData].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];

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
  // === RETURN
  // ======================================================

  return {
    manufacturer,
    loading,

    search,
    setSearch,
    filteredData,

    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    currentData,
    startIndex,

    sortedData,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,

    handleDelete,
  };
};