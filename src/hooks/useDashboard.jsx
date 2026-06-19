// ======================================================
// === useDashboard.js
// Custom hook untuk mengambil semua data yang dibutuhkan
// di halaman Dashboard Admin dari berbagai endpoint API
// ======================================================

import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

// Helper: ambil header Authorization dari token di localStorage
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    Accept: "application/json",
  },
});

export function useDashboard() {

  // ── STATE ──
  const [loading, setLoading] = useState(true);
  const [users, setUsers]               = useState([]);
  const [departments, setDepartments]   = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [asetOperasional, setAsetOperasional] = useState([]);
  const [requestPerbaikan, setRequestPerbaikan] = useState([]);
  const [reports, setReports]           = useState([]);

  // ── FETCH SEMUA DATA PARALEL ──
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          resUsers,
          resDept,
          resMfr,
          resAset,
          resReq,
          resReport,
        ] = await Promise.all([
          axios.get(`${BASE_URL}/user`,             authHeader()),
          axios.get(`${BASE_URL}/department`,        authHeader()),
          axios.get(`${BASE_URL}/manufacturer`,      authHeader()),
          axios.get(`${BASE_URL}/asetoperasional`,   authHeader()),
          axios.get(`${BASE_URL}/request/perbaikan`, authHeader()),
          axios.get(`${BASE_URL}/report`,            authHeader()),
        ]);

        setUsers(resUsers.data?.data             ?? resUsers.data             ?? []);
        setDepartments(resDept.data?.data        ?? resDept.data              ?? []);
        setManufacturers(resMfr.data?.data       ?? resMfr.data               ?? []);
        setAsetOperasional(resAset.data?.data    ?? resAset.data              ?? []);
        setRequestPerbaikan(resReq.data?.data    ?? resReq.data               ?? []);
        setReports(resReport.data?.data          ?? resReport.data            ?? []);

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // ── DERIVED DATA ──

  // Hitung jumlah aset per kondisi untuk chart
  const kondisiCount = asetOperasional.reduce((acc, item) => {
    const k = item.kondisi_asetoperasional || "Tidak Diketahui";
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

  // Hitung jumlah request per status untuk chart
  const requestStatusCount = requestPerbaikan.reduce((acc, item) => {
    const s = item.status_request || "Pending";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  // 5 request terbaru (diurutkan dari yang terbaru)
  const recentRequests = [...requestPerbaikan]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  // Aset dengan kondisi rusak (Rusak Ringan / Rusak Berat)
  const asetRusak = asetOperasional.filter(
    item => item.kondisi_asetoperasional?.toLowerCase().includes("rusak")
  );

  return {
    loading,
    // Raw data
    users,
    departments,
    manufacturers,
    asetOperasional,
    requestPerbaikan,
    reports,
    // Derived
    kondisiCount,
    requestStatusCount,
    recentRequests,
    asetRusak,
    // Summary counts
    totalUsers:        users.length,
    totalDepartments:  departments.length,
    totalManufacturers: manufacturers.length,
    totalAset:         asetOperasional.length,
    totalRequest:      requestPerbaikan.length,
    totalReport:       reports.length,
    totalAsetRusak:    asetRusak.length,
  };
}