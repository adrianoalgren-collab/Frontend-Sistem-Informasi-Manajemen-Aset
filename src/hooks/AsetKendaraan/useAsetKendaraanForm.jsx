// ======================================================
// === IMPORT
// ======================================================
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

// ======================================================
// === KONSTANTA
// ======================================================

// ── Nilai default form (satu sumber kebenaran) ──
const INITIAL_FORM = {
  kode_kendaraan:    "",
  nama_kendaraan:    "",
  plat_kendaraan:    "",
  kondisi_kendaraan: "",
  id_manufacturer:   "",
};

// ── Kondisi sinkron dengan model PHP ──
export const KONDISI_OPTIONS = [
  { value: "baik",         label: "Baik"        },
  { value: "rusak_ringan", label: "Rusak Ringan" },
  { value: "rusak_berat",  label: "Rusak Berat"  },
  { value: "tidak_aktif",  label: "Tidak Aktif"  },
];

// ======================================================
// === CUSTOM HOOK
// ======================================================
export const useAsetKendaraanForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ── Form & fetch state ──
  const [form,           setForm]           = useState(INITIAL_FORM);
  const [manufacturers,  setManufacturers]  = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(!!id);
  const [fetchError,     setFetchError]     = useState(false);

  // ── UI state (submit) ──
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError,   setShowError]   = useState(false);
  const [isLoading,   setIsLoading]   = useState(false);

  // ======================================================
  // === HANDLE CHANGE INPUT
  // ======================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ── Bangun payload ──
  const buildPayload = () => ({
    kode_kendaraan:    form.kode_kendaraan,
    nama_kendaraan:    form.nama_kendaraan,
    plat_kendaraan:    form.plat_kendaraan,
    kondisi_kendaraan: form.kondisi_kendaraan,
    id_manufacturer:   Number(form.id_manufacturer),
  });

  // ======================================================
  // === STORE (Tambah)
  // ======================================================
  const storeAsetKendaraan = () => api.post("/asetkendaraan", buildPayload());

  // ======================================================
  // === UPDATE (Edit)
  // ======================================================
  const updateAsetKendaraan = () => api.put(`/asetkendaraan/${id}`, buildPayload());

  // ======================================================
  // === HANDLE SUBMIT — dipakai Add & Edit
  // ======================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowError(false);

    try {
      await (id ? updateAsetKendaraan() : storeAsetKendaraan());
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/asetkendaraan");
      }, 2000);
    } catch {
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // ======================================================
  // === FETCH BY ID — mode Edit
  // ======================================================
  useEffect(() => {
    if (!id) return;

    const fetchById = async () => {
      setIsFetchingData(true);
      setFetchError(false);

      try {
        const res  = await api.get(`/asetkendaraan/${id}`);
        const data = res.data?.data ?? res.data;

        setForm({
          kode_kendaraan:    data.kode_kendaraan    || "",
          nama_kendaraan:    data.nama_kendaraan    || "",
          plat_kendaraan:    data.plat_kendaraan    || "",
          kondisi_kendaraan: data.kondisi_kendaraan || "",
          id_manufacturer:   data.manufacturer?.id_manufacturer ?? "",
        });
      } catch (err) {
        console.error("Gagal mengambil data aset kendaraan:", err);
        setFetchError(true);
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchById();
  }, [id]);

  // ======================================================
  // === FETCH MANUFACTURERS
  // ======================================================
  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        const res  = await api.get("/manufacturer");
        const list = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
            ? res.data
            : [];
        setManufacturers(list);
      } catch (err) {
        console.error("Gagal mengambil manufacturer:", err);
        setManufacturers([]);
      }
    };

    fetchManufacturers();
  }, []);

  // ======================================================
  // === RETURN
  // ======================================================
  return {
    // Form
    id,
    form,
    handleChange,
    storeAsetKendaraan,
    updateAsetKendaraan,
    manufacturers,
    isFetchingData,
    fetchError,

    // Submit
    isLoading,
    showSuccess,
    showError,
    handleSubmit,
  };
};