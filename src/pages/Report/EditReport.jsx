import { Link, useNavigate } from "react-router-dom";
import { useReportForm, formatSize, getFileIcon } from "../../hooks/Report/useReportForm";
import { useRole } from "../../hooks/useRole";
import { useState } from "react";

export default function EditReport() {

  const navigate  = useNavigate();
  const { isAdmin, userName } = useRole();
  const redirectTo = isAdmin ? "/report" : "/report/staff";

  const {
    form,        handleChange,   updateReport,
    today,       fileInputRef,   selectedFile,
    dragOver,    setDragOver,
    handleDrop,  handleFileInput, removeFile,
    loading,     error,           fileError,
  } = useReportForm();

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateReport();
      setShowSuccess(true);
      setTimeout(() => { setShowSuccess(false); navigate(redirectTo); }, 2000);
    } catch {
      // error sudah di-set di hook — ditampilkan via state error
    }
  };

  return (
    <div className="page-wrapper">

      {/* ── BREADCRUMB ── */}
      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold">Edit Data Report</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to={redirectTo}>Data Report</Link></li>
              <li className="breadcrumb-item active">Edit</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── ERROR STATE ── */}
      {error && (
        <div className="alert alert-danger mb-3">
          <i className="fa fa-exclamation-circle me-2"></i>{error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="upload-layout">

          {/* ── KIRI: Drop Zone ── */}
          <div className="upload-left">
            <div
              className={`drop-zone ${dragOver ? "drag-active" : ""} ${selectedFile ? "has-file" : ""}`}
              onClick={() => !selectedFile && fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                name="file"
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
                  <p className="drop-title">Drag & drop file baru ke sini</p>
                  <p className="drop-sub">atau klik untuk pilih file</p>
                  <div className="drop-formats">
                    <span>PDF</span><span>DOC</span><span>DOCX</span>
                  </div>
                  <p className="drop-limit">Opsional · Kosongkan jika tidak ingin ganti file</p>
                </div>
              ) : (
                <div className="drop-preview">
                  <div className="file-icon-wrap">
                    <i className={`fa ${getFileIcon(selectedFile.name)} file-icon`}></i>
                  </div>
                  <p className="file-name">{selectedFile.name}</p>
                  <p className="file-size">{formatSize(selectedFile.size)}</p>
                  <div className="file-ready">
                    <i className="fa fa-check-circle me-1"></i> Siap diupload
                  </div>
                  <button type="button" className="file-remove"
                    onClick={(e) => { e.stopPropagation(); removeFile(); }}>
                    <i className="fa fa-times me-1"></i> Ganti file
                  </button>
                </div>
              )}
            </div>

            {/* Error validasi file */}
            {fileError && (
              <p className="text-danger mt-2">
                <i className="fa fa-exclamation-circle me-1"></i>{fileError}
              </p>
            )}
          </div>

          {/* ── KANAN: Detail ── */}
          <div className="upload-right">
            <div className="content-card upload-detail-card">

              <h6 className="upload-detail-title">
                <i className="fa fa-info-circle me-2 icon-brand"></i>
                Detail Report
              </h6>

              {/* Judul */}
              <div className="form-group">
                <label className="form-label">Judul Report</label>
                <input
                  type="text"
                  name="judul"
                  className="dark-input"
                  style={{ width: "100%" }}
                  value={form.judul}
                  onChange={handleChange}
                  placeholder="Masukkan judul report"
                  required
                />
              </div>

              {/* Tanggal */}
              <div className="form-group">
                <label className="form-label">Tanggal Report</label>
                <input
                  type="date"
                  name="tanggal"
                  className="dark-input"
                  style={{ width: "100%" }}
                  value={form.tanggal}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Ditambahkan Oleh — display only */}
              <div className="form-group">
                <label className="form-label">Ditambahkan Oleh</label>
                <span className="form-info">
                  <i className="fa fa-user me-2 icon-brand"></i>
                  {userName || "–"}
                </span>
              </div>

              {/* Status — hanya admin yang bisa ubah */}
              {isAdmin ? (
                <div className="form-group">
                  <label className="form-label">Status Report</label>
                  <select
                    name="status"
                    className="dark-input"
                    style={{ width: "100%" }}
                    value={form.status || "pending"}
                    onChange={handleChange}
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="disetujui">Disetujui</option>
                    <option value="ditolak">Ditolak</option>
                  </select>
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Status Report</label>
                  <span className={`status-badge status-${form.status}`}>
                    {form.status || "pending"}
                  </span>
                </div>
              )}

              {/* Tombol aksi */}
              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-brand"
                  disabled={!!fileError || loading}
                >
                  <i className={`fa ${loading ? "fa-spinner fa-spin" : "fa-save"}`}></i>
                  {loading ? " Menyimpan..." : " Simpan Perubahan"}
                </button>
                <Link to={redirectTo} className="btn-action btn-edit">Batal</Link>
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
              <p>Data report berhasil diperbarui.</p>
              <small>Mengalihkan ke halaman data...</small>
            </div>
          </div>
        </>
      )}

    </div>
  );
}