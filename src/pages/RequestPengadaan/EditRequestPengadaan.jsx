// ======================================================
// === IMPORT
// ======================================================

import { Link, useParams, useNavigate } from "react-router-dom";
import { useRequestPengadaanForm } from "../../hooks/RequestPengadaan/useRequestPengadaanForm";
import { useState } from "react";

// ======================================================
// === COMPONENT UTAMA
// ======================================================

export default function EditRequestPengadaan() {

  // ======================================================
  // === ROUTING
  // ======================================================

  const { id } = useParams();
  const navigate = useNavigate();

  // ======================================================
  // === DATA & LOGIC FORM
  // ======================================================

  const {
    form,
    handleChange,
    updateRequestPengadaan
  } = useRequestPengadaanForm({ id });

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
      await updateRequestPengadaan();

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        navigate("/request/pengadaan");
      }, 2000);

    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui request pengadaan");
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

          <h4 className="mb-0 fw-bold">
            Approval Request Pengadaan
          </h4>

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">

              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>

              <li className="breadcrumb-item">
                <Link to="/request/pengadaan">
                  Data Request Pengadaan
                </Link>
              </li>

              <li className="breadcrumb-item active">
                Approval
              </li>

            </ol>
          </nav>

        </div>
      </div>

      {/* ====================================================== */}
      {/* === CARD FORM */}
      {/* ====================================================== */}

      <div className="content-card">

        <form onSubmit={handleSubmit}>

          <div className="upload-layout">

            {/* ====================================================== */}
            {/* === KIRI : DETAIL REQUEST (READONLY) */}
            {/* ====================================================== */}

            <div className="upload-left">

              <div className="content-card upload-detail-card">

                <h6 className="upload-detail-title">
                  <i className="fa fa-info-circle me-2 icon-brand"></i>
                  Detail Request Pengadaan
                </h6>

                {/* Nama Pengadaan */}
                <div className="form-group">

                  <label className="form-label">
                    Nama Pengadaan
                  </label>

                  <span className="form-info">
                    <i className="fa fa-box me-2 icon-brand"></i>
                    {form.nama_pengadaan || "-"}
                  </span>

                </div>

                {/* Department */}
                <div className="form-group">

                  <label className="form-label">
                    Department
                  </label>

                  <span className="form-info">
                    <i className="fa fa-building me-2 icon-brand"></i>
                    {form.department?.nama_department || "-"}
                  </span>

                </div>

                {/* Tanggal Pengajuan */}
                <div className="form-group">

                  <label className="form-label">
                    Tanggal Pengajuan
                  </label>

                  <span className="form-info">
                    <i className="fa fa-calendar me-2 icon-brand"></i>
                    {form.tanggal_pengadaan || "-"}
                  </span>

                </div>

                {/* File Request */}
                <div className="form-group">

                  <label className="form-label">
                    File Request
                  </label>

                  {form.file_request ? (
                    <a
                      href={`http://127.0.0.1:8000/storage/${form.file_request}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-action btn-edit btn-file"
                    >
                      <i className="fa fa-file-alt"></i>
                      Lihat File
                    </a>
                  ) : (
                    <span className="form-info">
                      <i className="fa fa-file-times me-2 icon-brand"></i>
                      Tidak ada file
                    </span>
                  )}

                </div>

              </div>

            </div>

            {/* ====================================================== */}
            {/* === KANAN : APPROVAL MANAGER */}
            {/* ====================================================== */}

            <div className="upload-right">

              <div className="content-card upload-detail-card">

                <h6 className="upload-detail-title">
                  <i className="fa fa-check-circle me-2 icon-brand"></i>
                  Approval Manager
                </h6>

                {/* Status Approval */}
                <div className="form-group">

                  <label className="form-label">
                    Status Approval Manager
                  </label>

                  <select
                    name="status_approval"
                    className="dark-input"
                    style={{ width: "100%" }}
                    value={form.status_approval}
                    onChange={handleChange}
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                </div>

                {/* Catatan Manager */}
                <div className="form-group">

                  <label className="form-label">
                    Catatan Manager
                  </label>

                  <textarea
                    name="catatan_manager"
                    className="dark-input"
                    style={{ width: "100%" }}
                    value={form.catatan_manager}
                    onChange={handleChange}
                    placeholder="Masukkan catatan approval (opsional)"
                    rows={5}
                  />

                </div>

                {/* Button Action */}
                <div className="form-actions">

                  <button
                    type="submit"
                    className="btn-brand"
                  >
                    <i className="fa fa-save"></i>
                    {" "}Simpan Approval
                  </button>

                  <Link
                    to="/request/pengadaan"
                    className="btn-action btn-edit"
                  >
                    Batal
                  </Link>

                </div>

              </div>

            </div>

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
            <div className="modal-body-content text-center">
              <i className="fa fa-check-circle fa-3x mb-3 icon-brand"></i>
              <p>Data request pengadaan berhasil diperbarui.</p>
              <small>Mengalihkan ke halaman data...</small>
            </div>
          </div>
        </>
      )}

    </div>
  );
}