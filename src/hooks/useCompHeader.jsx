// ======================================================
// === IMPORT
// ======================================================

import { useNavigate } from "react-router-dom"; // Hook navigasi halaman
import api from "../services/api";

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
  try {
    await api.post("/logout");
  } catch (error) {
    console.log("Logout error:", error);
  }

  localStorage.removeItem("token");
  navigate("/");
};

  // ======================================================
  // === RETURN VALUE
  // ======================================================

  return {
    handleLogout, // Function logout
  };
};