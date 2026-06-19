import { Link, useNavigate } from "react-router-dom";
import { useAsetMaterialForm } from "../../hooks/AsetMaterial/useAsetMaterialForm";
import { Modal } from "bootstrap";

export default function AddAsetMaterial() {

  // ======================================================
  // === NAVIGASI HALAMAN
  // ======================================================

  // Digunakan untuk redirect / pindah halaman setelah submit
  const navigate = useNavigate();


  // ======================================================
  // === AMBIL LOGIC DARI CUSTOM HOOK
  // ======================================================

  // fetchList: false → hanya gunakan logic form (tidak fetch data list)
  const { form, handleChange, storeAsetMaterial } =
    useAsetMaterialForm({ fetchList: false });


  // ======================================================
  // === HANDLE SUBMIT FORM
  // ======================================================

  const handleSubmit = (e) => {
    e.preventDefault(); // Mencegah reload halaman saat form disubmit

    // Panggil function dari hook untuk menyimpan data ke backend
    storeAsetMaterial()
      .then(() => {

        // Ambil elemen modal dari DOM
        const modalElement = document.getElementById("successModal");

        // Inisialisasi modal Bootstrap
        const modal = new Modal(modalElement);

        // Tampilkan modal sukses
        modal.show();

        // Redirect otomatis setelah 2 detik
        setTimeout(() => {
          modal.hide(); // Tutup modal
          navigate("/IndexAsetMaterial"); // Redirect ke halaman list
        }, 2000);

      })
      .catch(() => {
        // Jika gagal menyimpan data
        alert("Gagal menyimpan data");
      });
  };

  // ======================================================
  // === RENDER UI
  // ======================================================

  return (
    <div className="container-fluid py-3">

      {/* ================= HEADER ================= */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="row align-items-center">

            {/* Judul Halaman */}
            <div className="col-lg-6">
              <h4 className="mb-0 fw-bold">Tambah Data Aset</h4>
            </div>

            {/* Breadcrumb */}
            <div className="col-lg-6">
              <nav
                aria-label="breadcrumb"
                className="d-flex justify-content-lg-end"
              >
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">
                    Tambah Data Aset
                  </li>
                </ol>
              </nav>
            </div>

          </div>
        </div>
      </div>


      {/* ================= FORM ================= */}
      <div className="card shadow-sm">
        <div className="card-body">

          {/* Tombol kembali */}
          <div className="text-end mb-3">
            <Link to="/IndexAsetMaterial" className="btn btn-primary btn-sm">
              <i className="fa fa-arrow-left me-1"></i> Kembali
            </Link>
          </div>

          {/* Form Input */}
          <form onSubmit={handleSubmit}>

            {/* Input Kode */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Kode Aset</label>
              <input
                type="text"
                name="kode"
                className="form-control"
                value={form.kode}
                onChange={handleChange} // Update state dari hook
                placeholder="Masukkan kode aset"
                required
              />
            </div>

            {/* Input Nama */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Nama Aset</label>
              <input
                type="text"
                name="nama"
                className="form-control"
                value={form.nama}
                onChange={handleChange}
                placeholder="Masukkan nama aset"
                required
              />
            </div>

            {/* Input Jumlah */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Jumlah / Stok</label>
              <input
                type="number"
                name="jumlah"
                className="form-control"
                value={form.jumlah}
                onChange={handleChange}
                placeholder="Masukkan jumlah"
                required
              />
            </div>

            {/* Input Keterangan */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Keterangan</label>
              <textarea
                name="keterangan"
                className="form-control"
                rows="3"
                value={form.keterangan}
                onChange={handleChange}
                placeholder="Keterangan tambahan (opsional)"
              />
            </div>

            {/* Tombol Aksi */}
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                <i className="fa fa-save me-1"></i> Simpan
              </button>

              <Link to="/IndexAsetMaterial" className="btn btn-secondary">
                Batal
              </Link>
            </div>

          </form>
        </div>


        {/* ================= MODAL SUKSES ================= */}
        {/* Modal ini ditampilkan setelah data berhasil disimpan */}
        <div
          className="modal fade"
          id="successModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Berhasil</h5>
              </div>

              <div className="modal-body text-center">
                <div className="mb-3">
                  <i className="fa fa-check-circle fa-3x text-success"></i>
                </div>
                <p className="mb-0">
                  Data aset berhasil disimpan.<br />
                  Mengalihkan ke halaman data...
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}