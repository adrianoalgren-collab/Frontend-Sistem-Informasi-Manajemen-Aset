// ======================================================
// === IMPORT
// ======================================================

import { Link, useNavigate } from "react-router-dom";
import { useRequestPerbaikanList } from "../../hooks/RequestPerbaikan/useRequestPerbaikanList";
import { useState } from "react";
import SortableTh from "../../components/SortableTh";

// ======================================================
// === KOMPONEN UTAMA
// ======================================================

export default function IndexRequestPerbaikan() {

  const {
    loading, search, setSearch,
    currentPage, setCurrentPage, itemsPerPage, setItemsPerPage,
    handleDelete, sortedData, sortBy, setSortBy, sortDir, setSortDir,
  } = useRequestPerbaikanList();

  const navigate = useNavigate();

  // Status value disesuaikan dengan enum DB: Pending | Diterima | Ditolak
  const [activeTab,  setActiveTab]  = useState("Pending");
  const [showModal,  setShowModal]  = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // ── Filter data berdasarkan tab aktif ──
  const tabData = sortedData.filter(row => row.status_request === activeTab);

  // ── Hitung jumlah per tab untuk badge ──
  const countPending  = sortedData.filter(r => r.status_request === "Pending").length;
  const countDiterima = sortedData.filter(r => r.status_request === "Diterima").length;
  const countDitolak  = sortedData.filter(r => r.status_request === "Ditolak").length;

  // ── Pagination lokal per tab ──
  const start         = (currentPage - 1) * itemsPerPage;
  const currentData   = tabData.slice(start, start + itemsPerPage);
  const totalTabPages = Math.max(1, Math.ceil(tabData.length / itemsPerPage));

  // Reset ke halaman 1 saat ganti tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };


  // ======================================================
  // === RENDER
  // ======================================================

  return (
    <div className="page-wrapper">

      {/* ── BREADCRUMB ── */}
      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold">Data Request Perbaikan</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">Request Perbaikan</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="content-card">

        {/* ── TOOLBAR ── */}
        <div className="toolbar">
          <div className="toolbar-left">
            <span>Tampilkan</span>
            <select className="dark-select" value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
            </select>
            <span>data</span>
          </div>
          <div className="toolbar-right">
            <input type="text" className="dark-input" placeholder="Cari nama aset / staff..."
              value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
            <button className="btn-brand" onClick={() => navigate("/request/perbaikan/tambah")}>
              <i className="fa fa-plus"></i> Tambah Request
            </button>
          </div>
        </div>

        {/* ── TAB NAVIGATION ── */}
        <div className="tab-nav">
          <button className={`tab-btn ${activeTab === "Pending" ? "active" : ""}`}
            onClick={() => handleTabChange("Pending")}>
            <i className="fa fa-clock"></i> Pending
            <span className="tab-count">{countPending}</span>
          </button>
          <button className={`tab-btn ${activeTab === "Diterima" ? "active" : ""}`}
            onClick={() => handleTabChange("Diterima")}>
            <i className="fa fa-check-circle"></i> Diterima
            <span className="tab-count">{countDiterima}</span>
          </button>
          <button className={`tab-btn ${activeTab === "Ditolak" ? "active" : ""}`}
            onClick={() => handleTabChange("Ditolak")}>
            <i className="fa fa-times-circle"></i> Ditolak
            <span className="tab-count">{countDitolak}</span>
          </button>
        </div>

        {/* ── TABEL ── */}
        <div className="table-wrap">
          <table className="dark-table">
            <thead>
              <tr>
                <th>No</th>
                <SortableTh label="Aset"            field="aset"            sortBy={sortBy} sortDir={sortDir} setSortBy={setSortBy} setSortDir={setSortDir} />
                <SortableTh label="Kode Barang"     field="kode_barang"     sortBy={sortBy} sortDir={sortDir} setSortBy={setSortBy} setSortDir={setSortDir} />
                <SortableTh label="Staff"           field="staff"           sortBy={sortBy} sortDir={sortDir} setSortBy={setSortBy} setSortDir={setSortDir} />
                <SortableTh label="Tanggal Request" field="tanggal_request" sortBy={sortBy} sortDir={sortDir} setSortBy={setSortBy} setSortDir={setSortDir} />
                <SortableTh label="Status"          field="status_request"  sortBy={sortBy} sortDir={sortDir} setSortBy={setSortBy} setSortDir={setSortDir} />
                <th>File Request</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="table-empty">Memuat data...</td></tr>
              ) : currentData.length === 0 ? (
                <tr><td colSpan="8" className="table-empty">Tidak ada data {activeTab}</td></tr>
              ) : (
                currentData.map((row, index) => (
                  // Gunakan id_request_perbaikan sesuai primary key di migration
                  <tr key={row.id_request_perbaikan}>
                    <td>{start + index + 1}</td>
                    <td>{row.aset?.nama_asetoperasional ?? "-"}</td>
                    <td>{row.kode_barang?.kode_barang ?? "-"}</td>
                    <td>{row.user?.name ?? "-"}</td>
                    <td>{row.tanggal_request?.split(" ")[0] ?? "-"}</td>
                    <td>
                      <span className={`status-badge status-${row.status_request.toLowerCase()}`}>
                        {row.status_request}
                      </span>
                    </td>
                    <td>
                      {row.file_request_url ? (
                        <a
                          href={row.file_request_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-action btn-edit no-underline"
                        >
                          <i className="fa fa-file-alt"></i> Lihat
                        </a>
                      ) : "-"}
                    </td>
                    <td>
                      <div className="action-group">
                        <button className="btn-action btn-edit"
                          onClick={() => navigate(`/request/perbaikan/edit/${row.id_request_perbaikan}`)}>
                          <i className="fa fa-wrench"></i> Edit
                        </button>
                        <button className="btn-action btn-delete"
                          onClick={() => { setSelectedId(row.id_request_perbaikan); setShowModal(true); }}>
                          <i className="fa fa-trash"></i> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION ── */}
        <div className="pagination-bar">
          <small className="pagination-info">
            Menampilkan {currentData.length} dari {tabData.length} data &nbsp;·&nbsp; Halaman {currentPage} dari {totalTabPages}
          </small>
          <div className="pagination-btns">
            <button className="page-btn" disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>&lt;</button>
            <button className="page-btn" disabled={currentPage === totalTabPages}
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalTabPages))}>&gt;</button>
          </div>
        </div>

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
              <p>Apakah Anda yakin ingin menghapus request perbaikan ini?</p>
              <small>Data yang sudah dihapus tidak dapat dikembalikan.</small>
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