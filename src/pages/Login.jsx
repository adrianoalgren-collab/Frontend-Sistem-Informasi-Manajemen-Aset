// ======================================================
// === IMPORT
// ======================================================

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../components/AuthContext"; // ← tambah
import api from "../services/api";


// ======================================================
// === HALAMAN LOGIN
// ======================================================

export default function Login() {

  // ── STATE FORM ──
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [loading,      setLoading]      = useState(false);
  const [errorMsg,     setErrorMsg]     = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ── STATE UI ──
  const [showModal,  setShowModal]  = useState(false);
  const [imgLoaded,  setImgLoaded]  = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  const navigate    = useNavigate();
  const { login }   = useAuth(); // ← ambil fungsi login dari context


  // ======================================================
  // === HANDLE LOGIN
  // ======================================================

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { data } = await api.post(
        "/login",
        { email, password },
        { headers: { Accept: "application/json" } }
      );

      // simpan token ke localStorage — dipakai api.js untuk request berikutnya
      localStorage.setItem("token", data.token);

      // simpan user via AuthContext — menggantikan localStorage.setItem("user", ...)
      // sekarang semua komponen otomatis reaktif terhadap perubahan user
      login(data.user);

      setShowModal(true);
      setTimeout(() => navigate("/dashboard"), 2000);

    } catch (error) {
      // bedakan error jaringan vs credentials salah
      if (error.response?.status === 401 || error.response?.status === 422) {
        setErrorMsg("Email atau password salah.");
      } else if (!error.response) {
        setErrorMsg("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
      } else {
        setErrorMsg("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-page">
      <div className="login-container">

        {/* ── FORM LOGIN (kiri) ── */}
        <div className="login-form">

          <div className="login-header">
            <img
              src="/img/LogoEMP.png"
              alt="Logo PT Imbang Tata Alam"
              className={`login-logo ${logoLoaded ? "loaded" : ""}`}
              onLoad={() => setLogoLoaded(true)}
            />
            <h3>Sistem Informasi Manajemen Aset</h3>
            <h3>PT Imbang Tata Alam</h3>
            <p>Silahkan login untuk mengakses data.</p>
          </div>

          <form onSubmit={handleLogin} noValidate>

            {/* input email */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="text"
                placeholder="Email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* input password dengan tombol show/hide */}
            <div className="form-group password-group">
              <label htmlFor="password">Password</label>

              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="******"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {/* tombol show/hide — pakai button agar accessible via keyboard */}
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* pesan error */}
            {errorMsg && (
              <div className="alert alert-danger mt-2" role="alert">
                {errorMsg}
              </div>
            )}

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                  Memproses...
                </>
              ) : (
                "Login"
              )}
            </button>

          </form>
        </div>

        {/* ── GAMBAR SAMPING (kanan) ── */}
        <div className="login-image">
          <img
            src="img/loginpicture.jpg"
            alt="PT Imbang Tata Alam"
            className={`login-img ${imgLoaded ? "loaded" : ""}`}
            onLoad={() => setImgLoaded(true)}
          />
        </div>
      </div>


      {/* ── MODAL SUKSES ── */}
      {showModal && (
        <div role="dialog" aria-modal="true" aria-label="Login berhasil">
          <div className="custom-backdrop"></div>

          <div className="custom-modal">
            <div className="modal-card text-center">

              <div className="success-icon">
                <i className="fa fa-check-circle" aria-hidden="true"></i>
              </div>

              <h4 className="mt-3">Login Berhasil</h4>
              <p>Selamat datang</p>

              <div className="spinner-border text-success mt-2" aria-hidden="true"></div>
              <p className="mt-2 small text-muted">
                Mengarahkan ke halaman utama...
              </p>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}