import { useEffect } from "react";
import api from "../api";

export default function useSaveLocation() {

    useEffect(() => {

        async function saveLocation() {

            const profile = await api.get("/api/setting", {
                withCredentials: true,
            });

            if (profile.data.user.location?.coordinates?.[0] !== 0) {
                return;
            }

            navigator.geolocation.getCurrentPosition(

                async (position) => {

                    await api.put("/api/user/location", {

                        latitude: position.coords.latitude.toFixed(6),
                        longitude: position.coords.longitude.toFixed(6),

                    }, {
                        withCredentials: true,
                    });

                },

                (err) => {
                    console.log(err);
                }

            );

        }

        saveLocation();

    }, []);

}