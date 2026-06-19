// ======================================================
// === IMPORT
// ======================================================

import { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

// ======================================================
// === KONSTANTA
// ======================================================

const SORT_KEY_MAP = {
  id_operasional:      (item) => item.id_operasional,
  nama_asetoperasional:(item) => item.nama_asetoperasional,
  nama_manufacturer:   (item) => item.manufacturer?.nama_manufacturer,
};

// ======================================================
// === HELPER: AMBIL NILAI SORT
// ======================================================

const getSortValue = (item, key) => {
  const resolver = SORT_KEY_MAP[key];
  return resolver ? resolver(item) : item[key];
};

// ======================================================
// === HELPER: URL FOTO
// ======================================================

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const getFotoUrl = (filename) => {
  if (!filename) return null;
  return `${BASE_URL}/uploads/aset/${filename}`;
};

// ======================================================
// === CUSTOM HOOK
// === useJenisAsetOperasionalList
// ======================================================

export const useJenisAsetOperasionalList = () => {

  // ======================================================
  // === STATE
  // ======================================================

  const [jenisAsetList, setJenisAsetList] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  const [search, setSearch]               = useState("");

  const [currentPage, setCurrentPage]     = useState(1);
  const [itemsPerPage, setItemsPerPage]   = useState(10);

  const [sortBy, setSortBy]               = useState("id_operasional");
  const [sortDir, setSortDir]             = useState("asc");

  // ======================================================
  // === FETCH DATA
  // ======================================================

  const fetchJenisAsetOperasional = useCallback(async () => {

    try {

      setLoading(true);
      setError(null);

      const res = await api.get("/asetoperasional");

      const data = res.data?.data || res.data || [];

      const mapped = data.map((item) => ({
        ...item,
        manufacturer: item.manufacturer || null,
      }));

      setJenisAsetList(mapped);

    } catch (err) {

      console.error(
        "Gagal mengambil data jenis aset operasional:",
        err
      );

      setError(
        "Gagal memuat data. Silakan coba lagi."
      );

    } finally {
      setLoading(false);
    }

  }, []);

  useEffect(() => {
    fetchJenisAsetOperasional();
  }, [fetchJenisAsetOperasional]);

  // ======================================================
  // === RESET PAGE SAAT SEARCH BERUBAH
  // ======================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // ======================================================
  // === SEARCH FILTER
  // ======================================================

  const filteredData = jenisAsetList.filter((item) => {

    const keyword = search.toLowerCase().trim();

    if (!keyword) return true;

    return (

      item.nama_asetoperasional
        ?.toLowerCase()
        .includes(keyword)

      ||

      item.manufacturer?.nama_manufacturer
        ?.toLowerCase()
        .includes(keyword)

    );

  });

  // ======================================================
  // === SORTING
  // ======================================================

  const sortedData = [...filteredData].sort((a, b) => {

    const aVal = getSortValue(a, sortBy);
    const bVal = getSortValue(b, sortBy);

    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;

    if (
      typeof aVal === "number" &&
      typeof bVal === "number"
    ) {
      return sortDir === "asc"
        ? aVal - bVal
        : bVal - aVal;
    }

    const cmp = String(aVal).localeCompare(
      String(bVal),
      "id-ID",
      {
        sensitivity: "base",
      }
    );

    return sortDir === "asc"
      ? cmp
      : -cmp;
  });

  // ======================================================
  // === PAGINATION
  // ======================================================

  const totalItems = sortedData.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / itemsPerPage)
  );

  const safePage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safePage - 1) * itemsPerPage;

  const currentData = sortedData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ======================================================
  // === DELETE DATA
  // ======================================================

  const handleDelete = async (id_operasional) => {

    try {

      await api.delete(
        `/asetoperasional/${id_operasional}`
      );

      setJenisAsetList((prev) =>
        prev.filter(
          (item) =>
            item.id_operasional !== id_operasional
        )
      );

    } catch (err) {

      console.error(
        "Gagal menghapus jenis aset operasional:",
        err
      );

      throw err;
    }
  };

  // ======================================================
  // === RETURN
  // ======================================================

  return {

    // DATA
    jenisAsetList,
    loading,
    error,

    // SEARCH
    search,
    setSearch,

    // PAGINATION
    currentPage: safePage,
    setCurrentPage,

    itemsPerPage,
    setItemsPerPage,

    totalPages,
    totalItems,

    startIndex,
    currentData,

    // SORT
    sortBy,
    setSortBy,

    sortDir,
    setSortDir,

    // ACTION
    handleDelete,

    // REFRESH
    fetchJenisAsetOperasional,

    // FOTO
    getFotoUrl,
  };
};