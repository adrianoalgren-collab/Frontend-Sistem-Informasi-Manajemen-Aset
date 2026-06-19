// ======================================================
// === IMPORT
// ======================================================
import { useState, useEffect, useMemo } from "react";
import api from "../../services/api";
import { useParams } from "react-router-dom";

// ======================================================
// === CUSTOM HOOK FORM KODE BARANG (ASET OPERASIONAL)
// ======================================================
export const useAsetOperasionalForm = () => {

  const { id } = useParams();

  // ======================================================
  // === FORM STATE
  // ======================================================
  const [form, setForm] = useState({
    id_operasional:          "",
    nama_asetoperasional:    "",
    id_manufacturer:         "",
    kode_barang:             "",
    kondisi_asetoperasional: "",
    lokasi_asetoperasional:  "",
    foto_asetoperasional:    null,
  });

  // ======================================================
  // === MASTER DATA + UI STATE
  // ======================================================
  const [asetMasterList, setAsetMasterList] = useState([]);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState(null);

  // ======================================================
  // === KODE BARANG STATE
  // ======================================================
  const [kodeError, setKodeError]             = useState(null);
  const [checkingKode, setCheckingKode]       = useState(false);
  const [loadingNextKode, setLoadingNextKode] = useState(false);

  // ======================================================
  // === SELECTED ASET (reaktif ke form.id_operasional)
  // ======================================================
  const selectedAset = useMemo(
    () =>
      asetMasterList.find(
        (item) => String(item.id_operasional) === String(form.id_operasional)
      ) ?? null,
    [asetMasterList, form.id_operasional]
  );

  // ======================================================
  // === FETCH MASTER ASET
  // ======================================================
  useEffect(() => {
    const fetchMaster = async () => {
      try {
        setLoading(true);
        setError(null);

        const res  = await api.get("/asetoperasional");
        const data = res.data.data || res.data;
        setAsetMasterList(data);

      } catch (err) {
        console.error("Gagal fetch aset master:", err);
        setError("Gagal memuat daftar aset. Silakan refresh halaman.");
      } finally {
        setLoading(false);
      }
    };

    fetchMaster();
  }, []);

  // ======================================================
  // === FETCH DETAIL (edit mode — kode_barang)
  // ======================================================
  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        const res  = await api.get(`/kodebarang/${id}`);
        const data = res.data.data || res.data;

        setForm({
          id_operasional:
            data.id_operasional ||
            data.aset_operasional?.id_operasional ||
            "",
          nama_asetoperasional:
            data.aset_operasional?.nama_asetoperasional || "",
          id_manufacturer:
            data.aset_operasional?.manufacturer?.id_manufacturer || "",
          kode_barang:             data.kode_barang             || "",
          kondisi_asetoperasional: data.kondisi_asetoperasional || "",
          lokasi_asetoperasional:  data.lokasi_asetoperasional  || "",
          foto_asetoperasional:    null,
        });

      } catch (err) {
        console.error("Gagal fetch kode_barang:", err);
      }
    };

    fetchDetail();
  }, [id]);

  // ======================================================
  // === AUTO SYNC manufacturer saat edit
  // ======================================================
  useEffect(() => {
    if (!form.id_operasional || asetMasterList.length === 0) return;

    const selected = asetMasterList.find(
      (item) => String(item.id_operasional) === String(form.id_operasional)
    );

    if (selected) {
      setForm((prev) => ({
        ...prev,
        nama_asetoperasional: selected.nama_asetoperasional,
        id_manufacturer:      selected.manufacturer?.id_manufacturer || "",
      }));
    }
  }, [form.id_operasional, asetMasterList]);

  // ======================================================
  // === FETCH NEXT KODE (auto-suggest saat pilih aset)
  // ======================================================
  // Hanya di add mode (tidak ada id).
  // Edit mode sudah punya kode dari fetchDetail — tidak perlu di-overwrite.
  const fetchNextKode = async (idOperasional) => {
    if (!idOperasional || id) return;

    try {
      setLoadingNextKode(true);
      setKodeError(null);

      const res = await api.get("/kodebarang/next", {
        params: { id_operasional: idOperasional },
      });

      setForm((prev) => ({
        ...prev,
        kode_barang: res.data.next_kode ?? "",
      }));

    } catch {
      // Silent — biarkan user isi manual jika endpoint gagal
    } finally {
      setLoadingNextKode(false);
    }
  };

  // ======================================================
  // === CHECK KODE DUPLIKAT (dipanggil saat onBlur)
  // ======================================================
  const checkKodeBarang = async (kode) => {
    if (!kode || kode.trim() === "") return;

    try {
      setCheckingKode(true);
      setKodeError(null);

      const res = await api.get("/kodebarang/check", {
        params: {
          kode_barang: kode.trim(),
          exclude_id:  id ?? "",   // edit mode: exclude diri sendiri
        },
      });

      if (res.data.exists) {
        setKodeError(`Kode "${kode}" sudah digunakan.`);
      }

    } catch {
      // Silent
    } finally {
      setCheckingKode(false);
    }
  };

  // ======================================================
  // === HANDLE INPUT CHANGE
  // ======================================================
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      return;
    }

    // Reset error saat user mengetik ulang kode manual
    if (name === "kode_barang") {
      setKodeError(null);
      setForm((prev) => ({ ...prev, kode_barang: value }));
      return;
    }

    // Pilih aset → auto-fill manufacturer + auto-suggest kode berikutnya
    if (name === "id_operasional") {
      const selected = asetMasterList.find(
        (item) => String(item.id_operasional) === String(value)
      );

      setForm((prev) => ({
        ...prev,
        id_operasional:       value,
        nama_asetoperasional: selected?.nama_asetoperasional || "",
        id_manufacturer:      selected?.manufacturer?.id_manufacturer || "",
        kode_barang:          "",   // reset dulu, fetchNextKode akan mengisi
      }));

      setKodeError(null);
      fetchNextKode(value);
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ======================================================
  // === STORE
  // ======================================================
  const storeAsetOperasional = async () => {
    // Safety net: tolak submit jika kode masih terduplikat
    if (kodeError) throw new Error(kodeError);

    const data = new FormData();

    data.append("id_operasional",          form.id_operasional);
    data.append("kode_barang",             form.kode_barang);
    data.append("kondisi_asetoperasional", form.kondisi_asetoperasional);
    data.append("lokasi_asetoperasional",  form.lokasi_asetoperasional);

    if (form.foto_asetoperasional) {
      data.append("foto_asetoperasional", form.foto_asetoperasional);
    }

    return await api.post("/kodebarang", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  // ======================================================
  // === UPDATE
  // ======================================================
  const updateAsetOperasional = async () => {
    if (kodeError) throw new Error(kodeError);

    const data = new FormData();

    data.append("id_operasional",          form.id_operasional);
    data.append("kode_barang",             form.kode_barang);
    data.append("kondisi_asetoperasional", form.kondisi_asetoperasional);
    data.append("lokasi_asetoperasional",  form.lokasi_asetoperasional);

    if (form.foto_asetoperasional) {
      data.append("foto_asetoperasional", form.foto_asetoperasional);
    }

    data.append("_method", "PUT");

    return await api.post(`/kodebarang/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  // ======================================================
  // === RETURN
  // ======================================================
  return {
    form,
    handleChange,

    storeAsetOperasional,
    updateAsetOperasional,

    asetMasterList,
    selectedAset,
    loading,
    error,

    kodeError,        // pesan error jika kode duplikat
    checkingKode,     // true saat sedang cek duplikat ke API
    checkKodeBarang,  // panggil di onBlur input kode_barang

    loadingNextKode,  // true saat sedang fetch kode berikutnya

    id,
  };
};