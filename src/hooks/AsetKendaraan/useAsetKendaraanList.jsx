// ======================================================
// === IMPORT
// ======================================================

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../useRole";
import api from "../../services/api";

// ======================================================
// === UTILITY
// ======================================================

export const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const COL_COUNT_CAN_AKSI = 6;
const COL_COUNT_NO_AKSI  = 5;

// ======================================================
// === CUSTOM HOOK LIST ASET KENDARAAN
// ======================================================

export const useAsetKendaraanList = () => {

  // ======================================================
  // === STATE DATA
  // ======================================================

  const [asetKendaraan, setAsetKendaraan] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [currentPage,   setCurrentPage]   = useState(1);
  const [itemsPerPage,  setItemsPerPage]  = useState(10);
  const [sortBy,        setSortBy]        = useState("id_kendaraan");
  const [sortDir,       setSortDir]       = useState("asc");

  // State untuk AssignDriver
  const [kendaraan,    setKendaraan]    = useState(null);
  const [drivers,      setDrivers]      = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  // ── State: Modal Hapus ──
  const [showModal,  setShowModal]  = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // ── State: Modal Info ──
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedAset,  setSelectedAset]  = useState(null);

  // ── State: Modal History ──
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [history,          setHistory]          = useState([]);
  const [historyLoading,   setHistoryLoading]   = useState(false);
  const [historyKendaraan, setHistoryKendaraan] = useState(null);
  const [historyError,     setHistoryError]     = useState(false);

  // ── Role & Permission ──
  const {
    isAdmin,
    isManager,
    isStaffKantor,
    isStaffLapangan,
    isDriver,
    isStaff,
    idRole,
  } = useRole();

  const canTambah       = isAdmin;
  const canEdit         = isAdmin;
  const canAssign       = isAdmin || isManager;
  const canHapus        = isAdmin;
  const canAksiColumn   = canEdit || canAssign || canHapus;
  const canLihatHistory = isAdmin || isManager || isStaffKantor || isStaff;
  const colCount        = canAksiColumn ? COL_COUNT_CAN_AKSI : COL_COUNT_NO_AKSI;

  // ── Navigation ──
  const navigate = useNavigate();

  // ======================================================
  // === FETCH LIST
  // ======================================================

  const fetchAsetKendaraan = async () => {
    try {
      setLoading(true);
      const res  = await api.get("/asetkendaraan");
      const data = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
          ? res.data
          : [];

      setAsetKendaraan(data.map(item => ({
        ...item,
        manufacturer: item.manufacturer || null,
      })));

    } catch (error) {
      console.error("Gagal mengambil data aset kendaraan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsetKendaraan();
  }, []);

  // ======================================================
  // === FETCH BY ID + DRIVERS — untuk halaman AssignDriver
  // ======================================================

  const fetchAssignData = async (id) => {
    if (!id) return;
    try {
      setLoading(true);

      const [resKendaraan, resDrivers] = await Promise.all([
        api.get(`/asetkendaraan/${id}`),
        api.get("/user?id_role=2"),
      ]);

      const dataKendaraan = resKendaraan.data?.data ?? resKendaraan.data;
      const dataDrivers   = Array.isArray(resDrivers.data?.data)
        ? resDrivers.data.data
        : Array.isArray(resDrivers.data)
          ? resDrivers.data
          : [];

      setKendaraan(dataKendaraan);
      setDrivers(dataDrivers);

      if (dataKendaraan?.id_user) {
        setSelectedUser(String(dataKendaraan.id_user));
      }

    } catch (error) {
      console.error("Gagal mengambil data assign driver:", error);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // === SEARCH FILTER
  // ======================================================

  const filteredData = asetKendaraan.filter((item) => {
    const keyword = search.toLowerCase();
    return (
      item.kode_kendaraan?.toLowerCase().includes(keyword)                  ||
      item.nama_kendaraan?.toLowerCase().includes(keyword)                  ||
      item.plat_kendaraan?.toLowerCase().includes(keyword)                  ||
      item.kondisi_kendaraan?.toLowerCase().includes(keyword)               ||
      item.manufacturer?.nama_manufacturer?.toLowerCase().includes(keyword) ||
      item.driver?.name?.toLowerCase().includes(keyword)
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
  // === DELETE
  // ======================================================

  const handleDelete = async (id_kendaraan) => {
    try {
      await api.delete(`/asetkendaraan/${id_kendaraan}`);
      setAsetKendaraan(prev =>
        prev.filter(item => item.id_kendaraan !== id_kendaraan)
      );
    } catch (error) {
      console.error("Gagal menghapus data aset kendaraan:", error);
      throw error;
    }
  };

  // ======================================================
  // === ASSIGN DRIVER — SUBMIT
  // ======================================================

  const handleAssignSubmit = async (id, selectedUser) => {
    await api.put(`/asetkendaraan/${id}`, {
      id_user: Number(selectedUser),
    });
  };

  // ======================================================
  // === MODAL HANDLERS
  // ======================================================

  const openInfo    = useCallback((row) => { setSelectedAset(row);  setShowInfoModal(true);  }, []);
  const openDelete  = useCallback((id)  => { setSelectedId(id);     setShowModal(true);      }, []);

  const openHistory = useCallback(async (row) => {
    setHistoryKendaraan(row);
    setShowHistoryModal(true);
    setHistoryLoading(true);
    setHistoryError(false);
    setHistory([]);
    try {
      const res = await api.get(`/asetkendaraan/${row.id_kendaraan}/history`);
      setHistory(res.data?.data ?? []);
    } catch {
      setHistory([]);
      setHistoryError(true);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedId(null);
  }, []);

  const closeInfoModal = useCallback(() => {
    setShowInfoModal(false);
    setSelectedAset(null);
  }, []);

  const closeHistoryModal = useCallback(() => {
    setShowHistoryModal(false);
    setHistoryKendaraan(null);
    setHistory([]);
    setHistoryError(false);
  }, []);

  const confirmDelete = useCallback(() => {
    if (selectedId !== null) handleDelete(selectedId);
    closeModal();
  }, [selectedId, closeModal]);

  // ======================================================
  // === RETURN
  // ======================================================

  return {
    // List
    asetKendaraan,
    loading,
    search,       setSearch,
    filteredData,
    currentPage,  setCurrentPage,
    itemsPerPage, setItemsPerPage,
    totalPages,
    startIndex,
    currentData,
    sortedData,
    sortBy,       setSortBy,
    sortDir,      setSortDir,
    handleDelete,
    fetchAsetKendaraan,

    // Assign Driver
    kendaraan,
    drivers,
    selectedUser, setSelectedUser,
    fetchAssignData,
    handleAssignSubmit,

    // Role & Permission
    isAdmin, isManager, isStaffKantor,
    isStaffLapangan, isDriver, isStaff, idRole,
    canTambah, canEdit, canAssign, canHapus,
    canAksiColumn, canLihatHistory, colCount,

    // Navigation
    navigate,

    // Modal: Hapus
    showModal, openDelete, closeModal, confirmDelete,

    // Modal: Info
    showInfoModal, selectedAset, openInfo, closeInfoModal,

    // Modal: History
    showHistoryModal, history, historyLoading,
    historyKendaraan, historyError,
    openHistory, closeHistoryModal,
  };
};  