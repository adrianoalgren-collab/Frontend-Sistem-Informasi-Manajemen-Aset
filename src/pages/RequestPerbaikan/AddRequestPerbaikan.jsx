// ======================================================
// === IMPORT
// ======================================================

import { Link, useNavigate } from "react-router-dom";
import { useRequestPerbaikanForm } from "../../hooks/RequestPerbaikan/useRequestPerbaikanForm";
import { useRole } from "../../hooks/useRole";
import { useState } from "react";
import { Modal } from "bootstrap";

// ======================================================
// === KOMPONEN UTAMA
// ======================================================

export default function AddRequestPerbaikan() {

  const navigate = useNavigate();
  const { userId, userName, isAdmin } = useRole();

  const redirectTo = isAdmin
    ? "/request/perbaikan"
    : "/request/perbaikan/staff";

  const {
    form,
    handleChange,
    storeRequestPerbaikan,
    fileInputRef,
    selectedFile,
    dragOver,
    setDragOver,
    handleDrop,
    handleFileInput,
    removeFile,
    formatSize,
    getFileIcon,
    asetList,
    kodeList,
  } = useRequestPerbaikanForm({
    defaultValues: {
      status_request: "Pending",
      id_user: userId,       // ← disesuaikan: staff_id → id_user
    },
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError,   setShowError]   = useState(false);

  // Form valid jika file, aset, dan kode unit sudah dipilih
  // Gunakan nama field sesuai hook: id_operasional & id_kodebarang
  const isFormValid = selectedFile && form.id_operasional && form.id_kodebarang;

  const handleSubmit = (e) => {
    e.preventDefault();

    storeRequestPerbaikan()
      .then(() => {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate(redirectTo);
        }, 2000);
      })
      .catch(() => {
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
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
          <h4 className="mb-0 fw-bold">Tambah Request Perbaikan</h4>

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item">
                <Link to={redirectTo}>Data Request Perbaikan</Link>
              </li>
              <li className="breadcrumb-item active">Tambah</li>
            </ol>
          </nav>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="upload-layout">

          {/* ── KIRI: UPLOAD FILE ── */}
          <div className="upload-left">

            <div
              className={`drop-zone ${dragOver ? "drag-active" : ""} ${selectedFile ? "has-file" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
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

          {/* ── KANAN: DETAIL FORM ── */}
          <div className="upload-right">
            <div className="content-card upload-detail-card">

              <h6 className="upload-detail-title">
                <i className="fa fa-info-circle me-2 icon-brand"></i>
                Detail Request Perbaikan
              </h6>

              {/* ── ASET OPERASIONAL ── */}
              <div className="form-group">
                <label className="form-label">Aset Operasional</label>
                <select
                  name="id_operasional"          
                  className="dark-input"
                  style={{ width: "100%" }}
                  value={form.id_operasional}   
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Pilih Aset Operasional --</option>
                  {asetList.map((aset) => (
                    <option
                      key={aset.id_operasional}
                      value={aset.id_operasional}
                    >
                      {aset.nama_asetoperasional}
                    </option>
                  ))}
                </select>
              </div>

              {/* ── KODE ASET (aktif, filter per aset dipilih) ── */}
              <div className="form-group">
                <label className="form-label">Kode Aset</label>
                <select
                  name="id_kodebarang"           
                  className="dark-input"
                  style={{ width: "100%" }}
                  value={form.id_kodebarang}     
                  onChange={handleChange}
                  disabled={!form.id_operasional} 
                  required
                >
                  <option value="">
                    {form.id_operasional
                      ? "-- Pilih Kode Aset --"
                      : "-- Pilih Aset Terlebih Dahulu --"}
                  </option>
                  {kodeList.map((unit) => (
                    <option
                      key={unit.id_kodebarang}
                      value={unit.id_kodebarang}
                    >
                      {unit.kode_barang} — {unit.kondisi_asetoperasional}
                    </option>
                  ))}
                </select>
              </div>

              {/* ── STAFF ── */}
              <div className="form-group">
                <label>Ditambahkan Oleh</label>
                <span>{userName}</span>
                <input
                  type="hidden"
                  name="id_user"                 
                  value={userId ?? ""}
                />
              </div>

              {/* ── TOMBOL ── */}
              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-brand"
                  disabled={!isFormValid}
                  title={
                    !selectedFile
                      ? "Upload file terlebih dahulu"
                      : !form.id_operasional
                      ? "Pilih aset terlebih dahulu"
                      : !form.id_kodebarang
                      ? "Pilih kode aset terlebih dahulu"
                      : ""
                  }
                >
                  Upload
                </button>

                <Link to={redirectTo} className="btn-action btn-edit">
                  Batal
                </Link>
              </div>

              {/* Hint saat tombol disabled */}
              {!isFormValid && (
                <p style={{ fontSize: "12px", color: "var(--color-text-secondary)", marginTop: "6px" }}>
                  {!selectedFile
                    ? "⚠ Upload file terlebih dahulu"
                    : !form.id_operasional
                    ? "⚠ Pilih aset operasional"
                    : "⚠ Pilih kode aset"}
                </p>
              )}

            </div>
          </div>

        </div>
      </form>

      {/* ── SUCCESS MODAL ── */}
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
              <p>Data report berhasil disimpan.</p>
              <small>Mengalihkan ke halaman data...</small>
            </div>
          </div>
        </>
      )}

      {/* ── ERROR MODAL ── */}
      {showError && (
        <>
          <div className="modal-overlay" />
          <div className="modal-box">
            <div className="modal-body-content text-center">
              <i className="fa fa-times-circle fa-3x text-danger"></i>
              <p>Gagal menyimpan data.<br />Silakan coba lagi.</p>
            </div>
          </div>
        </>
      )}

    </div>
  );
}