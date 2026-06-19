// ======================================================
// === ProtectedRoute.jsx
// Komponen penjaga halaman — hanya user yang sudah login
// yang boleh masuk ke halaman protected.
//
// Cara pakai:
//   <ProtectedRoute>
//     <HalamanYangDilindungi />
//   </ProtectedRoute>
// ======================================================

import { Navigate } from "react-router-dom";


export default function ProtectedRoute({ children }) {

  // cek apakah token tersimpan di localStorage
  // token disimpan saat login berhasil, dihapus saat logout
  const token = localStorage.getItem("token");

  // kalau tidak ada token, berarti belum login
  // langsung arahkan ke halaman login dan blokir akses
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // kalau token ada, tampilkan halaman yang diminta
  return children;
}