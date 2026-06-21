// ======================================================
// === IMPORT
// ======================================================

import { useState, useEffect, useCallback } from "react";
import api, { BASE_URL } from "../../services/api";

// ======================================================
// === KONSTANTA
// ======================================================

const SORT_KEY_MAP = {
  id_kodebarang:           (item) => item.id_kodebarang,
  kode_barang:             (item) => item.kode_barang,
  kondisi_asetoperasional: (item) => item.kondisi_asetoperasional,
  lokasi_asetoperasional:  (item) => item.lokasi_asetoperasional,
  nama_asetoperasional:    (item) => item.aset_operasional?.nama_asetoperasional,
  nama_manufacturer:       (item) => item.manufacturer?.nama_manufacturer,
};

// ======================================================
// === HELPER: AMBIL NILAI SORT
// ======================================================

/*
  Mengambil nilai untuk sorting secara eksplisit
  berdasarkan key yang sudah dipetakan di SORT_KEY_MAP.

  Jika key tidak dikenali, fallback ke flat item[key].
*/

const getSortValue = (item, key) => {
  const resolver = SORT_KEY_MAP[key];
  return resolver ? resolver(item) : item[key];
};

// ======================================================
// === HELPER: URL FOTO ASET
// ======================================================

/*
  Menggunakan VITE_API_BASE_URL dari .env agar tidak
  hardcode localhost — aman untuk production.

  Contoh .env:
  VITE_API_BASE_URL=https://api.namadomain.com
*/

const getFotoUrl = (filename) => {
  if (!filename) return null;
  return `${BASE_URL}/uploads/aset/${filename}`;
};

// ======================================================
// === CUSTOM HOOK: useAsetOperasionalList
// ======================================================

/*
  Data utama yang ditampilkan adalah kode_barang
  (unit fisik per aset), bukan aset_operasional (master).

  Relasi yang di-load dari backend:
  KodeBarang::with(['asetOperasional.manufacturer'])
*/

export const useAsetOperasionalList = () => {

  // ======================================================
  // === STATE
  // ======================================================

  const [kodeBarangList, setKodeBarangList] = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);

  const [search, setSearch]                 = useState("");

  const [currentPage, setCurrentPage]       = useState(1);
  const [itemsPerPage, setItemsPerPage]     = useState(10);

  const [sortBy, setSortBy]                 = useState("id_kodebarang");
  const [sortDir, setSortDir]               = useState("asc");

  // ======================================================
  // === FETCH DATA
  // ======================================================

  const fetchKodeBarang = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res  = await api.get("/kodebarang");
      const data = res.data?.data || res.data || [];

      const mapped = data.map((item) => ({
        ...item,
        aset_operasional: item.aset_operasional || null,
        manufacturer:     item.aset_operasional?.manufacturer || null,
      }));

      setKodeBarangList(mapped);

    } catch (err) {
      console.error("Gagal mengambil data kode barang:", err);
      setError("Gagal memuat data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKodeBarang();
  }, [fetchKodeBarang]);

  // ======================================================
  // === RESET PAGE SAAT SEARCH BERUBAH
  // ======================================================

  /*
    Tanpa ini, jika user ada di halaman 3 lalu mengetik
    keyword, hasil filter mungkin < 3 halaman sehingga
    currentData jadi array kosong.
  */

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // ======================================================
  // === SEARCH FILTER
  // ======================================================

  const filteredData = kodeBarangList.filter((item) => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return true;

    return (
      item.kode_barang
        ?.toLowerCase().includes(keyword)

      ||

      item.kondisi_asetoperasional
        ?.toLowerCase().includes(keyword)

      ||

      item.lokasi_asetoperasional
        ?.toLowerCase().includes(keyword)

      ||

      item.aset_operasional?.nama_asetoperasional
        ?.toLowerCase().includes(keyword)

      ||

      item.manufacturer?.nama_manufacturer
        ?.toLowerCase().includes(keyword)
    );
  });

  // ======================================================
  // === SORTING
  // ======================================================

  /*
    Menggunakan SORT_KEY_MAP yang eksplisit agar
    sorting pada field relasi (nama_asetoperasional,
    nama_manufacturer) selalu benar — tidak bergantung
    pada kecocokan nama key secara kebetulan.
  */

  const sortedData = [...filteredData].sort((a, b) => {
    const aVal = getSortValue(a, sortBy);
    const bVal = getSortValue(b, sortBy);

    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    }

    const cmp = String(aVal).localeCompare(
      String(bVal),
      "id-ID",
      { sensitivity: "base" }
    );

    return sortDir === "asc" ? cmp : -cmp;
  });

  // ======================================================
  // === PAGINATION
  // ======================================================

  const totalItems = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Jika currentPage melebihi totalPages (misal setelah delete),
  // clamp ke halaman terakhir yang tersedia
  const safePage    = Math.min(currentPage, totalPages);
  const startIndex  = (safePage - 1) * itemsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  // ======================================================
  // === DELETE DATA
  // ======================================================

  const handleDelete = async (id_kodebarang) => {
    try {
      await api.delete(`/kodebarang/${id_kodebarang}`);

      setKodeBarangList((prev) =>
        prev.filter((item) => item.id_kodebarang !== id_kodebarang)
      );

    } catch (err) {
      console.error("Gagal menghapus kode barang:", err);
      throw err; // biarkan component yang handle alert/toast
    }
  };

  // ======================================================
  // === RETURN
  // ======================================================

  return {
    // DATA
    kodeBarangList,
    loading,
    error,

    // SEARCH
    search,
    setSearch,

    // PAGINATION
    currentPage:  safePage,
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
    fetchKodeBarang,

    // FOTO
    getFotoUrl,
  };
};