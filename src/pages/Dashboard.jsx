// ======================================================
// === IMPORT
// ======================================================

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api, { BASE_URL } from "../services/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

// ── Warna untuk chart ──
const PIE_COLORS  = ["#16a34a", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

// ── Status badge warna ──
const statusStyle = {
  Pending:  { background: "rgba(234,179,8,0.12)",  color: "#ca8a04",  border: "1px solid rgba(234,179,8,0.3)"  },
  Diterima: { background: "rgba(22,163,74,0.12)",  color: "#16a34a",  border: "1px solid rgba(22,163,74,0.3)"  },
  Ditolak:  { background: "rgba(239,68,68,0.12)",  color: "#ef4444",  border: "1px solid rgba(239,68,68,0.3)"  },
};


// ======================================================
// === KOMPONEN UTAMA
// ======================================================

export default function Dashboard() {

  // ── STATE ──
  const [loading, setLoading]                   = useState(true);
  const [users, setUsers]                       = useState([]);
  const [departments, setDepartments]           = useState([]);
  const [manufacturers, setManufacturers]       = useState([]);
  const [asetOperasional, setAsetOperasional]   = useState([]);
  const [requestPerbaikan, setRequestPerbaikan] = useState([]);
  const [reports, setReports]                   = useState([]);

  // ── FETCH DATA ──
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [u, d, m, a, r, rep] = await Promise.all([
          api.get("/user"),
          api.get("/department"),
          api.get("/manufacturer"),
          api.get("/asetoperasional"),
          api.get("/request/perbaikan"),
          api.get("/report"),
        ]);
        setUsers(u.data?.data             ?? u.data   ?? []);
        setDepartments(d.data?.data       ?? d.data   ?? []);
        setManufacturers(m.data?.data     ?? m.data   ?? []);
        setAsetOperasional(a.data?.data   ?? a.data   ?? []);
        setRequestPerbaikan(r.data?.data  ?? r.data   ?? []);
        setReports(rep.data?.data         ?? rep.data ?? []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);


  // ── DERIVED DATA ──

  // Kondisi aset → data untuk PieChart
  const kondisiMap = asetOperasional.reduce((acc, item) => {
    const k = item.kondisi_asetoperasional || "Tidak Diketahui";
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  const kondisiData = Object.entries(kondisiMap).map(([name, value]) => ({ name, value }));

  // Aset per manufacturer → data untuk BarChart
  const mfrMap = asetOperasional.reduce((acc, item) => {
    const name = item.manufacturer?.nama_manufacturer || "Lainnya";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  const mfrData = Object.entries(mfrMap)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  // Status request → data untuk PieChart
  const statusMap = requestPerbaikan.reduce((acc, item) => {
    const s = item.status_request || "Pending";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});
  const statusData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

  // 5 request terbaru
  const recentRequests = [...requestPerbaikan]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  // Aset rusak
  const asetRusak = asetOperasional.filter(
    item => item.kondisi_asetoperasional?.toLowerCase().includes("rusak")
  );

  // Tanggal hari ini
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });

  // User yang login
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");


  // ── SUMMARY CARDS ──
  const summaryCards = [
    {
      label: "Total User",
      value: users.length,
      icon: "fa-users",
      color: "#3b82f6",
      bg: "rgba(59,130,246,0.1)",
      link: "/user",
    },
    {
      label: "Aset Operasional",
      value: asetOperasional.length,
      icon: "fa-cogs",
      color: "#16a34a",
      bg: "rgba(22,163,74,0.1)",
      link: "/asetoperasional",
    },
    {
      label: "Department",
      value: departments.length,
      icon: "fa-building",
      color: "#8b5cf6",
      bg: "rgba(139,92,246,0.1)",
      link: "/indexDepartment",
    },
    {
      label: "Manufacturer",
      value: manufacturers.length,
      icon: "fa-industry",
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.1)",
      link: "/manufacturer",
    },
    {
      label: "Request Perbaikan",
      value: requestPerbaikan.length,
      icon: "fa-wrench",
      color: "#ec4899",
      bg: "rgba(236,72,153,0.1)",
      link: "/request/perbaikan",
    },
    {
      label: "Aset Rusak",
      value: asetRusak.length,
      icon: "fa-exclamation-triangle",
      color: "#ef4444",
      bg: "rgba(239,68,68,0.1)",
      link: "/asetoperasional",
    },
  ];


  // ======================================================
  // === RENDER
  // ======================================================

  if (loading) {
    return (
      <div className="page-wrapper" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center", color: "#6b7280" }}>
          <i className="fa fa-spinner fa-spin fa-2x mb-3" style={{ color: "var(--brand)" }}></i>
          <p style={{ marginTop: "12px" }}>Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">

      {/* ── HEADER SELAMAT DATANG ── */}
      <div style={{
        background: "linear-gradient(135deg, #0f1a13 0%, #166534 100%)",
        borderRadius: "14px",
        padding: "24px 28px",
        marginBottom: "24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 20px rgba(22,163,74,0.2)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Dekorasi lingkaran background */}
        <div style={{
          position: "absolute", right: "-40px", top: "-40px",
          width: "180px", height: "180px", borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
        }} />
        <div style={{
          position: "absolute", right: "60px", bottom: "-60px",
          width: "120px", height: "120px", borderRadius: "50%",
          background: "rgba(255,255,255,0.03)",
        }} />

        <div>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px", marginBottom: "4px" }}>
            <i className="fa fa-calendar me-1"></i> {today}
          </p>
          <h2 style={{ color: "#fff", fontWeight: 700, fontSize: "22px", margin: 0 }}>
            Selamat Datang, {currentUser?.name || "Admin"} 👋
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", marginTop: "4px", marginBottom: 0 }}>
            Berikut ringkasan data sistem hari ini
          </p>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: "10px",
            padding: "10px 18px",
            backdropFilter: "blur(6px)",
          }}>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "11px", margin: 0 }}>Role</p>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: "15px", margin: 0 }}>
              {currentUser?.role?.nama_role || "Admin"}
            </p>
          </div>
        </div>
      </div>


      {/* ── SUMMARY CARDS ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
        marginBottom: "24px",
      }}>
        {summaryCards.map((card, i) => (
          <Link
            key={i}
            to={card.link}
            style={{ textDecoration: "none" }}
          >
            <div style={{
              background: "#fff",
              borderRadius: "14px",
              padding: "20px 22px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
              border: "1px solid #f0f0f0",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 6px rgba(0,0,0,0.06)"; }}
            >
              {/* Ikon */}
              <div style={{
                width: "52px", height: "52px", borderRadius: "12px",
                background: card.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <i className={`fa ${card.icon}`} style={{ fontSize: "20px", color: card.color }}></i>
              </div>

              {/* Teks */}
              <div>
                <p style={{ color: "#6b7280", fontSize: "12px", margin: 0, fontWeight: 500 }}>{card.label}</p>
                <p style={{ color: "#111827", fontSize: "26px", fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
                  {card.value}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>


      {/* ── BARIS CHART 1: PIE KONDISI + BAR MANUFACTURER ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "16px", marginBottom: "16px" }}>

        {/* PIE CHART: Kondisi Aset */}
        <div className="content-card" style={{ padding: "20px 22px" }}>
          <h6 style={{ fontWeight: 700, fontSize: "14px", color: "#111827", marginBottom: "16px" }}>
            <i className="fa fa-chart-pie me-2" style={{ color: "var(--brand)" }}></i>
            Kondisi Aset Operasional
          </h6>
          {kondisiData.length === 0 ? (
            <div style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0" }}>Tidak ada data</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={kondisiData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {kondisiData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val, name) => [`${val} unit`, name]} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* BAR CHART: Aset per Manufacturer */}
        <div className="content-card" style={{ padding: "20px 22px" }}>
          <h6 style={{ fontWeight: 700, fontSize: "14px", color: "#111827", marginBottom: "16px" }}>
            <i className="fa fa-chart-bar me-2" style={{ color: "#3b82f6" }}></i>
            Aset per Manufacturer
          </h6>
          {mfrData.length === 0 ? (
            <div style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0" }}>Tidak ada data</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={mfrData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip formatter={(val) => [`${val} unit`, "Jumlah Aset"]} />
                <Bar dataKey="total" fill="#16a34a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>


      {/* ── BARIS CHART 2: PIE STATUS REQUEST + TABEL REQUEST TERBARU ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "16px", marginBottom: "16px" }}>

        {/* PIE CHART: Status Request Perbaikan */}
        <div className="content-card" style={{ padding: "20px 22px" }}>
          <h6 style={{ fontWeight: 700, fontSize: "14px", color: "#111827", marginBottom: "16px" }}>
            <i className="fa fa-chart-pie me-2" style={{ color: "#ec4899" }}></i>
            Status Request Perbaikan
          </h6>
          {statusData.length === 0 ? (
            <div style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0" }}>Tidak ada data</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => {
                    const c = entry.name === "Diterima" ? "#16a34a"
                            : entry.name === "Ditolak"  ? "#ef4444"
                            : "#f59e0b";
                    return <Cell key={index} fill={c} />;
                  })}
                </Pie>
                <Tooltip formatter={(val, name) => [`${val} request`, name]} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* TABEL: Request Perbaikan Terbaru */}
        <div className="content-card" style={{ padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h6 style={{ fontWeight: 700, fontSize: "14px", color: "#111827", margin: 0 }}>
              <i className="fa fa-clock me-2" style={{ color: "#f59e0b" }}></i>
              Request Perbaikan Terbaru
            </h6>
            <Link to="/request/perbaikan" style={{ fontSize: "12px", color: "var(--brand)", textDecoration: "none", fontWeight: 600 }}>
              Lihat Semua →
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <div style={{ textAlign: "center", color: "#9ca3af", padding: "30px 0" }}>Tidak ada data</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f3f4f6" }}>
                  <th style={{ padding: "8px 10px", textAlign: "left", color: "#6b7280", fontWeight: 600, fontSize: "11px", textTransform: "uppercase" }}>Nama Aset</th>
                  <th style={{ padding: "8px 10px", textAlign: "left", color: "#6b7280", fontWeight: 600, fontSize: "11px", textTransform: "uppercase" }}>Staff</th>
                  <th style={{ padding: "8px 10px", textAlign: "left", color: "#6b7280", fontWeight: 600, fontSize: "11px", textTransform: "uppercase" }}>Status</th>
                  <th style={{ padding: "8px 10px", textAlign: "left", color: "#6b7280", fontWeight: 600, fontSize: "11px", textTransform: "uppercase" }}>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((req, i) => (
                  <tr key={req.id_request_perbaikan ?? i} style={{ borderBottom: "1px solid #f9fafb" }}>
                    <td style={{ padding: "10px 10px", color: "#111827", fontWeight: 500 }}>
                      {req.aset_operasional?.nama_asetoperasional ?? req.nama_aset ?? "-"}
                    </td>
                    <td style={{ padding: "10px 10px", color: "#6b7280" }}>
                      {req.user?.name ?? req.staff?.name ?? "-"}
                    </td>
                    <td style={{ padding: "10px 10px" }}>
                      <span style={{
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: 600,
                        ...(statusStyle[req.status_request] ?? statusStyle["Pending"]),
                      }}>
                        {req.status_request ?? "Pending"}
                      </span>
                    </td>
                    <td style={{ padding: "10px 10px", color: "#9ca3af", fontSize: "12px" }}>
                      {req.created_at
                        ? new Date(req.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>


      {/* ── TABEL ASET RUSAK ── */}
      {asetRusak.length > 0 && (
        <div className="content-card" style={{ padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h6 style={{ fontWeight: 700, fontSize: "14px", color: "#111827", margin: 0 }}>
              <i className="fa fa-exclamation-triangle me-2" style={{ color: "#ef4444" }}></i>
              Aset Kondisi Rusak
              <span style={{
                marginLeft: "8px", background: "rgba(239,68,68,0.1)", color: "#ef4444",
                borderRadius: "20px", padding: "2px 10px", fontSize: "12px", fontWeight: 700,
              }}>
                {asetRusak.length}
              </span>
            </h6>
            <Link to="/asetoperasional" style={{ fontSize: "12px", color: "var(--brand)", textDecoration: "none", fontWeight: 600 }}>
              Lihat Semua →
            </Link>
          </div>

          <div className="table-wrap">
            <table className="dark-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Kode Aset</th>
                  <th>Nama Aset</th>
                  <th>Kondisi</th>
                  <th>Lokasi</th>
                  <th>Manufacturer</th>
                </tr>
              </thead>
              <tbody>
                {asetRusak.slice(0, 5).map((row, i) => (
                  <tr key={row.id_operasional}>
                    <td>{i + 1}</td>
                    <td>{row.kode_asetoperasional || "-"}</td>
                    <td>{row.nama_asetoperasional || "-"}</td>
                    <td>
                      <span style={{
                        padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600,
                        background: "rgba(239,68,68,0.1)", color: "#ef4444",
                        border: "1px solid rgba(239,68,68,0.25)",
                      }}>
                        {row.kondisi_asetoperasional}
                      </span>
                    </td>
                    <td>{row.lokasi_asetoperasional || "-"}</td>
                    <td>{row.manufacturer?.nama_manufacturer || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}