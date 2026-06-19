// ======================================================
// === IMPORT
// ======================================================
import { useState, useEffect } from "react";
import api from "../../services/api";
import { useParams } from "react-router-dom";

// ======================================================
// === CUSTOM HOOK FORM JENIS ASET OPERASIONAL
// ======================================================
export const useJenisAsetOperasionalForm = () => {

  const { id } = useParams();

  // ======================================================
  // === FORM STATE
  // ======================================================
  const [form, setForm] = useState({
    nama_asetoperasional: "",
    id_manufacturer: "",
    foto_asetoperasional: null,
  });

  // ======================================================
  // === MASTER DATA + UI STATE
  // ======================================================
  const [manufacturerList, setManufacturerList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ======================================================
  // === FETCH MANUFACTURER
  // ======================================================
  useEffect(() => {
    const fetchManufacturer = async () => {
      try {

        setLoading(true);
        setError(null);

        const res = await api.get("/manufacturer");
        const data = res.data.data || res.data;

        setManufacturerList(data);

      } catch (err) {

        console.error("Gagal fetch manufacturer:", err);

        setError(
          "Gagal memuat daftar manufacturer. Silakan refresh halaman."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchManufacturer();
  }, []);

  // ======================================================
  // === FETCH DETAIL (EDIT MODE)
  // ======================================================
  useEffect(() => {

    if (!id) return;

    const fetchDetail = async () => {
      try {

        const res = await api.get(`/asetoperasional/${id}`);
        const data = res.data.data || res.data;

        setForm({
          nama_asetoperasional:
            data.nama_asetoperasional || "",

          id_manufacturer:
            data.id_manufacturer ||
            data.manufacturer?.id_manufacturer ||
            "",

          foto_asetoperasional: null,
        });

      } catch (err) {
        console.error(
          "Gagal mengambil detail jenis aset operasional:",
          err
        );
      }
    };

    fetchDetail();

  }, [id]);

  // ======================================================
  // === HANDLE INPUT CHANGE
  // ======================================================
  const handleChange = (e) => {

    const { name, value, type, files } = e.target;

    if (type === "file") {

      setForm((prev) => ({
        ...prev,
        [name]: files[0],
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================================
  // === STORE
  // ======================================================
  const storeJenisAsetOperasional = async () => {

    const data = new FormData();

    data.append(
      "nama_asetoperasional",
      form.nama_asetoperasional
    );

    data.append(
      "id_manufacturer",
      form.id_manufacturer
    );

    if (form.foto_asetoperasional) {
      data.append(
        "foto_asetoperasional",
        form.foto_asetoperasional
      );
    }

    return await api.post(
      "/asetoperasional",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  };

  // ======================================================
  // === UPDATE
  // ======================================================
  const updateJenisAsetOperasional = async () => {

    const data = new FormData();

    data.append(
      "nama_asetoperasional",
      form.nama_asetoperasional
    );

    data.append(
      "id_manufacturer",
      form.id_manufacturer
    );

    if (form.foto_asetoperasional) {
      data.append(
        "foto_asetoperasional",
        form.foto_asetoperasional
      );
    }

    data.append("_method", "PUT");

    return await api.post(
      `/asetoperasional/${id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  };

  // ======================================================
  // === RETURN
  // ======================================================
  return {
    form,
    handleChange,

    storeJenisAsetOperasional,
    updateJenisAsetOperasional,

    manufacturerList,

    loading,
    error,

    id,
  };
};