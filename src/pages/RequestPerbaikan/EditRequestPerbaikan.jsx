// ======================================================
// === IMPORT
// ======================================================
import { Link, useNavigate } from "react-router-dom";
import { useRequestPerbaikanForm } from "../../hooks/RequestPerbaikan/useRequestPerbaikanForm";
import { useState } from "react";

// ======================================================
// === COMPONENT UTAMA
// ======================================================
export default function EditRequestPerbaikan() {

  const navigate = useNavigate();

  const {
    form,
    handleChange,
    updateRequestPerbaikan,
    id,
    detail,
  } = useRequestPerbaikanForm();

  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // ======================================================
  // === HANDLE SUBMIT
  // ======================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await updateRequestPerbaikan(id);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/request/perbaikan");
      }, 2000);
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui request perbaikan");
    } finally {
      setSubmitting(false);
    }
  };

  // ======================================================
  // === RENDER
  // ======================================================
  return (
    <div className="page-wrapper">

      {/* ── BREADCRUMB ── */}
      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold">Edit Request Perbaikan</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item">
                <Link to="/request/perbaikan">Data Request Perbaikan</Link>
              </li>
              <li className="breadcrumb-item active">Edit</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── LAYOUT 2 KOLOM ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "start" }}>

        {/* ══ KIRI: INFO READONLY ══ */}
        <div className="content-card">

          <p className="section-title">
            <i className="fa fa-info-circle me-2"></i>
            Informasi Request
          </p>

          <div className="form-group">
            <label className="form-label">Aset Operasional</label>
            <div className="form-info">{detail?.aset?.nama_asetoperasional || "—"}</div>
          </div>

          <div className="form-group">
            <label className="form-label">Kode Barang</label>
            <div className="form-info">{detail?.kode_barang?.kode_barang || "—"}</div>
          </div>

          <div className="form-group">
            <label className="form-label">Kondisi Aset</label>
            <div className="form-info">{detail?.kode_barang?.kondisi_asetoperasional || "—"}</div>
          </div>

          <div className="form-group">
            <label className="form-label">Staff Pengaju</label>
            <div className="form-info">{detail?.user?.name || "—"}</div>
          </div>

          <div className="form-group">
            <label className="form-label">Tanggal Request</label>
            <div className="form-info">{detail?.tanggal_request?.split(" ")[0] || "—"}</div>
          </div>

          <div className="form-group">
            <label className="form-label">Status Saat Ini</label>
            <div>
              <span className={`status-badge status-${form.status_request}`}>
                {form.status_request}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">File Request</label>
            {detail?.file_request_url ? (
              <a
                href={detail.file_request_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-action btn-edit"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <i className="fa fa-external-link-alt"></i> Lihat File
              </a>
            ) : (
              <div className="form-info">—</div>
            )}
          </div>

        </div>

        {/* ══ KANAN: FORM EDIT ══ */}
        <div className="content-card">

          <p className="section-title">
            <i className="fa fa-edit me-2"></i>
            Ubah Status & Catatan
          </p>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label className="form-label">Status Request</label>
              <select
                name="status_request"
                className="dark-select"
                style={{ width: "100%" }}
                value={form.status_request}
                onChange={handleChange}
                disabled={submitting}
                required
              >
                <option value="Pending">Pending</option>
                <option value="Diterima">Diterima</option>
                <option value="Ditolak">Ditolak</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Catatan Admin
                <span className="form-hint">(opsional)</span>
              </label>
              <textarea
                name="catatan_admin"
                className="dark-input"
                style={{ width: "100%", resize: "vertical", minHeight: "120px" }}
                value={form.catatan_admin ?? ""}
                onChange={handleChange}
                placeholder="Tulis catatan untuk staff pengaju..."
                disabled={submitting}
                rows={5}
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-brand"
                disabled={submitting}
              >
                <i className={`fa ${submitting ? "fa-spinner fa-spin" : "fa-save"}`}></i>
                {submitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
              <Link to="/request/perbaikan" className="btn-action btn-edit">
                Batal
              </Link>
            </div>

          </form>
        </div>

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
              <p>Request perbaikan berhasil diperbarui.</p>
              <small>Mengalihkan ke halaman data...</small>
            </div>
          </div>
        </>
      )}

    </div>
  );
}