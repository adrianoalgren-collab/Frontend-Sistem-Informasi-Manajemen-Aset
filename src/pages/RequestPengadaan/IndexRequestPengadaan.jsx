// ======================================================
// === IMPORT
// ======================================================

import { Link, useNavigate } from "react-router-dom";
import { useRequestPengadaanList } from "../../hooks/RequestPengadaan/useRequestPengadaanList";
import { useState } from "react";
import SortableTh from "../../components/SortableTh";

// ======================================================
// === KOMPONEN UTAMA
// ======================================================

export default function IndexRequestPengadaan() {
  // ======================================================
  // === DATA LOGIC
  // ======================================================

  const {
    loading,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    handleDelete,
    sortedData,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
  } = useRequestPengadaanList();

  const navigate = useNavigate();

  // ======================================================
  // === STATE UI
  // ======================================================

  const [activeTab, setActiveTab] = useState("Pending");
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // ======================================================
  // === FILTER TAB
  // ======================================================

  const tabData = sortedData.filter(
    (row) => row.status_approval === activeTab
  );

  // ======================================================
  // === COUNT BADGE
  // ======================================================

  const countPending = sortedData.filter(
    (row) => row.status_approval === "Pending"
  ).length;

  const countApproved = sortedData.filter(
    (row) => row.status_approval === "Approved"
  ).length;

  const countRejected = sortedData.filter(
    (row) => row.status_approval === "Rejected"
  ).length;

  // ======================================================
  // === PAGINATION
  // ======================================================

  const start = (currentPage - 1) * itemsPerPage;

  const currentData = tabData.slice(
    start,
    start + itemsPerPage
  );

  const totalTabPages = Math.max(
    1,
    Math.ceil(tabData.length / itemsPerPage)
  );

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
          <h4 className="mb-0 fw-bold">
            Data Request Pengadaan
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

      {/* ── CONTENT ── */}
      <div className="content-card">

        {/* ── TOOLBAR ── */}
        <div className="toolbar">

          <div className="toolbar-left">
            <span>Tampilkan</span>

            <select
              className="dark-select"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
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
              placeholder="Cari nama / department..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />

            <button
              className="btn-brand"
              onClick={() =>
                navigate("/request/pengadaan/tambah")
              }
            >
              <i className="fa fa-plus"></i>
              Tambah Request
            </button>
          </div>
        </div>

        {/* ── TAB NAV ── */}
        <div className="tab-nav">

          <button
            className={`tab-btn ${
              activeTab === "Pending" ? "active" : ""
            }`}
            onClick={() => handleTabChange("Pending")}
          >
            <i className="fa fa-clock"></i>
            Pending
            <span className="tab-count">
              {countPending}
            </span>
          </button>

          <button
            className={`tab-btn ${
              activeTab === "Approved" ? "active" : ""
            }`}
            onClick={() => handleTabChange("Approved")}
          >
            <i className="fa fa-check-circle"></i>
            Approved
            <span className="tab-count">
              {countApproved}
            </span>
          </button>

          <button
            className={`tab-btn ${
              activeTab === "Rejected" ? "active" : ""
            }`}
            onClick={() => handleTabChange("Rejected")}
          >
            <i className="fa fa-times-circle"></i>
            Rejected
            <span className="tab-count">
              {countRejected}
            </span>
          </button>

        </div>

        {/* ── TABLE ── */}
        <div className="table-wrap">
          <table className="dark-table">

            <thead>
              <tr>
                <th>No</th>

                <SortableTh
                  label="Nama"
                  field="nama_pengadaan"
                  sortBy={sortBy}
                  sortDir={sortDir}
                  setSortBy={setSortBy}
                  setSortDir={setSortDir}
                />

                <SortableTh
                  label="Department"
                  field="department"
                  sortBy={sortBy}
                  sortDir={sortDir}
                  setSortBy={setSortBy}
                  setSortDir={setSortDir}
                />

                <SortableTh
                  label="Status"
                  field="status_approval"
                  sortBy={sortBy}
                  sortDir={sortDir}
                  setSortBy={setSortBy}
                  setSortDir={setSortDir}
                />

                <th>File</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">
                    Loading...
                  </td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                currentData.map((row, index) => (
                  <tr key={row.id_request_pengadaan}>
                    <td>{start + index + 1}</td>

                    <td>
                      {row.nama_pengadaan || "-"}
                    </td>

                    <td>
                      {row.department?.nama_department || "-"}
                    </td>

                    <td>
                      <span
                        className={`status-badge status-${row.status_approval}`}
                      >
                        {row.status_approval}
                      </span>
                    </td>

                    <td>
                      {row.file_request ? (
                        <a
                          href={`http://127.0.0.1:8000/storage/${row.file_request}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-action btn-edit btn-file"
                        >
                          <i className="fa fa-file-alt"></i>
                          Lihat File
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>
                      <div className="action-group">

                        <button
                          className="btn-action btn-edit"
                          onClick={() =>
                            navigate(
                              `/request/pengadaan/edit/${row.id_request_pengadaan}`
                            )
                          }
                        >
                          <i className="fa fa-check"></i>
                          Approval
                        </button>

                        <button
                          className="btn-action btn-delete"
                          onClick={() => {
                            setSelectedId(
                              row.id_request_pengadaan
                            );
                            setShowModal(true);
                          }}
                        >
                          <i className="fa fa-trash"></i>
                          Hapus
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

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
                <i
                  className="fa fa-exclamation-triangle me-2"
                  style={{ color: "#ef4444" }}
                ></i>
                Konfirmasi Hapus Data
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
                Apakah Anda yakin ingin menghapus data ini?
              </p>

              <small>
                Data yang sudah dihapus tidak dapat
                dikembalikan.
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