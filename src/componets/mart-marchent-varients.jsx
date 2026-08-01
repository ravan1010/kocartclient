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
    <div className="w-full mb-6">
  {variants.length > 0 ? (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2">
      {variants.map((variant) => (
        <button
          key={variant}
          className="px-5 py-2 rounded-full bg-white border border-gray-300 text-gray-700 font-medium whitespace-nowrap shadow-sm hover:bg-orange-500 hover:text-white hover:border-orange-500 transition duration-200"
        >
          {variant}
        </button>
      ))}
    </div>
  ) : (
    <div className="flex justify-center items-center py-8">
      <p className="text-gray-500 text-lg font-medium">
        No categories available
      </p>
    </div>
  )}
</div>
  );
}

export default MARTMerchantVariants;