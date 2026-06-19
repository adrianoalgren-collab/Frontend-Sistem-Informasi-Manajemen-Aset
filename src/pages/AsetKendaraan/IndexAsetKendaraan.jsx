// ======================================================
// === IMPORT
// ======================================================

import { Link, useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { useAsetKendaraanList, formatDate } from "../../hooks/AsetKendaraan/useAsetKendaraanList";
import { useRole } from "../../hooks/useRole";
import { useAuth } from "../../components/AuthContext"; // ← tambah
import api from "../../services/api";

export default function IndexAsetKendaraan() {
  const {
    // List
    currentData, loading, search, setSearch,
    currentPage, setCurrentPage, itemsPerPage, setItemsPerPage,
    filteredData, totalPages, startIndex,

    // Permission
    canTambah, canEdit, canAssign, canHapus, canAksiColumn, canLihatHistory, colCount,

    // Navigation
    navigate,

    // Modal: Hapus
    showModal, openDelete, closeModal, confirmDelete,

    // Modal: Info
    showInfoModal, selectedAset, openInfo, closeInfoModal,

    // Modal: History
    showHistoryModal, history, historyLoading,
    historyKendaraan, historyError,
    openHistory, closeHistoryModal,
  } = useAsetKendaraanList();

  // ======================================================
  // === RENDER
  // ======================================================

  return (
    <div className="page-wrapper">

      {/* ── BREADCRUMB ── */}
      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold">Data Aset Kendaraan</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">Data Aset Kendaraan</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="content-card">

        {/* ── TOOLBAR ── */}
        <div className="toolbar">
          <div className="toolbar-left">
            <span>Tampilkan</span>
            <select
              className="dark-select"
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
            </select>
            <span>data</span>
          </div>
          <div className="toolbar-right">
            <input
              type="text"
              className="dark-input"
              placeholder="Cari kode / nama kendaraan..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
            {canTambah && (
              <button className="btn-brand" onClick={() => navigate("/asetkendaraan/tambah")}>
                <i className="fa fa-plus"></i> Tambah Data
              </button>
            )}
          </div>
        </div>

        {/* ── TABEL ── */}
        <div className="table-wrap">
          <table className="dark-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Kendaraan</th>
                <th>Plat Kendaraan</th>
                <th>Driver</th>
                <th>Info</th>
                {canAksiColumn && <th>Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={colCount} className="table-empty">
                    <i className="fa fa-spinner fa-spin me-2"></i>Memuat data...
                  </td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan={colCount} className="table-empty">Data tidak ditemukan</td>
                </tr>
              ) : (
                currentData.map((row, index) => (
                  <tr key={row.id_kendaraan}>
                    <td>{startIndex + index + 1}</td>
                    <td>{row.nama_kendaraan}</td>
                    <td>{row.plat_kendaraan || "-"}</td>
                    <td>{row.driver?.name || "-"}</td>
                    <td>
                      <div className="action-group">
                        <button
                          className="btn-action btn-info"
                          title="Lihat Informasi"
                          onClick={() => openInfo(row)}
                        >
                          <i className="fa fa-exclamation-circle"></i>
                        </button>
                        {/* Tombol history hanya untuk role yang diizinkan */}
                        {canLihatHistory && (
                          <button
                            className="btn-action btn-history"
                            title="Lihat History"
                            onClick={() => openHistory(row)}
                          >
                            <i className="fa fa-history"></i>
                          </button>
                        )}
                      </div>
                    </td>
                    {canAksiColumn && (
                      <td>
                        <div className="action-group">
                          {canEdit && (
                            <button
                              className="btn-action btn-edit"
                              onClick={() => navigate(`/asetkendaraan/edit/${row.id_kendaraan}`)}
                            >
                              <i className="fa fa-wrench"></i> Edit
                            </button>
                          )}
                          {canAssign && (
                            <button
                              className="btn-action btn-edit"
                              onClick={() => navigate(`/asetkendaraan/assign/${row.id_kendaraan}`)}
                            >
                              <i className="fa fa-user-plus"></i> Assign Driver
                            </button>
                          )}
                          {canHapus && (
                            <button
                              className="btn-action btn-delete"
                              onClick={() => openDelete(row.id_kendaraan)}
                            >
                              <i className="fa fa-trash"></i> Hapus
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION ── */}
        <div className="pagination-bar">
          <small className="pagination-info">
            Menampilkan {currentData.length} dari {filteredData.length} data
            &nbsp;·&nbsp;
            Halaman {currentPage} dari {totalPages}
          </small>
          <div className="pagination-btns">
            <button
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            >&lt;</button>
            <button
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            >&gt;</button>
          </div>
        </div>
      </div>

      {/* Modal-modal tidak berubah — hanya canAksiColumn guard di atas yang relevan */}

      {/* ── MODAL KONFIRMASI HAPUS ── */}
      {showModal && (
        <>
          <div className="modal-overlay" onClick={closeModal} />
          <div className="modal-box">
            <div className="modal-head">
              <span className="modal-title">
                <i className="fa fa-exclamation-triangle me-2 icon-danger"></i>
                Konfirmasi Hapus Data
              </span>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body-content">
              <p>Apakah Anda yakin ingin menghapus data ini?</p>
              <small>Data yang sudah dihapus tidak dapat dikembalikan.</small>
            </div>
            <div className="modal-foot">
              <button className="btn-ghost" onClick={closeModal}>Batal</button>
              <button className="btn-danger" onClick={confirmDelete}>
                <i className="fa fa-trash me-1"></i> Ya, Hapus
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── MODAL INFO KENDARAAN ── */}
      {showInfoModal && selectedAset && (
        <>
          <div className="modal-overlay" onClick={closeInfoModal} />
          <div className="modal-box">
            <div className="modal-head">
              <span className="modal-title">
                <i className="fa fa-info-circle me-2" style={{ color: "#3b82f6" }}></i>
                Informasi Aset Kendaraan
              </span>
              <button className="modal-close" onClick={closeInfoModal}>×</button>
            </div>
            <div className="modal-body-content">
              {[
                { label: "Kode Kendaraan", value: selectedAset.kode_kendaraan },
                { label: "Plat Kendaraan", value: selectedAset.plat_kendaraan },
                { label: "Kondisi",        value: selectedAset.kondisi_kendaraan },
                { label: "Manufacturer",   value: selectedAset.manufacturer?.nama_manufacturer },
                { label: "Driver",         value: selectedAset.driver?.name },
              ].map(({ label, value }) => (
                <div className="form-group" key={label}>
                  <label className="form-label">{label}</label>
                  <div>{value || "-"}</div>
                </div>
              ))}
            </div>
            <div className="modal-foot">
              <button className="btn-ghost" onClick={closeInfoModal}>Tutup</button>
            </div>
          </div>
        </>
      )}

      {/* ── MODAL HISTORY ASSIGNMENT ── */}
      {showHistoryModal && (
        <>
          <div className="modal-overlay" onClick={closeHistoryModal} />
          <div className="modal-box modal-box--wide">
            <div className="modal-head">
              <span className="modal-title">
                <i className="fa fa-history me-2" style={{ color: "var(--brand)" }}></i>
                History Assignment — {historyKendaraan?.nama_kendaraan}
              </span>
              <button className="modal-close" onClick={closeHistoryModal}>×</button>
            </div>
            <div className="modal-body-content modal-body-content--scroll">
              {historyLoading ? (
                <div className="loading-state">
                  <i className="fa fa-spinner fa-spin fa-2x"></i>
                  <p>Memuat history...</p>
                </div>
              ) : historyError ? (
                <div className="staff-empty-state">
                  <i className="fa fa-exclamation-triangle fa-2x icon-danger"></i>
                  <p>Gagal memuat history. Silakan coba lagi.</p>
                </div>
              ) : history.length === 0 ? (
                <div className="staff-empty-state">
                  <i className="fa fa-inbox fa-2x"></i>
                  <p>Belum ada history assignment</p>
                </div>
              ) : (
                <div className="table-wrap table-wrap--flush">
                  <table className="dark-table">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Driver</th>
                        <th>Tanggal Assign</th>
                        <th>Tanggal Selesai</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item, index) => (
                        <tr key={item.id ?? index}>
                          <td>{index + 1}</td>
                          <td>{item.user?.name || "-"}</td>
                          <td>{formatDate(item.tanggal_assign)}</td>
                          <td>{formatDate(item.tanggal_selesai)}</td>
                          <td>
                            {item.tanggal_selesai ? (
                              <span className="status-badge status-Ditolak">Selesai</span>
                            ) : (
                              <span className="status-badge status-Diterima">Aktif</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="modal-foot">
              <button className="btn-ghost" onClick={closeHistoryModal}>Tutup</button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}