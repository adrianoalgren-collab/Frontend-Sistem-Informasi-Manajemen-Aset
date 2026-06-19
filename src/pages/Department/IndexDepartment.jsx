// ======================================================
// === IMPORT
// ======================================================

import { Link } from "react-router-dom";
import { useDepartmentList } from "../../hooks/Department/useDepartmentList";  // ambil data & state dari hook
import SortableTh from "../../components/SortableTh";               // komponen header kolom yang bisa diklik untuk sorting
import { useRole } from "../../hooks/useRole";                       // cek apakah user adalah admin


// ======================================================
// === HALAMAN DATA DEPARTMENT
// Menampilkan tabel daftar department dengan fitur:
// search, pagination, sorting, dan hapus data.
// Tombol Tambah dan Aksi hanya muncul untuk admin.
// ======================================================

export default function IndexDepartment() {

  // ambil semua data, state, dan fungsi yang dibutuhkan dari hook
  const {
    currentData,           // data yang ditampilkan di halaman ini
    loading,               // true saat data sedang diambil
    search,                // teks yang diketik di kotak pencarian
    setSearch,
    currentPage,           // halaman yang sedang aktif
    setCurrentPage,
    itemsPerPage,          // berapa baris data per halaman
    setItemsPerPage,
    filteredData,          // data setelah filter pencarian (untuk hitung total)
    totalPages,            // total halaman
    startIndex,            // nomor awal baris (untuk angka urut)
    handleDelete,          // fungsi hapus data
    sortBy, setSortBy,     // kolom yang sedang diurutkan
    sortDir, setSortDir,   // arah urutan: naik atau turun
    navigate,              // pindah halaman
    showModal, setShowModal,       // buka/tutup modal konfirmasi hapus
    selectedId, setSelectedId,     // id department yang mau dihapus
  } = useDepartmentList();

  // cek apakah user yang login adalah admin
  const { isAdmin } = useRole();


  return (
    <div className="page-wrapper">

      {/* ── JUDUL & BREADCRUMB ── */}
      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold">Data Department</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/department">Home</Link></li>
              <li className="breadcrumb-item active">Data Department</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="content-card">

        {/* ── TOOLBAR ──
            Baris di atas tabel.
            Kiri: pilih berapa data yang ditampilkan per halaman.
            Kanan: kotak cari + tombol Tambah (admin saja). */}
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
            <input type="text" className="dark-input" placeholder="Cari kode / nama..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />

            {/* tombol tambah hanya muncul kalau admin */}
            {isAdmin && (
              <button className="btn-brand" onClick={() => navigate("/department/tambah")}>
                <i className="fa fa-plus"></i> Tambah Data
              </button>
            )}
          </div>
        </div>

        {/* ── TABEL ──
            Header kolom bisa diklik untuk mengurutkan data.
            Kolom Aksi hanya muncul untuk admin. */}
        <div className="table-wrap">
          <table className="dark-table">
            <thead>
              <tr>
                <th>No</th>
                <SortableTh label="Kode"             field="kode_department"            sortBy={sortBy} sortDir={sortDir} setSortBy={setSortBy} setSortDir={setSortDir} />
                <SortableTh label="Nama Department"  field="nama_department"            sortBy={sortBy} sortDir={sortDir} setSortBy={setSortBy} setSortDir={setSortDir} />
                <SortableTh label="Penanggung Jawab" field="penanggungjawab_department" sortBy={sortBy} sortDir={sortDir} setSortBy={setSortBy} setSortDir={setSortDir} />
                <th>Jumlah Karyawan</th>
                <th>Contact</th>
                {isAdmin && <th>Aksi</th>}
              </tr>
            </thead>
            <tbody>

              {/* kalau data masih dimuat */}
              {loading ? (
                <tr><td colSpan={isAdmin ? 7 : 6} className="table-empty">Memuat data...</td></tr>

              ) : currentData.length === 0 ? (
                /* kalau tidak ada data yang cocok */
                <tr><td colSpan={isAdmin ? 7 : 6} className="table-empty">Data tidak ditemukan</td></tr>

              ) : (
                /* tampilkan baris data */
                currentData.map((row, index) => (
                  <tr key={row.id_department}>

                    {/* angka urut — dihitung dari halaman aktif bukan dari 1 terus */}
                    <td>{startIndex + index + 1}</td>
                    <td>{row.kode_department}</td>
                    <td>{row.nama_department}</td>
                    <td>{row.penanggungjawab_department}</td>

                    {/* jumlah karyawan diambil dari relasi users */}
                    <td>{row.users?.length ?? 0}</td>

                    {/* email dan telepon dalam satu kolom */}
                    <td>
                      <div style={{ marginBottom: "4px" }}>
                        <i className="fa fa-envelope me-1" style={{ color: "#3b82f6" }}></i>
                        <span style={{ fontWeight: 600, marginRight: "4px" }}>Email :</span>
                        {row.email_department || "-"}
                      </div>
                      <div>
                        <i className="fa fa-phone me-1" style={{ color: "var(--brand)" }}></i>
                        <span style={{ fontWeight: 600, marginRight: "4px" }}>Phone :</span>
                        {row.nomor_telepon_department || "-"}
                      </div>
                    </td>

                    {/* tombol edit dan hapus — hanya untuk admin */}
                    {isAdmin && (
                      <td>
                        <div className="action-group">
                          <button className="btn-action btn-edit"
                            onClick={() => navigate(`/department/edit/${row.id_department}`)}>
                            <i className="fa fa-wrench"></i> Edit
                          </button>
                          <button className="btn-action btn-delete"
                            onClick={() => { setSelectedId(row.id_department); setShowModal(true); }}>
                            <i className="fa fa-trash"></i> Hapus
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION ──
            Menampilkan info jumlah data dan tombol pindah halaman. */}
        <div className="pagination-bar">
          <small className="pagination-info">
            Menampilkan {currentData.length} dari {filteredData.length} data &nbsp;·&nbsp; Halaman {currentPage} dari {totalPages}
          </small>
          <div className="pagination-btns">
            <button className="page-btn" disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>&lt;</button>
            <button className="page-btn" disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}>&gt;</button>
          </div>
        </div>
      </div>


      {/* ── MODAL KONFIRMASI HAPUS ──
          Muncul saat tombol Hapus diklik.
          User harus konfirmasi dulu sebelum data dihapus. */}
      {showModal && (
        <>
          {/* latar gelap di belakang modal, klik untuk tutup */}
          <div className="modal-overlay" onClick={() => setShowModal(false)} />

          <div className="modal-box">
            <div className="modal-head">
              <span className="modal-title">
                <i className="fa fa-exclamation-triangle me-2 icon-danger"></i>
                Konfirmasi Hapus Data
              </span>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-body-content">
              <p>Apakah Anda yakin ingin menghapus data ini?</p>
              <small>Data yang sudah dihapus tidak dapat dikembalikan.</small>
            </div>

            {/* tombol Batal untuk membatalkan, Ya Hapus untuk melanjutkan */}
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