// ======================================================
// === IMPORT
// ======================================================

import { Link, useNavigate } from "react-router-dom";
import { useRequestPengadaanList } from "../../hooks/RequestPengadaan/useRequestPengadaanList";
import { useRole } from "../../hooks/useRole";
import { useState } from "react";

// ======================================================
// === KOMPONEN UTAMA — Portal Pengajuan Staff
// ======================================================

export default function IndexRequestPengadaanStaff() {

  const { sortedData, loading, handleDelete } = useRequestPengadaanList();
  const navigate = useNavigate();
  const { userId } = useRole();

  // ======================================================
  // === FILTER DATA USER LOGIN
  // ======================================================

  const myRequests = sortedData.filter(
    (row) => row.user?.id === userId || row.id_user === userId
  );

  // ======================================================
  // === UI STATE
  // ======================================================

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // ======================================================
  // === SUMMARY STATUS
  // ======================================================

  const totalPending = myRequests.filter(
    (r) => r.status_approval === "Pending"
  ).length;

  const totalApproved = myRequests.filter(
    (r) => r.status_approval === "Approved"
  ).length;

  const totalRejected = myRequests.filter(
    (r) => r.status_approval === "Rejected"
  ).length;

  // ======================================================
  // === HELPER STATUS
  // ======================================================

  const statusClass = (status) =>
    status === "Approved"
      ? "diterima"
      : status === "Rejected"
      ? "ditolak"
      : "pending";

  const statusIcon = (status) =>
    status === "Approved"
      ? "fa-check-circle"
      : status === "Rejected"
      ? "fa-times-circle"
      : "fa-clock";

  // ======================================================
  // === RENDER
  // ======================================================

  return (
    <div className="page-wrapper">

      {/* ── BREADCRUMB ── */}
      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold">
            Request Pengadaan
          </h4>

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>

              <li className="breadcrumb-item active">
                Request Pengadaan
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── SUMMARY CARDS ── */}
      <div className="staff-summary-grid">

        <div className="staff-summary-card">
          <div className="staff-summary-icon pending">
            <i className="fa fa-clock"></i>
          </div>

          <div>
            <p className="staff-summary-label">
              Menunggu
            </p>
            <p className="staff-summary-value">
              {totalPending}
            </p>
          </div>
        </div>

        <div className="staff-summary-card">
          <div className="staff-summary-icon diterima">
            <i className="fa fa-check-circle"></i>
          </div>

          <div>
            <p className="staff-summary-label">
              Approved
            </p>
            <p className="staff-summary-value">
              {totalApproved}
            </p>
          </div>
        </div>

        <div className="staff-summary-card">
          <div className="staff-summary-icon ditolak">
            <i className="fa fa-times-circle"></i>
          </div>

          <div>
            <p className="staff-summary-label">
              Rejected
            </p>
            <p className="staff-summary-value">
              {totalRejected}
            </p>
          </div>
        </div>

      </div>

      {/* ── TOMBOL AJUKAN REQUEST ── */}
      <div className="content-card mb-16">
        <div className="request-action-card">

          <div>
            <h6 className="request-action-title">
              <i className="fa fa-plus-circle me-2"></i>
              Buat Request Baru
            </h6>

            <p className="request-action-subtitle">
              Ajukan request pengadaan kepada Manager
            </p>
          </div>

          <button
            className="btn-brand"
            onClick={() => navigate("/request/pengadaan/tambah")}
          >
            <i className="fa fa-plus"></i>
            {" "}Ajukan Request
          </button>

        </div>
      </div>

      {/* ── RIWAYAT REQUEST ── */}
      <div className="content-card">

        <h6 className="section-title">
          <i className="fa fa-history me-2"></i>
          Riwayat Pengajuan Saya
        </h6>

        {loading ? (
          <div className="loading-state">
            <i className="fa fa-spinner fa-spin fa-2x"></i>
            <p>Memuat data...</p>
          </div>
        ) : myRequests.length === 0 ? (
          <div className="staff-empty-state">
            <i className="fa fa-inbox fa-3x"></i>
            <p>Belum ada request</p>
            <small>
              Klik "Ajukan Request" di atas untuk membuat pengajuan baru.
            </small>
          </div>
        ) : (
          <div className="request-list">

            {myRequests.map((row) => (
              <div
                key={row.id_request_pengadaan}
                className="request-item"
              >

                {/* Icon Status */}
                <div className={`request-item-icon ${statusClass(row.status_approval)}`}>
                  <i className={`fa ${statusIcon(row.status_approval)}`}></i>
                </div>

                {/* Info */}
                <div className="request-item-info">
                  <p className="request-item-title">
                    {row.nama_pengadaan || "-"}
                  </p>

                  <p className="request-item-meta">
                    <i className="fa fa-tag me-1"></i>
                    {row.kategori_pengadaan || "-"}
                    &nbsp;·&nbsp;

                    <i className="fa fa-calendar me-1"></i>
                    {row.tanggal_request
                      ? new Date(row.tanggal_request).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "-"}
                  </p>
                </div>

                {/* Badge */}
                <span className={`status-badge status-${statusClass(row.status_approval)}`}>
                  {row.status_approval || "Pending"}
                </span>

                {/* Action */}
                <div className="request-item-actions">

                  {row.file_request_url && (
                    <a
                      href={row.file_request_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-action btn-edit no-underline"
                    >
                      <i className="fa fa-file-alt"></i>
                    </a>
                  )}

                  <button
                    className="btn-action btn-delete"
                    onClick={() => {
                      setSelectedId(row.id_request_pengadaan);
                      setShowModal(true);
                    }}
                  >
                    <i className="fa fa-trash"></i>
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}
      </div>

      {/* ── MODAL DELETE ── */}
      {showModal && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setShowModal(false)}
          />

          <div className="modal-box">

            <div className="modal-head">
              <span className="modal-title">
                <i className="fa fa-exclamation-triangle me-2 icon-danger"></i>
                Konfirmasi Hapus
              </span>

              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body-content">
              <p>
                Apakah Anda yakin ingin menghapus request ini?
              </p>

              <small>
                Data yang sudah dihapus tidak dapat dikembalikan.
              </small>
            </div>

            <div className="modal-foot">
              <button
                className="btn-ghost"
                onClick={() => setShowModal(false)}
              >
                Batal
              </button>

              <button
                className="btn-danger"
                onClick={() => {
                  handleDelete(selectedId);
                  setShowModal(false);
                }}
              >
                <i className="fa fa-trash me-1"></i>
                Ya, Hapus
              </button>
            </div>

          </div>
        </>
      )}

    </div>
  );
}