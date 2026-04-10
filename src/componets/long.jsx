import React, { useState, useEffect } from "react";
// import api from "../api";
import Navbar from "./navbar";
// import useLiveLocation from "../useLocationForm";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import Footer from "./Footer";
import axios from "axios";
import { Edit, MapPin, Phone, Truck, User } from "lucide-react";
import "../utili/fixLeafletIcon";

function RecenterMap({ position }) {
    const map = useMap();

    useEffect(() => {
        const center = map.getCenter();

        // ✅ Only move if different
        if (
            center.lat.toFixed(6) !== position[0] ||
            center.lng.toFixed(6) !== position[1]
        ) {
            map.setView(position, map.getZoom());
        }
    }, [position]);

    return null;
}


const ParcelBooking = () => {

    const [fromCity, setFromCity] = useState("");
    const [toCity, setToCity] = useState("");

    const [pickupName, setPickupName] = useState("");
    const [pickupMobile, setPickupMobile] = useState("");
    const [pickupAddress, setPickupAddress] = useState("");

    const [receiverName, setReceiverName] = useState("");
    const [receiverMobile, setReceiverMobile] = useState("");
    const [receiverAddress, setReceiverAddress] = useState("");

    const [MOBNumber, setMOBNumber] = useState("")

    // const [distanceData, setDistanceData] = useState(null);

    const [step, setStep] = useState(0);


    const getfromCityCoordinates = async (city) => {
        const res = await axios.get(
            `https://api.geoapify.com/v1/geocode/search?text=${city}&type=city&format=json&apiKey=${import.meta.env.VITE_GEOAPIFY_KEY}`
        );

        const lat = Number(res?.data?.results?.[0]?.lat.toFixed(6));
        const lon = Number(res?.data?.results?.[0]?.lon.toFixed(6));

        setPickupPosition([lat, lon])
        setStep(2)

        if (city === "mysuru") {
            setMOBNumber('7349343243')
        } else if (city === 'bengaluru') {
            setMOBNumber('8088303214')
        }

        console.log(res)
        console.log("Latitude :", lat);
        console.log("Longitude:", lon);
    };

    const getToCityCoordinates = async (city) => {
        const res = await axios.get(
            `https://api.geoapify.com/v1/geocode/search?text=${city}&type=city&format=json&apiKey=${import.meta.env.VITE_GEOAPIFY_KEY}`
        );

        const lat = Number(res?.data?.results?.[0]?.lat.toFixed(6));
        const lon = Number(res?.data?.results?.[0]?.lon.toFixed(6));

        setreciverPosition([lat, lon])

        console.log(res)
        console.log("Latitude pi:", lat);
        console.log("Longitude:", lon);
    };

    // useEffect(() => {
    //     fetchCities();
    // }, []);

    // useEffect(() => {
    //     if (fromCity) fetchRoutes(fromCity);
    // }, [fromCity]);

    // const fetchCities = async () => {
    //     const { data } = await api.get("/api/cities");
    //     setCities(data);
    //     console.log(data)
    // };

    // const fetchRoutes = async (from) => {
    //     const { data } = await api.get(`/api/routes/${from}`);
    //     setRoutes(data);
    //     console.log(data)
    // };

    const [pickupPosition, setPickupPosition] = useState([
        12.9716,
        77.5946,
    ]);

    const getpickupAddress = async () => {

        const geo = await axios.get(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${pickupPosition[0]}&lon=${pickupPosition[1]}&format=json&apiKey=${import.meta.env.VITE_GEOAPIFY_KEY}`,
        );

        setPickupAddress(geo.data.results[0].address_line1);

        console.log(geo.data.results[0].address_line1);
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            getpickupAddress();
        }, 500);

        return () => clearTimeout(timeout);
    }, [pickupPosition]);

    const [reciverPosition, setreciverPosition] = useState([
        '12.9716',
        '77.5946',
    ]);

    const getreceiverAddress = async () => {
        const geo = await axios.get(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${reciverPosition[0]}&lon=${reciverPosition[1]}&format=json&apiKey=${import.meta.env.VITE_GEOAPIFY_KEY}`,
        );

        setReceiverAddress(geo.data.results[0].address_line1);

        console.log(geo.data.results[0].address_line1);
    }

    useEffect(() => {
        getreceiverAddress();
    }, [reciverPosition]);

    // const distanceSubmit = async () => {

    //     if (
    //         !fromCity || !toCity ||
    //         !pickupName || !pickupMobile || !pickupAddress ||
    //         !pickuplatitude || !pickuplongitude ||
    //         !receiverName || !receiverMobile ||
    //         !receiverAddress || !receiverlatitude || !receiverlongitude
    //     ) {
    //         alert("Fill all fields");
    //         return;
    //     }

    //     // console.log(`pickup lat: ${pickuplatitude}, lon: ${pickuplongitude} \n receive lat: ${receiverlatitude}, lon: ${receiverlongitude}
    //     //   ` )

    //     try {
    //         const res = await api.post('/api/distance',
    //             {
    //                 from: fromCity,
    //                 to: toCity,
    //                 pickuplat: pickuplatitude.toFixed(6),
    //                 pickuplon: pickuplongitude.toFixed(6),
    //                 reciverlat: receiverlatitude.toFixed(6),
    //                 reciverlon: receiverlongitude.toFixed(6)
    //             }
    //         )
    //         if (res.data.success) {
    //             setStep(3)
    //             setDistanceData(res.data);

    //             console.log(res.data)
    //         }

    //     } catch (error) {
    //         console.log(error)
    //     }

    // };

    // const OrderParcel = async () => {

    //     try {
    //         const res = await api.post("/api/parcel/create", {
    //             fromCity,
    //             fromlat: distanceData.fromlat,
    //             fromlon: distanceData.fromlon,
    //             toCity,
    //             tolat: distanceData.tolat,
    //             tolon: distanceData.tolon,

    //             pickupName,
    //             pickupPhone: pickupMobile,
    //             pickupAddress,
    //             pickupLat: pickuplatitude.toFixed(6),
    //             pickupLng: pickuplongitude.toFixed(6),

    //             receiverName,
    //             receiverPhone: receiverMobile,
    //             receiverAddress,
    //             receiverLat: receiverlatitude.toFixed(6),
    //             receiverLng: receiverlongitude.toFixed(6),

    //             price: distanceData.totalAmount,
    //             paymentType: "cod"
    //         })

    //         if (res.data.success === true) {
    //             alert(res.data.message)
    //             setStep(1)
    //             setFromCity('')
    //             setToCity('')
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }



    const sendWhatsApp = () => {

        if (!pickupPosition || !pickupName || !pickupMobile || !pickupAddress
            || !receiverName || !receiverMobile || !receiverAddress
        ) {
            alert("Select pickup and enter drop");
            return;
        }

        const pickupmapLink = `https://www.google.com/maps?q=${pickupPosition[0]},${pickupPosition[1]}`;
        const receivermapLink = `https://www.google.com/maps?q=${receiverPosition[0]},${receiverPosition[1]}`;

        const message =
            `Parcel Order
            pickup city : ${fromCity}
            drop city : ${toCity}
            Pickup Name : ${pickupName}
            Pickup NO : ${pickupMobile}
            Pickup address : ${pickupAddress}
            Pickup Location : ${pickupmapLink}
            Receiver Name : ${receiverName}
            Receiver Mobile : ${receiverMobile}
            Receiver Address : ${receiverAddress}
            Receiver Location : ${receivermapLink}`;


        const url =
            `https://wa.me/+91${MOBNumber}?text=${encodeURIComponent(message)}`;

        window.open(url, "_blank");
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-10">

                <div className="bg-white w-full max-w-xl shadow-xl rounded-xl p-6">

                    {/* HEADER ROUTE SELECT */}

                    <div className="grid grid-cols-2 gap-4 mb-6">



                        <select
                            value={fromCity}
                            onChange={(e) => {
                                setFromCity(e.target.value);
                                getfromCityCoordinates(e.target.value);
                            }}
                            className="border p-3 rounded-lg"
                        >
                            <option>Select City</option>
                            <option value="mysuru">Mysuru</option>
                            <option value="bengaluru">Bengaluru</option>

{/* 
                            {cities.map((city) => (
                                <option value={city} key={city}>
                                    {city}
                                </option>
                            ))} */}

                        </select>

                        <select
                            value={toCity}
                            onChange={(e) => {
                                setToCity(e.target.value);
                                getToCityCoordinates(e.target.value);
                                setStep(2)
                            }}
                            className="border p-3 rounded-lg"
                        >

                            <option>Select To City</option>
                                <option value="mysuru">Mysuru</option>
                                <option value="bengaluru">Bengaluru</option>

                            {/* {routes.map((route) => (
                                <option key={route._id} value={route.to}>
                                    {route.to}
                                </option>
                            ))} */}

                        </select> 



                    </div>

                    {/* STEP 1 without to city select */}

                    {step === 0 && (
                        <h1 className="bold "> select city  </h1>
                    )}
                    {/* STEP 2 pickup and reciver */}

                    {step === 2 && (
                        <>
                            <div className="space-y-3 border p-4 rounded-lg shadow bg-gray-50">

                                <h2 className="text-lg font-semibold">
                                    Pickup Details
                                </h2>

                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={pickupName}
                                    onChange={(e) => setPickupName(e.target.value)}
                                    className="w-full border p-3 rounded-lg"
                                    required
                                />

                                <input
                                    type="tel"
                                    placeholder="Mobile"
                                    minLength={10}
                                    maxLength={10}
                                    value={pickupMobile}
                                    onChange={(e) => setPickupMobile(e.target.value)}
                                    className="w-full border p-3 rounded-lg"
                                    required
                                />

                                <input
                                    disabled
                                    type="text"
                                    placeholder="address"
                                    value={pickupAddress}
                                    onChange={(e) => setPickupAddress(e.target.value)}
                                    className="w-full border p-3 rounded-lg"
                                />
                                   <section>

                                    <MapContainer
                                        center={pickupPosition}
                                        zoom={13}
                                        scrollWheelZoom={true}
                                        className="h-[250px] w-full"
                                    >
                                        <TileLayer
                                            attribution="OpenStreetMap"
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />

                                        <RecenterMap position={pickupPosition} />

                                        <Marker position={pickupPosition}
                                            draggable={true}
                                            eventHandlers={{
                                                dragend: (e) => {
                                                    const marker = e.target;
                                                    const newPosition = marker.getLatLng();
                                                    setPickupPosition([newPosition.lat, newPosition.lng]);

                                                    console.log("New Position:", newPosition.lat, newPosition.lng);
                                                },
                                            }}>
                                            <Popup>
                                                A pretty CSS3 popup. <br /> Easily customizable.
                                            </Popup>
                                        </Marker>

                                    </MapContainer>
                                    </section>

                            </div>

                            <div className="space-y-3 border p-4 mb-3 rounded-lg shadow bg-gray-50">

                                <h2 className="text-lg font-semibold">
                                    Receiver Details
                                </h2>

                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={receiverName}
                                    onChange={(e) => setReceiverName(e.target.value)}
                                    className="w-full border p-3 rounded-lg"
                                    required
                                />

                                <input
                                    type="tel"
                                    placeholder="Mobile"
                                    minLength={10}
                                    maxLength={10}
                                    value={receiverMobile}
                                    onChange={(e) => setReceiverMobile(e.target.value)}
                                    className="w-full border p-3 rounded-lg"
                                    required
                                />

                                <input
                                    disabled
                                    type="text"
                                    placeholder="address"
                                    value={receiverAddress}
                                    onChange={(e) => setReceiverAddress(e.target.value)}
                                    className="w-full border p-3 rounded-lg"
                                />

                                <section>

                                    <MapContainer
                                        center={reciverPosition}
                                        zoom={13}
                                        scrollWheelZoom={true}
                                        className="h-[150px] w-full"
                                    >
                                        <TileLayer
                                            attribution="OpenStreetMap"
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />

                                        <RecenterMap position={reciverPosition} />

                                        <Marker position={reciverPosition}
                                            draggable={true}
                                            eventHandlers={{
                                                dragend: (e) => {
                                                    const marker = e.target;
                                                    const newPosition = marker.getLatLng();
                                                    setreciverPosition([newPosition.lat, newPosition.lng]);

                                                    console.log("New Position:", newPosition.lat, newPosition.lng);
                                                },
                                            }}>
                                            <Popup>
                                                A pretty CSS3 popup. <br /> Easily customizable.
                                            </Popup>
                                        </Marker>

                                    </MapContainer>

                                </section>

                            </div>
                            <button
                                onClick={sendWhatsApp}
                                className="w-full mb-4 bg-indigo-600 text-white py-2 rounded-lg"
                            >
                                confirm order
                            </button>
                        </>
                    )}

                    {step === 3 && (<></>
                        // <div className="bg-white shadow-xl border rounded-xl p-6 space-y-5">

                        //     {/* HEADER */}
                        //     <div className="flex justify-between items-center">
                        //         <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        //             <Truck className="text-indigo-600" size={22} />
                        //             Parcel Summary
                        //         </h2>

                        //         <button
                        //             onClick={() => setStep(2)}
                        //             className="flex items-center gap-1 text-sm bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded-lg"
                        //         >
                        //             <Edit size={16} />
                        //             Edit
                        //         </button>
                        //     </div>

                        //     {/* PICKUP */}
                        //     <div className="bg-gray-50 rounded-lg p-4 space-y-1">

                        //         <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                        //             <MapPin size={18} className="text-green-600" />
                        //             Pickup Details
                        //         </h3>

                        //         <p className="flex items-center gap-2">
                        //             <User size={16} /> {pickupName}
                        //         </p>

                        //         <p className="flex items-center gap-2">
                        //             <Phone size={16} /> {pickupMobile}
                        //         </p>

                        //         <p className="text-sm text-gray-600">
                        //             {pickupAddress}
                        //         </p>

                        //     </div>

                        //     {/* RECEIVER */}
                        //     <div className="bg-gray-50 rounded-lg p-4 space-y-1">

                        //         <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                        //             <MapPin size={18} className="text-red-600" />
                        //             Receiver Details
                        //         </h3>

                        //         <p className="flex items-center gap-2">
                        //             <User size={16} /> {receiverName}
                        //         </p>

                        //         <p className="flex items-center gap-2">
                        //             <Phone size={16} /> {receiverMobile}
                        //         </p>

                        //         <p className="text-sm text-gray-600">
                        //             {receiverAddress}
                        //         </p>

                        //     </div>

                        //     {/* DISTANCE */}
                        //     <div className="bg-blue-50 p-4 rounded-lg text-center">

                        //         <p className="text-gray-700">
                        //             Delivery Distance
                        //         </p>

                        //         <p className="text-lg font-semibold text-blue-600">
                        //             {distanceData.totalDistance} km
                        //         </p>

                        //     </div>

                        //     {/* PRICE */}
                        //     <div className="bg-green-50 p-4 rounded-lg text-center">

                        //         <p className="text-gray-600 text-sm">
                        //             Total (Delivery + Platform + Handling)
                        //         </p>

                        //         <p className="text-3xl font-bold text-green-600">
                        //             ₹{distanceData.totalAmount}
                        //         </p>

                        //     </div>

                        //     {/* CONFIRM BUTTON */}
                        //     <button
                        //         onClick={OrderParcel}
                        //         className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
                        //     >
                        //         Confirm Parcel
                        //     </button>

                        // </div>
                    )}
                    <Footer />
                </div>
            </div>
        </>
    );
};


export default ParcelBooking;