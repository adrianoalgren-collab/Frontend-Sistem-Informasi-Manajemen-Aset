// ======================================================
// === IMPORT
// ======================================================

import { Link, useParams, useNavigate } from "react-router-dom"; // Routing & navigasi halaman
import { Modal } from "bootstrap"; // Modal popup
import { useAsetMaterialForm } from "../../hooks/AsetMaterial/useAsetMaterialForm"; // Custom hook form

// ======================================================
// === COMPONENT UTAMA
// ======================================================
export default function EditAsetMaterial() {

  // ======================================================
  // === ROUTING
  // ======================================================

  const { id } = useParams(); // Ambil ID dari URL
  const navigate = useNavigate(); // Digunakan untuk redirect halaman

  // ======================================================
  // === DATA & LOGIC FORM
  // ======================================================

  // Ambil state form & function update dari custom hook
  const { form, handleChange, updateAsetMaterial } = useAsetMaterialForm();

  // ======================================================
  // === FUNCTION HANDLE SUBMIT
  // ======================================================
  const handleSubmit = async (e) => {
    e.preventDefault(); // Cegah reload halaman

    try {
      await updateAsetMaterial(id); // Update data via hook

      // Tampilkan modal sukses
      const modalElement = document.getElementById("successModal");
      const modal = new Modal(modalElement);
      modal.show();

      // Tutup modal & redirect setelah 2 detik
      setTimeout(() => {
        modal.hide();
        navigate("/IndexAsetMaterial");
      }, 2000);

    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui data");
    }
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
            <div className="col-lg-6">
              <h4 className="mb-0 fw-bold">Edit Data Aset</h4>
            </div>
            <div className="col-lg-6">
              <nav aria-label="breadcrumb" className="d-flex justify-content-lg-end">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                  <li className="breadcrumb-item active">Edit Data Aset</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* ================= FORM ================= */}
      <div className="card shadow-sm">
        <div className="card-body">

          {/* Tombol Kembali */}
          <div className="text-end mb-3">
            <Link to="/IndexAsetMaterial" className="btn btn-primary btn-sm">
              <i className="fa fa-arrow-left me-1"></i> Kembali
            </Link>
          </div>

          {/* Form Edit */}
          <form onSubmit={handleSubmit}>

            {/* Input Kode Aset */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Kode Aset</label>
              <input
                type="text"
                name="kode"
                className="form-control"
                value={form.kode}
                onChange={handleChange}
                required
              />
            </div>

            {/* Input Nama Aset */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Nama Aset</label>
              <input
                type="text"
                name="nama"
                className="form-control"
                value={form.nama}
                onChange={handleChange}
                required
              />
            </div>

            {/* Input Jumlah / Stok */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Jumlah / Stok</label>
              <input
                type="number"
                name="jumlah"
                className="form-control"
                value={form.jumlah}
                onChange={handleChange}
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
              />
            </div>

            {/* Tombol Simpan & Batal */}
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                <i className="fa fa-save me-1"></i> Simpan Perubahan
              </button>
              <Link to="/IndexAsetMaterial" className="btn btn-secondary">
                Batal
              </Link>
            </div>
          </form>
        </div>

        {/* ================= MODAL SUCCESS ================= */}
        <div className="modal fade" id="successModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              {/* Header Modal */}
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Berhasil</h5>
              </div>

              {/* Body Modal */}
              <div className="modal-body text-center">
                <div className="mb-3">
                  <i className="fa fa-check-circle fa-3x text-success"></i>
                </div>
                <p className="mb-0">
                  Data aset berhasil diperbarui.<br />
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