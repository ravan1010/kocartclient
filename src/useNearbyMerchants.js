// hooks/useNearbyMerchants.js
import { useEffect, useState } from "react";
import api from "./api";

const useNearbyMerchants = (location) => {
  // const [merchants, setMerchants] = useState([]);
  const [grocery, setGrocery] = useState([]);
  const [restaurant, setRestaurant] = useState([]);
  const [Open, setOpen] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location) return;

    const fetchMerchants = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/api/nearby?lat=${location.lat}&lng=${location.lng}`
        );
        setGrocery(res.data.grocery);
        setRestaurant(res.data.restaurant);
        setOpen(res.data.branch.open);
        console.log(res.data);

      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchMerchants();
  }, [location]);

  return { loading, grocery, restaurant, Open };
};

export default useNearbyMerchants;