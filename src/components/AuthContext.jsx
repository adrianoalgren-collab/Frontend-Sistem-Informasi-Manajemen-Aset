// ======================================================
// === AuthContext.jsx
// ======================================================

import { createContext, useContext, useState, useCallback } from "react";

// ── Context ───────────────────────────────────────────
const AuthContext = createContext(null);

// ── Helper localStorage ───────────────────────────────
const STORAGE_KEY = "user";

function readStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage penuh atau disabled (private mode)
    console.warn("AuthContext: gagal menyimpan ke localStorage");
  }
}

function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // silent
  }
}

// ── Provider ──────────────────────────────────────────
export function AuthProvider({ children }) {
  // Inisialisasi dari localStorage hanya sekali saat app pertama load
  const [user, setUser] = useState(() => readStorage());

  /**
   * Dipanggil setelah login berhasil.
   * Terima seluruh object user dari response API.
   *
   * @param {object} userData - data user dari response backend
   */
  const login = useCallback((userData) => {
    writeStorage(userData);
    setUser(userData);
  }, []);

  /**
   * Dipanggil saat logout.
   * Bersihkan state dan localStorage.
   */
  const logout = useCallback(() => {
    clearStorage();
    setUser({});
  }, []);

  /**
   * Dipanggil jika ada perubahan sebagian data user
   * (misalnya update profil nama) tanpa harus login ulang.
   *
   * @param {object} partialData - field yang ingin diupdate
   */
  const updateUser = useCallback((partialData) => {
    setUser((prev) => {
      const updated = { ...prev, ...partialData };
      writeStorage(updated);
      return updated;
    });
  }, []);

  // Derived state — cukup hitung di sini, tidak perlu diulang di useRole
  const isAuthenticated = Boolean(user?.id);

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────
/**
 * Gunakan hook ini di dalam komponen manapun
 * untuk mengakses data user dan fungsi auth.
 *
 * @returns {{ user, isAuthenticated, login, logout, updateUser }}
 */
export function useAuth() {
  const ctx = useContext(AuthContext);

  if (ctx === null) {
    throw new Error("useAuth() harus digunakan di dalam <AuthProvider>");
  }

  return ctx;
}