// ======================================================
// === IMPORT
// ======================================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJenisAsetOperasionalForm } from "../../hooks/AsetOperasional/useJenisAsetOperasionalForm";

// ======================================================
// === COMPONENT
// ======================================================

export default function AddJenisAsetOperasional() {

  // ======================================================
  // === HOOK
  // ======================================================

  const {
    form,
    handleChange,
    storeJenisAsetOperasional,
    manufacturerList,
    loading,
    error,
  } = useJenisAsetOperasionalForm();

  // ======================================================
  // === ROUTING & UI STATE
  // ======================================================

  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // ======================================================
  // === HANDLE SUBMIT
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      setSubmitting(true);

      await storeJenisAsetOperasional();

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        navigate("/asetoperasional/tambah");
      }, 2000);

    } catch (err) {

      alert(
        err?.message ||
        "Gagal menyimpan data jenis aset operasional."
      );

    } finally {
      setSubmitting(false);
    }
  };

  // ======================================================
  // === RENDER
  // ======================================================

  return (
    <div className="page-wrapper">

      {/* ───────────────────────────────────────── */}
      {/* BREADCRUMB */}
      {/* ───────────────────────────────────────── */}
      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex justify-content-between align-items-center">

          <h4 className="mb-0 fw-bold">
            Tambah Data Jenis Aset Operasional
          </h4>

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">

              <li className="breadcrumb-item">
                <Link to="/">
                  Home
                </Link>
              </li>

              <li className="breadcrumb-item">
                <Link to="/jenisasetoperasional">
                  Data Jenis Aset Operasional
                </Link>
              </li>

              <li className="breadcrumb-item active">
                Tambah
              </li>

            </ol>
          </nav>

        </div>
      </div>

      {/* ───────────────────────────────────────── */}
      {/* CARD FORM */}
      {/* ───────────────────────────────────────── */}
      <div className="content-card">


        {/* ERROR */}
        {error && (
          <div
            style={{
              marginBottom: "16px",
              padding: "10px 14px",
              borderRadius: "8px",
              background: "#fef2f2",
              color: "#ef4444",
              fontSize: "14px",
            }}
          >
            <i className="fa fa-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* NAMA ASET */}
          <div className="form-group">

            <label className="form-label">
              Nama Aset
            </label>

            <input
              type="text"
              name="nama_asetoperasional"
              className="dark-input"
              style={{ width: "100%" }}
              value={form.nama_asetoperasional}
              onChange={handleChange}
              placeholder="Contoh: Laptop Dell Latitude 5420"
              disabled={submitting}
              required
            />

          </div>

          {/* MANUFACTURER */}
          <div className="form-group">

            <div className="d-flex align-items-center mb-2">

              <label className="form-label mb-0">
                Manufacturer
              </label>

              <small
                className="ms-2"
                style={{ color: "#9ca3af" }}
              >
                (Jika manufacturer belum tersedia, tambahkan melalui tombol di kanan atas)
              </small>

            </div>

            <select
              name="id_manufacturer"
              className="dark-select"
              style={{ width: "100%" }}
              value={form.id_manufacturer}
              onChange={handleChange}
              disabled={loading || submitting}
              required
            >
              <option value="">
                {loading
                  ? "Memuat manufacturer..."
                  : "-- Pilih Manufacturer --"}
              </option>

              {manufacturerList.map((manufacturer) => (
                <option
                  key={manufacturer.id_manufacturer}
                  value={manufacturer.id_manufacturer}
                >
                  {manufacturer.nama_manufacturer}
                </option>
              ))}

            </select>

          </div>

          {/* FOTO */}
          <div className="form-group">

            <label className="form-label">
              Foto Aset
            </label>

            <input
              type="file"
              name="foto_asetoperasional"
              className="dark-input"
              style={{ width: "100%" }}
              accept="image/*"
              onChange={handleChange}
              disabled={submitting}
            />

            <small
              style={{
                color: "#888",
                marginTop: "4px",
                display: "block",
              }}
            >
              <i className="fa fa-info-circle me-1"></i>
              Foto ini akan digunakan sebagai foto utama untuk seluruh unit aset.
            </small>

          </div>

          {/* BUTTON */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "8px",
            }}
          >

            <button
              type="submit"
              className="btn-brand"
              disabled={submitting}
            >
              <i className="fa fa-save"></i>
              {" "}
              {submitting ? "Menyimpan..." : "Simpan"}
            </button>

            <Link
              to="/jenisasetoperasional"
              className="btn-action btn-edit"
            >
              Batal
            </Link>

          </div>

        </form>

      </div>

      {/* ───────────────────────────────────────── */}
      {/* MODAL SUKSES */}
      {/* ───────────────────────────────────────── */}
      {showSuccess && (
        <>
          <div className="modal-overlay" />

          <div className="modal-box">

            <div className="modal-head">
              <span className="modal-title">
                Berhasil
              </span>
            </div>

            <div className="modal-body-content text-center">

              <i className="fa fa-check-circle fa-3x mb-3 icon-brand"></i>

              <p>
                Data jenis aset operasional berhasil disimpan.
              </p>

              <small>
                Mengalihkan ke halaman data...
              </small>

            </div>

          </div>
        </>
      )}

    </div>
  );
}