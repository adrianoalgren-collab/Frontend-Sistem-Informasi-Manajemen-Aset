// ======================================================
// === IMPORT
// ======================================================

import { Link, useNavigate } from "react-router-dom";
import { useRequestPemakaianForm } from "../../hooks/RequestPemakaian/useRequestPemakaianForm";
import { useRole } from "../../hooks/useRole";
import { useState } from "react";

// ======================================================
// === KOMPONEN UTAMA
// ======================================================

export default function AddRequestPemakaian() {

  const navigate = useNavigate();
 
  const {
    userId,
    userName,
    departmentId,
    departmentName,
    isAdmin
  } = useRole();

   const redirectTo = isAdmin
    ? "/request/pemakaian"
    : "/request/pemakaian/staff";


  const {
    form,
    handleChange,
    storeRequestPemakaian,
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
    daftarBarangPakai,
    loadingBarangPakai,
  } = useRequestPemakaianForm({
    defaultValues: {
      status_approval: "Pending",
      id_user: userId,
      id_department: departmentId,
    },
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    storeRequestPemakaian()
      .then(() => {

        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
          navigate(redirectTo);
        }, 2000);

      })
      .catch(() => {
        alert("Gagal menyimpan request pemakaian");
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
            Tambah Request Pemakaian
          </h4>

          <nav aria-label="breadcrumb">

            <ol className="breadcrumb mb-0">

              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>

              <li className="breadcrumb-item">
                <Link to="/request/pemakaian">
                  Data Request Pemakaian
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
                Detail Request Pemakaian
              </h6>

              {/* Pilih Barang */}
              <div className="form-group">

                <label className="form-label">
                  Pilih Barang
                </label>

                <select
                  name="id_barang_pakai"
                  className="dark-input"
                  value={form.id_barang_pakai || ""}
                  onChange={handleChange}
                  required
                  disabled={loadingBarangPakai}
                >
                  <option value="">
                    {loadingBarangPakai
                      ? "Memuat daftar barang..."
                      : "-- Pilih Barang --"}
                  </option>

                  {daftarBarangPakai.map((barang) => (
                    <option
                      key={barang.id_barang_pakai}
                      value={barang.id_barang_pakai}
                    >
                      {barang.nama_asetbarangpakai} (Stok: {barang.stok_asetbarangpakai} {barang.satuan_asetbarangpakai})
                    </option>
                  ))}
                </select>

              </div>

              {/* Jumlah Pemakaian */}
              <div className="form-group">

                <label className="form-label">
                  Jumlah Pemakaian
                </label>

                <input
                  type="number"
                  name="jumlah_pemakaian"
                  className="dark-input"
                  placeholder="Contoh: 5"
                  min="1"
                  value={form.jumlah_pemakaian || ""}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* Keterangan Pemakaian */}
              <div className="form-group">

                <label className="form-label">
                  Keterangan Pemakaian
                </label>

                <textarea
                  name="keterangan_pemakaian"
                  className="dark-input"
                  placeholder="Contoh: Untuk kebutuhan rapat divisi Marketing"
                  value={form.keterangan_pemakaian || ""}
                  onChange={handleChange}
                  rows={4}
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
                  to="/request/pemakaian"
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
              <p>Data request pemakaian berhasil disimpan.</p>
              <small>Mengalihkan ke halaman data...</small>
            </div>
          </div>
        </>
      )}

    </div>
  );
}