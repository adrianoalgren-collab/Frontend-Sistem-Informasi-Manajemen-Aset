// ======================================================
// === IMPORT
// ======================================================

import { Link, useParams, useNavigate } from "react-router-dom";
import { useManufacturerForm } from "../../hooks/Manufacturer/useManufacturerForm";
import { useState } from "react";


// ======================================================
// === COMPONENT UTAMA
// ======================================================

export default function EditManufacturer() {

  // ======================================================
  // === ROUTING
  // ======================================================

  const { id } = useParams();
  const navigate = useNavigate();


  // ======================================================
  // === DATA & LOGIC FORM
  // ======================================================

  const { form, handleChange, updateManufacturer } = useManufacturerForm(id);


  // ======================================================
  // === UI STATE
  // ======================================================

  const [showSuccess, setShowSuccess] = useState(false);


  // ======================================================
  // === HANDLE SUBMIT
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateManufacturer(id);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/manufacturer");
      }, 2000);

    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui data manufacturer");
    }
  };


  // ======================================================
  // === RENDER UI
  // ======================================================

  return (
    <div className="page-wrapper">

      {/* ── BREADCRUMB ── */}
      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold">Edit Data Manufacturer</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/manufacturer">Data Manufacturer</Link></li>
              <li className="breadcrumb-item active">Edit</li>
            </ol>
          </nav>
        </div>
      </div>


      {/* ── CARD FORM ── */}
      <div className="content-card">

        {/* Tombol kembali */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
          <Link to="/manufacturer" className="btn-action btn-edit">
            <i className="fa fa-arrow-left"></i> Kembali
          </Link>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Nama Manufacturer */}
          <div className="form-group">
            <label className="form-label">Nama Manufacturer</label>
            <input
              type="text"
              name="nama_manufacturer"
              className="dark-input"
              style={{ width: "100%" }}
              value={form.nama_manufacturer || ""}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email_manufacturer"
              className="dark-input"
              style={{ width: "100%" }}
              value={form.email_manufacturer || ""}
              onChange={handleChange}
            />
          </div>

          {/* Telepon */}
          <div className="form-group">
            <label className="form-label">Telepon</label>
            <input
              type="text"
              name="telfon_manufacturer"
              className="dark-input"
              style={{ width: "100%" }}
              value={form.telfon_manufacturer || ""}
              onChange={handleChange}
            />
          </div>

          {/* Tombol submit & batal */}
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <button type="submit" className="btn-brand">
              <i className="fa fa-save"></i> Simpan Perubahan
            </button>
            <Link to="/manufacturer" className="btn-action btn-edit">
              Batal
            </Link>
          </div>

        </form>
      </div>


      {/* ── MODAL SUKSES ── */}
      {showSuccess && (
        <>
          <div className="modal-overlay" />
          <div className="modal-box">

            <div className="modal-head">
              <span className="modal-title">Berhasil</span>
            </div>

            <div className="modal-body-content" style={{ textAlign: "center" }}>
              <i className="fa fa-check-circle fa-3x mb-3" style={{ color: "var(--brand)" }}></i>
              <p>Data manufacturer berhasil diperbarui.</p>
              <small>Mengalihkan ke halaman data...</small>
            </div>

          </div>
        </>
      )}
    </div>
  );
}