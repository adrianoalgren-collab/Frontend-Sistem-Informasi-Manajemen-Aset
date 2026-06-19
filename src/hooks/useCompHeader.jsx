// ======================================================
// === IMPORT
// ======================================================

import { useNavigate } from "react-router-dom"; // Hook navigasi halaman
import axios from "axios"; // HTTP client untuk request API

// ======================================================
// === CUSTOM HOOK HEADER
// ======================================================

/**
 * Custom Hook: useHeader
 * Digunakan untuk logic header, seperti logout
 */
export const useCompHeader = () => {

  // ======================================================
  // === ROUTING
  // ======================================================

  const navigate = useNavigate(); // Hook untuk pindah halaman

  // ======================================================
  // === FUNCTION LOGOUT
  // ======================================================

  const handleLogout = async () => {
    const token = localStorage.getItem("token"); // Ambil token dari localStorage

    try {
      // Request API logout
      await axios.post(
        "http://127.0.0.1:8000/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
    } catch (error) {
      console.log("Logout error:", error); // Log error jika gagal
    }

    // Hapus token dari localStorage tetap dilakukan meskipun request gagal
    localStorage.removeItem("token");

    navigate("/"); // Redirect ke halaman login / home
  };

  // ======================================================
  // === RETURN VALUE
  // ======================================================

  return {
    handleLogout, // Function logout
  };
};