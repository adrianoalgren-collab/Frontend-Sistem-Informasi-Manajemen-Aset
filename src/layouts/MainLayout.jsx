// ======================================================
// ================= IMPORT =============================
// ======================================================

// Outlet → untuk menampilkan halaman sesuai route child
import { Outlet } from "react-router-dom";

// Header → berisi Sidebar + Topbar
import Header from "../components/CompHeader";


// ======================================================
// ================= MAIN LAYOUT ========================
// ======================================================

/**
 * MainLayout
 * ------------------------------------------------------
 * Layout utama setelah user login.
 * Berisi:
 * - Sidebar + Topbar (Header)
 * - Area konten utama (Outlet)
 *
 * Semua halaman protected akan dibungkus layout ini.
 */
export default function MainLayout() {
  return (
    <div style={{ display: "flex" }}>
      
      {/* ==================================================
          SIDEBAR + TOPBAR
          Komponen Header biasanya berisi:
          - Sidebar navigasi
          - Topbar / navbar
      ================================================== */}
      <Header />


      {/* ==================================================
          KONTEN UTAMA
          Outlet akan menampilkan halaman sesuai route
      ================================================== */}
        <div
          style={{
            flex: 1,                // Mengisi sisa ruang setelah sidebar
            marginLeft: "200px",    // Offset sesuai lebar sidebar
            marginTop: "60px",      // Offset sesuai tinggi topbar
            padding: "24px",        // Jarak isi konten
            backgroundColor: "#f2f2f2", // Warna background konten
            minHeight: "100vh",     // Minimal setinggi layar
          }}
        >
          <Outlet />
        </div>
    </div>
  );
}