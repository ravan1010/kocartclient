import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

function MARTMerchantVariants() {
  const { id } = useParams();

  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVariants();
  }, [id]);

  const fetchVariants = async () => {
    try {
      const res = await api.get(`/api/mart/variants/${id}`);

      if (res.data.success) {
        setVariants(res.data.variants);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-wrap gap-3">
      {variants.map((variant) => (
        <button
          key={variant}
          className="px-4 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600"
        >
          {variant}
        </button>
      ))}
    </div>
  );
}

export default MARTMerchantVariants;