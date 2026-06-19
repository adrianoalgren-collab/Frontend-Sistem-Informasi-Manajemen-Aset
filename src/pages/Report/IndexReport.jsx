import { Link, useNavigate } from "react-router-dom";
import { useReportList } from "../../hooks/Report/useReportList";
import { useState } from "react";

export default function IndexReport() {

  const {
    loading, error,
    search,       setSearch,
    currentPage,  setCurrentPage,
    itemsPerPage, setItemsPerPage,
    totalPages,
    currentData,
    sortBy,       setSortBy,
    sortDir,      setSortDir,
    handleDelete,
  } = useReportList();

  const navigate = useNavigate();

  const [activeTab,  setActiveTab]  = useState("pending");
  const [showModal,  setShowModal]  = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Filter tab dari currentData yang sudah dipaginasi hook
  const tabData = currentData.filter(row => row.status === activeTab);

  // Badge count dari currentData
  const countPending   = currentData.filter(r => r.status === "pending").length;
  const countDisetujui = currentData.filter(r => r.status === "disetujui").length;
  const countDitolak   = currentData.filter(r => r.status === "ditolak").length;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // ── Konfirmasi hapus dari modal (tanpa window.confirm di hook) ──
  const confirmDelete = () => {
    handleDelete(selectedId);
    setShowModal(false);
  };

  return (
    <div className="page-wrapper">

      {/* ── BREADCRUMB ── */}
      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold">Data Report</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">Data Report</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="content-card">

        {/* ── ERROR STATE ── */}
        {error && (
          <div className="alert alert-danger mb-3">
            <i className="fa fa-exclamation-circle me-2"></i>{error}
          </div>
        )}

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
            <input type="text" className="dark-input"
              placeholder="Cari judul / tanggal / status..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
            <button className="btn-brand" onClick={() => navigate("/report/tambah")}>
              <i className="fa fa-plus"></i> Tambah Report
            </button>
          </div>
        </div>

        {/* ── TAB NAVIGATION ── */}
        <div className="tab-nav">
          {[
            { key: "pending",   label: "Pending",   icon: "fa-clock",        count: countPending   },
            { key: "disetujui", label: "Disetujui", icon: "fa-check-circle", count: countDisetujui },
            { key: "ditolak",   label: "Ditolak",   icon: "fa-times-circle", count: countDitolak   },
          ].map(tab => (
            <button key={tab.key}
              className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => handleTabChange(tab.key)}>
              <i className={`fa ${tab.icon}`}></i> {tab.label}
              <span className="tab-count">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* ── TABEL ── */}
        <div className="table-wrap">
          <table className="dark-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Judul Report</th>
                <th>Tanggal</th>
                <th>File</th>
                <th>Ditambahkan Oleh</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="table-empty">Memuat data...</td></tr>
              ) : tabData.length === 0 ? (
                <tr><td colSpan="7" className="table-empty">Tidak ada data {activeTab}</td></tr>
              ) : (
                tabData.map((row) => (
                  <tr key={row.id_report}>
                    <td>{row.no}</td>
                    <td>{row.judul}</td>
                    <td>{row.tanggal}</td>
                    <td>
                      {row.file_url ? (
                        <a href={row.file_url} target="_blank" rel="noopener noreferrer"
                          className="btn-action btn-edit no-underline">
                          <i className="fa fa-file-alt"></i>
                        </a>
                      ) : "-"}
                    </td>
                    <td>{row.user?.name ?? "-"}</td>
                    <td>
                      <span className={`status-badge status-${row.status}`}>
                        {row.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-group">
                        <button className="btn-action btn-edit"
                          onClick={() => navigate(`/report/edit/${row.id_report}`)}>
                          <i className="fa fa-wrench"></i> Edit
                        </button>
                        <button className="btn-action btn-delete"
                          onClick={() => { setSelectedId(row.id_report); setShowModal(true); }}>
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
            Menampilkan {tabData.length} data &nbsp;·&nbsp; Halaman {currentPage} dari {totalPages}
          </small>
          <div className="pagination-btns">
            <button className="page-btn" disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>&lt;</button>
            <button className="page-btn" disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}>&gt;</button>
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
                Konfirmasi Hapus Report
              </span>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body-content">
              <p>Apakah Anda yakin ingin menghapus report ini?</p>
              <small>Report akan diarsipkan dan dapat dipulihkan oleh admin.</small>
            </div>
            <div className="modal-foot">
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Batal</button>
              <button className="btn-danger" onClick={confirmDelete}>
                <i className="fa fa-trash me-1"></i> Ya, Hapus
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}