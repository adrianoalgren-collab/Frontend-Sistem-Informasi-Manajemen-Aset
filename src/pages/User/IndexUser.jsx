// ======================================================
// FILE: pages/User/IndexUser.jsx
// FUNGSI: Tampilan halaman daftar user.
// Semua logika & handler sudah ada di useUserList —
// komponen ini hanya fokus pada UI.
// ======================================================

import { Link } from "react-router-dom";
import { useUserList } from "../../hooks/User/useUserList";
import SortableTh from "../../components/SortableTh";


// Opsi jumlah baris per halaman — konstanta di luar komponen
// agar tidak dibuat ulang setiap render.
const PAGE_SIZE_OPTIONS = [5, 10, 15, 25];


export default function IndexUser() {

  // Ambil semua state, data, dan handler dari hook.
  // Komponen tidak perlu tahu cara kerjanya — cukup pakai.
  const {
    currentData,
    loading,
    search,
    currentPage,  setCurrentPage,
    itemsPerPage,
    filteredData,
    totalPages,
    startIndex,
    sortBy,       setSortBy,
    sortDir,      setSortDir,
    navigate,
    showModal,    setShowModal,

    // handler UI — sudah dibungkus useCallback di hook
    openDeleteModal,
    confirmDelete,
    handleItemsPerPageChange,
    handleSearchChange,
  } = useUserList();


  return (
    <div className="page-wrapper">

      {/* ── JUDUL & BREADCRUMB ── */}
      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold">Data User</h4>
          <nav aria-label="Breadcrumb navigasi">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Data User
              </li>
            </ol>
          </nav>
        </div>
      </div>


      <div className="content-card">

        {/* ── TOOLBAR ──
            Kiri: pilih jumlah baris per halaman.
            Kanan: kotak cari + tombol tambah user. */}
        <div className="toolbar">

          <div className="toolbar-left">
            <label htmlFor="items-per-page">Tampilkan</label>
            <select
              id="items-per-page"
              className="dark-select"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <span>data</span>
          </div>

          <div className="toolbar-right">
            <input
              type="search"
              className="dark-input"
              placeholder="Cari nama / email..."
              value={search}
              onChange={handleSearchChange}
              aria-label="Cari user"
            />
            <button
              className="btn-brand"
              onClick={() => navigate("/user/tambah")}
            >
              <i className="fa fa-plus" aria-hidden="true" /> Tambah User
            </button>
          </div>
        </div>


        {/* ── TABEL USER ── */}
        <div className="table-wrap">
          <table className="dark-table" role="grid" aria-label="Tabel data user">
            <thead>
              <tr>
                <th scope="col">No</th>
                <SortableTh label="Nama"       field="name"       sortBy={sortBy} sortDir={sortDir} setSortBy={setSortBy} setSortDir={setSortDir} />
                <SortableTh label="Email"      field="email"      sortBy={sortBy} sortDir={sortDir} setSortBy={setSortBy} setSortDir={setSortDir} />
                <SortableTh label="Department" field="department" sortBy={sortBy} sortDir={sortDir} setSortBy={setSortBy} setSortDir={setSortDir} />
                <SortableTh label="Role"       field="role"       sortBy={sortBy} sortDir={sortDir} setSortBy={setSortBy} setSortDir={setSortDir} />
                <th scope="col">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                /* State 1: data sedang dimuat */
                <tr>
                  <td colSpan="6" className="table-empty" aria-live="polite">
                    Memuat data...
                  </td>
                </tr>

              ) : currentData.length === 0 ? (
                /* State 2: tidak ada hasil pencarian */
                <tr>
                  <td colSpan="6" className="table-empty">
                    Data tidak ditemukan
                  </td>
                </tr>

              ) : (
                /* State 3: tampilkan baris data */
                currentData.map((row, index) => (
                  <tr key={row.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{row.name}</td>
                    <td>{row.email}</td>
                    <td>{row.department ?? "—"}</td>
                    <td>
                      <span
                        className={`role-badge role-${row.role?.toLowerCase()}`}
                        title={`Role: ${row.role}`}
                      >
                        {row.role ?? "—"}
                      </span>
                    </td>
                    <td>
                      <div className="action-group">
                        <button
                          className="btn-action btn-edit"
                          onClick={() => navigate(`/user/edit/${row.id}`)}
                          aria-label={`Edit user ${row.name}`}
                        >
                          <i className="fa fa-wrench" aria-hidden="true" /> Edit
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => openDeleteModal(row.id)}
                          aria-label={`Hapus user ${row.name}`}
                        >
                          <i className="fa fa-trash" aria-hidden="true" /> Hapus
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
            Menampilkan {currentData.length} dari {filteredData.length} data
            &nbsp;·&nbsp;
            Halaman {currentPage} dari {totalPages}
          </small>
          <nav aria-label="Navigasi halaman">
            <div className="pagination-btns">
              <button
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                aria-label="Halaman sebelumnya"
              >
                &lt;
              </button>
              <button
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                aria-label="Halaman berikutnya"
              >
                &gt;
              </button>
            </div>
          </nav>
        </div>
      </div>


      {/* ── MODAL KONFIRMASI HAPUS ──
          Hanya render jika showModal true.
          confirmDelete() sudah tahu selectedId dari dalam hook. */}
      {showModal && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setShowModal(false)}
            aria-hidden="true"
          />
          <div
            className="modal-box"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="modal-head">
              <span id="modal-title" className="modal-title">
                <i className="fa fa-exclamation-triangle me-2 icon-danger" aria-hidden="true" />
                Konfirmasi Hapus
              </span>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
                aria-label="Tutup dialog"
              >
                ×
              </button>
            </div>

            <div className="modal-body-content">
              <p>Apakah Anda yakin ingin menghapus user ini?</p>
              <small>Data yang sudah dihapus tidak dapat dikembalikan.</small>
            </div>

            <div className="modal-foot">
              <button className="btn-ghost" onClick={() => setShowModal(false)}>
                Batal
              </button>
              <button className="btn-danger" onClick={confirmDelete}>
                <i className="fa fa-trash me-1" aria-hidden="true" /> Ya, Hapus
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}