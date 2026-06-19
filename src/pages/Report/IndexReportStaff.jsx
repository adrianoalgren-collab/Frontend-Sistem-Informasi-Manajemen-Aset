import { Link, useNavigate } from "react-router-dom";
import { useReportList } from "../../hooks/Report/useReportList";
import { useState } from "react";

export default function IndexReportStaff() {

  const { currentData, loading, error, handleDelete } = useReportList();
  const navigate = useNavigate();

  const [showModal,  setShowModal]  = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Hitung ringkasan status dari data yang sudah difilter backend
  const totalPending   = currentData.filter(r => r.status === "pending").length;
  const totalDisetujui = currentData.filter(r => r.status === "disetujui").length;
  const totalDitolak   = currentData.filter(r => r.status === "ditolak").length;

  const statusClass = (status) => {
    if (status === "disetujui") return "diterima";
    if (status === "ditolak")   return "ditolak";
    return "pending";
  };

  const statusIcon = (status) => {
    if (status === "disetujui") return "fa-check-circle";
    if (status === "ditolak")   return "fa-times-circle";
    return "fa-clock";
  };

  return (
    <div className="page-wrapper">

      {/* ── BREADCRUMB ── */}
      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold">Pengajuan Laporan</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">Pengajuan Laporan</li>
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

      {/* ── SUMMARY CARDS ── */}
      <div className="staff-summary-grid">
        <div className="staff-summary-card">
          <div className="staff-summary-icon pending">
            <i className="fa fa-clock"></i>
          </div>
          <div>
            <p className="staff-summary-label">Menunggu</p>
            <p className="staff-summary-value">{totalPending}</p>
          </div>
        </div>
        <div className="staff-summary-card">
          <div className="staff-summary-icon diterima">
            <i className="fa fa-check-circle"></i>
          </div>
          <div>
            <p className="staff-summary-label">Disetujui</p>
            <p className="staff-summary-value">{totalDisetujui}</p>
          </div>
        </div>
        <div className="staff-summary-card">
          <div className="staff-summary-icon ditolak">
            <i className="fa fa-times-circle"></i>
          </div>
          <div>
            <p className="staff-summary-label">Ditolak</p>
            <p className="staff-summary-value">{totalDitolak}</p>
          </div>
        </div>
      </div>

      {/* ── TOMBOL AJUKAN LAPORAN ── */}
      <div className="content-card mb-16">
        <div className="request-action-card">
          <div>
            <h6 className="request-action-title">
              <i className="fa fa-plus-circle me-2"></i>
              Buat Laporan Baru
            </h6>
            <p className="request-action-subtitle">
              Upload laporan untuk disetujui oleh admin
            </p>
          </div>
          <button className="btn-brand" onClick={() => navigate("/report/tambah")}>
            <i className="fa fa-plus"></i> Ajukan Laporan
          </button>
        </div>
      </div>

      {/* ── RIWAYAT LAPORAN ── */}
      <div className="content-card">
        <h6 className="section-title">
          <i className="fa fa-history me-2"></i>
          Riwayat Laporan Saya
        </h6>

        {loading ? (
          <div className="loading-state">
            <i className="fa fa-spinner fa-spin fa-2x"></i>
            <p>Memuat data...</p>
          </div>
        ) : currentData.length === 0 ? (
          <div className="staff-empty-state">
            <i className="fa fa-inbox fa-3x"></i>
            <p>Belum ada laporan</p>
            <small>Klik "Ajukan Laporan" di atas untuk membuat laporan baru.</small>
          </div>
        ) : (
          <div className="request-list">
            {currentData.map((row) => (
              <div key={row.id_report} className="request-item">

                {/* Ikon status */}
                <div className={`request-item-icon ${statusClass(row.status)}`}>
                  <i className={`fa ${statusIcon(row.status)}`}></i>
                </div>

                {/* Info laporan */}
                <div className="request-item-info">
                  <p className="request-item-title">{row.judul || "-"}</p>
                  <p className="request-item-meta">
                    <i className="fa fa-calendar me-1"></i>
                    {row.tanggal
                      ? new Date(row.tanggal).toLocaleDateString("id-ID", {
                          day: "numeric", month: "long", year: "numeric"
                        })
                      : "-"}
                  </p>
                </div>

                {/* Badge status */}
                <span className={`status-badge status-${row.status}`}>
                  {row.status ?? "pending"}
                </span>

                {/* Aksi */}
                <div className="request-item-actions">
                  {row.file_url && (
                    <a href={row.file_url} target="_blank" rel="noopener noreferrer"
                      className="btn-action btn-edit no-underline">
                      <i className="fa fa-file-alt"></i>
                    </a>
                  )}
                  <button className="btn-action btn-delete"
                    onClick={() => { setSelectedId(row.id_report); setShowModal(true); }}>
                    <i className="fa fa-trash"></i>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── MODAL KONFIRMASI HAPUS ── */}
      {showModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowModal(false)} />
          <div className="modal-box">
            <div className="modal-head">
              <span className="modal-title">
                <i className="fa fa-exclamation-triangle me-2 icon-danger"></i>
                Konfirmasi Hapus
              </span>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body-content">
              <p>Apakah Anda yakin ingin menghapus laporan ini?</p>
              <small>Laporan akan diarsipkan dan dapat dipulihkan oleh admin.</small>
            </div>
            <div className="modal-foot">
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Batal</button>
              <button className="btn-danger"
                onClick={() => { handleDelete(selectedId); setShowModal(false); }}>
                <i className="fa fa-trash me-1"></i> Ya, Hapus
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}