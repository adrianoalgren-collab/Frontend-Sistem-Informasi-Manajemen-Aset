// ======================================================
// === IMPORT
// ======================================================

import { Link, useNavigate } from "react-router-dom";
import { useRequestPengadaanForm } from "../../hooks/RequestPengadaan/useRequestPengadaanForm";
import { useRole } from "../../hooks/useRole";
import { useState } from "react";

// ======================================================
// === KOMPONEN UTAMA
// ======================================================

export default function AddRequestPengadaan() {

  const navigate = useNavigate();
 
  const {
    userId,
    userName,
    departmentId,
    departmentName,
    isAdmin
  } = useRole();

   const redirectTo = isAdmin
    ? "/request/pengadaan"
    : "/request/pengadaan/staff";


  const {
    form,
    handleChange,
    storeRequestPengadaan,
    today,
    fileInputRef,
    selectedFile,
    dragOver,
    setDragOver,
    handleDrop,
    handleFileInput,
    removeFile,
    formatSize,
    getFileIcon,
  } = useRequestPengadaanForm({
    defaultValues: {
      status_approval: "Pending",
      id_user: userId,
      id_department: departmentId,
    },
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    storeRequestPengadaan()
      .then(() => {

        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
          navigate(redirectTo);
        }, 2000);

      })
      .catch(() => {
        alert("Gagal menyimpan request pengadaan");
      });
  };

  // ======================================================
  // === RENDER
  // ======================================================

  return (
    <div className="page-wrapper">

      {/* ── BREADCRUMB ── */}
      <div className="card shadow-sm mb-3">

        <div className="card-body d-flex justify-content-between align-items-center">

          <h4 className="mb-0 fw-bold">
            Tambah Request Pengadaan
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
                Tambah
              </li>

            </ol>

          </nav>

        </div>

      </div>

      <form onSubmit={handleSubmit}>

        <div className="upload-layout">

          {/* ── KIRI: Upload File ── */}
          <div className="upload-left">

            <div
              className={`drop-zone ${dragOver ? "drag-active" : ""} ${selectedFile ? "has-file" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >

              <input
                ref={fileInputRef}
                type="file"
                name="file_request"
                accept=".pdf,.doc,.docx"
                onChange={handleFileInput}
                className="drop-input"
              />

              {!selectedFile ? (

                <div className="drop-empty">

                  <div className="drop-icon-wrap">
                    <i className="fa fa-cloud-upload-alt drop-icon"></i>
                    <div className="drop-icon-ring"></div>
                  </div>

                  <p className="drop-title">
                    Drag & drop file request ke sini
                  </p>

                  <p className="drop-sub">
                    atau klik untuk pilih file
                  </p>

                  <div className="drop-formats">
                    <span>PDF</span>
                    <span>DOC</span>
                    <span>DOCX</span>
                  </div>

                  <p className="drop-limit">
                    Ukuran maksimal 10MB
                  </p>

                </div>

              ) : (

                <div className="drop-preview">

                  <div className="file-icon-wrap">
                    <i className={`fa ${getFileIcon(selectedFile.name)} file-icon`}></i>
                  </div>

                  <p className="file-name">
                    {selectedFile.name}
                  </p>

                  <p className="file-size">
                    {formatSize(selectedFile.size)}
                  </p>

                  <div className="file-ready">
                    <i className="fa fa-check-circle me-1"></i>
                    Siap diupload
                  </div>

                  <button
                    type="button"
                    className="file-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                  >
                    <i className="fa fa-times me-1"></i>
                    Ganti file
                  </button>

                </div>

              )}

            </div>

          </div>

          {/* ── KANAN: Detail Request ── */}
          <div className="upload-right">

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

                <input
                  type="text"
                  name="nama_pengadaan"
                  className="dark-input"
                  placeholder="Contoh: Pengadaan Laptop Staff IT"
                  value={form.nama_pengadaan || ""}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* Kategori */}
              <div className="form-group">

                <label className="form-label">
                  Kategori Pengadaan
                </label>

                <input
                  type="text"
                  name="kategori_pengadaan"
                  className="dark-input"
                  placeholder="Contoh: IT Equipment"
                  value={form.kategori_pengadaan || ""}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* Staff */}
              <div className="form-group">

                <label className="form-label">
                  Diajukan Oleh
                </label>

                <span className="form-info">
                  <i className="fa fa-user me-2 icon-brand"></i>
                  {userName || "-"}
                </span>

                <input
                  type="hidden"
                  name="id_user"
                  value={form.id_user || userId || ""}
                  onChange={handleChange}
                />

              </div>

              {/* Department */}
              <div className="form-group">

                <label className="form-label">
                  Department
                </label>

                <span className="form-info">
                  <i className="fa fa-building me-2 icon-brand"></i>
                  {departmentName || "-"}
                </span>

                <input
                  type="hidden"
                  name="id_department"
                  value={form.id_department || departmentId || ""}
                  onChange={handleChange}
                />

              </div>

              {/* Tanggal */}
              <div className="form-group">

                <label className="form-label">
                  Tanggal Request
                </label>

                <span className="form-info">
                  <i className="fa fa-calendar me-2 icon-brand"></i>

                  {new Date().toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}

                </span>

                <input
                  type="hidden"
                  name="tanggal_request"
                  value={today}
                />

              </div>

              {/* Status */}
              <input
                type="hidden"
                name="status_approval"
                value="Pending"
              />

              {/* Button */}
              <div className="form-actions">

                <button
                  type="submit"
                  className="btn-brand"
                  disabled={!selectedFile}
                >
                  <i className="fa fa-upload"></i>
                  {" "}Upload Request
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
              <p>Data request pengadaan berhasil disimpan.</p>
              <small>Mengalihkan ke halaman data...</small>
            </div>
          </div>
        </>
      )}

    </div>
  );
}