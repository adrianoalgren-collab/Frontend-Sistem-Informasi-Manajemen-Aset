// ======================================================
// === IMPORT
// ======================================================

import { NavLink, useLocation } from "react-router-dom";
import { useCompHeader } from "../hooks/useCompHeader";
import { useRole }       from "../hooks/useRole";
import { useAuth } from "../components/AuthContext";
import { useState }      from "react";


export default function CompHeader() {

  const { handleLogout }          = useCompHeader();
  const location                  = useLocation();
  const {
    isAdmin,
    isManager,
    isStaffKantor,
    isStaffLapangan,
    isDriver,
    isStaff,
    idRole,
  } = useRole();
  const { user }                  = useAuth(); // ← ganti localStorage.getItem

  const [openRequest, setOpenRequest] = useState(false);

  // ── ROUTING BERBASIS ROLE ──────────────────────────
  // Sebelumnya pakai role === "admin" (string) — sekarang pakai idRole yang lebih reliable
  const requestPerbaikanTo = (isAdmin || isManager) ? "/request/perbaikan" : "/request/perbaikan/staff";
  const reportTo           = (isAdmin || isManager) ? "/report"            : "/report/staff";
  const requestPengadaanTo = (isAdmin || isManager) ? "/request/pengadaan" : "/request/pengadaan/staff";
  const requestPemakaianTo = (isAdmin || isManager) ? "/request/pemakaian" : "/request/pemakaian/staff";

  const isRequestActive = location.pathname.startsWith("/request") || location.pathname.startsWith("/requestPengadaan");
  const isRequestOpen   = openRequest || isRequestActive;

  // State
  const [isAsetOpen, setIsAsetOpen] = useState(false);
  const isAsetActive = location.pathname.startsWith("/asetoperasional") || 
                      location.pathname.startsWith("/jenisasetoperasional");


  return (
    <>
      {/* ══════════════════════════════════════════════════
          SIDEBAR
      ══════════════════════════════════════════════════ */}
      <div className="sidebar-shell">

        <div className="sidebar-logo">
          <div className="logo-ring">
            <img src="/img/LogoEMP.png" alt="Logo" />
          </div>
          <div className="logo-text">
            <span>PT. Imbang Tata Alam</span>
            <span>Asset Management</span>
          </div>
        </div>

        <nav className="sidebar-nav">

          <div className="nav-section-label">Main Menu</div>

          <NavLink to="/dashboard" end
            className={({ isActive }) => `nav-link-item${isActive ? " active" : ""}`}
            data-tooltip="Dashboard">
            <span className="nav-icon"><i className="fa fa-chart-bar" /></span>
            <span className="nav-label">Dashboard</span>
          </NavLink>

          {isAdmin && (
            <NavLink to="/user"
              className={({ isActive }) => `nav-link-item${isActive ? " active" : ""}`}
              data-tooltip="Data User">
              <span className="nav-icon"><i className="fa fa-users" /></span>
              <span className="nav-label">Data User</span>
            </NavLink>
          )}

            {isDriver && (
              <NavLink to="/asetKendaraan/staff"
                className={({ isActive }) => `nav-link-item${isActive ? " active" : ""}`}
                data-tooltip="Kendaraan Saya">
                <span className="nav-icon"><i className="fa fa-car" /></span>
                <span className="nav-label">Kendaraan Saya</span>
              </NavLink>
            )}

          <div className="nav-divider" />

          <div className="nav-section-label">Data Aset</div>

          <NavLink to="/asetbarangpakai"
            className={({ isActive }) => `nav-link-item${isActive ? " active" : ""}`}
            data-tooltip="Aset Barang Pakai">
            <span className="nav-icon"><i className="fa fa-boxes" /></span>
            <span className="nav-label">Aset Barang Pakai</span>
          </NavLink>

          <button
            className={`nav-link-item${isAsetActive ? " active" : ""}`}
            onClick={() => setIsAsetOpen(prev => !prev)}
            data-tooltip="Aset Operasional"
            style={{ width: "100%", background: "none", border: "none", cursor: "pointer" }}
          >
            <span className="nav-icon"><i className="fa fa-cogs" /></span>
            <span className="nav-label">Aset Operasional</span>
            <i className={`fa fa-chevron-down nav-chevron${isAsetOpen ? " open" : ""}`} />
          </button>

          <div className={`submenu${isAsetOpen ? " open" : ""}`}>
            <NavLink to="/asetoperasional"
              className={({ isActive }) => `submenu-item${isActive ? " active" : ""}`}>
              <i className="fa fa-cogs" /> Kode Aset
            </NavLink>

            <NavLink to="/jenisasetoperasional"
              className={({ isActive }) => `submenu-item${isActive ? " active" : ""}`}>
              <i className="fa fa-list" /> Nama Aset
            </NavLink>
          </div>

          <NavLink to="/asetKendaraan"
            className={({ isActive }) => `nav-link-item${isActive ? " active" : ""}`}
            data-tooltip="Aset Kendaraan">
            <span className="nav-icon"><i className="fa fa-car" /></span>
            <span className="nav-label">Aset Kendaraan</span>
          </NavLink>

          <NavLink to="/manufacturer"
            className={({ isActive }) => `nav-link-item${isActive ? " active" : ""}`}
            data-tooltip="Manufacturer">
            <span className="nav-icon"><i className="fa fa-industry" /></span>
            <span className="nav-label">Manufacturer</span>
          </NavLink>

          <NavLink to="/department"
            className={({ isActive }) => `nav-link-item${isActive ? " active" : ""}`}
            data-tooltip="Department">
            <span className="nav-icon"><i className="fa fa-building" /></span>
            <span className="nav-label">Department</span>
          </NavLink>

          <div className="nav-divider" />

          <div className="nav-section-label">Transaksi</div>

          <button
            className={`nav-link-item${isRequestActive ? " active" : ""}`}
            onClick={() => setOpenRequest(prev => !prev)}
            data-tooltip="Request Aset"
            style={{ width: "100%", background: "none", border: "none", cursor: "pointer" }}
          >
            <span className="nav-icon"><i className="fa fa-paper-plane" /></span>
            <span className="nav-label">Request Aset</span>
            <i className={`fa fa-chevron-down nav-chevron${isRequestOpen ? " open" : ""}`} />
          </button>

          <div className={`submenu${isRequestOpen ? " open" : ""}`}>
            <NavLink to={requestPerbaikanTo}
              className={({ isActive }) => `submenu-item${isActive ? " active" : ""}`}>
              <i className="fa fa-wrench" /> Request Perbaikan
            </NavLink>

            <NavLink to={requestPengadaanTo}
              className={({ isActive }) => `submenu-item${isActive ? " active" : ""}`}>
              <i className="fa fa-plus-circle" /> Request Pengadaan
            </NavLink>

            <NavLink to={requestPemakaianTo}
              className={({ isActive }) => `submenu-item${isActive ? " active" : ""}`}>
              <i className="fa fa-minus-circle" /> Request Pemakaian
            </NavLink>
          </div>

          <NavLink to={reportTo}
            className={({ isActive }) => `nav-link-item${isActive ? " active" : ""}`}
            data-tooltip="Pengajuan Laporan">
            <span className="nav-icon"><i className="fa fa-file-alt" /></span>
            <span className="nav-label">Pengajuan Laporan</span>
          </NavLink>

        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn" data-tooltip="Logout">
            <span className="nav-icon" style={{ color: "#f87171" }}>
              <i className="fa fa-sign-out-alt" />
            </span>
            <span className="logout-label">Logout</span>
          </button>
        </div>
      </div>


      {/* ══════════════════════════════════════════════════
          TOPBAR
      ══════════════════════════════════════════════════ */}
      <div className="topbar-shell" style={{ left: "220px" }}>

        <div className="topbar-title">
          <span>Sistem Informasi Manajemen Aset</span>
          <span className="topbar-badge">SIMA</span>
        </div>

        <div className="topbar-right">
          <span className="topbar-time">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "short", day: "numeric", month: "short", year: "numeric"
            })}
          </span>

          {/* avatar dari context, tidak lagi baca localStorage langsung */}
          <div className="topbar-avatar">
            {user?.name
              ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
              : "??"}
          </div>
        </div>
      </div>
    </>
  );
}