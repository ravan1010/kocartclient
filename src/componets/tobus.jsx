import React, { useState, useEffect } from "react";
// import api from "../api";
import Navbar from "./navbar";
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
            center.lat.toFixed(6) !== position[0].toFixed(6) ||
            center.lng.toFixed(6) !== position[1].toFixed(6)
        ) {
            map.setView(position, map.getZoom());
        }
    }, [position]);

    return null;
}


const ParcelBus = () => {

    const [fromCity, setFromCity] = useState("");

    const [pickupName, setPickupName] = useState("");
    const [pickupMobile, setPickupMobile] = useState("");
    const [pickupAddress, setPickupAddress] = useState("");
    const [busRoute, setBusRoute] = useState("");
    const [MOBNumber, setMOBNumber] = useState("")

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

    const sendWhatsApp = () => {

        if (!pickupPosition || !busRoute || !pickupName || !pickupMobile || !pickupAddress) {
            alert("Select pickup and enter drop");
            return;
        }

        const mapLink = `https://www.google.com/maps?q=${pickupPosition[0]},${pickupPosition[1]}`;

        const message =
            `Parcel Order
            Pickup Name : ${pickupName}
            Pickup NO : ${pickupMobile}
            Pickup address : ${pickupAddress}
            Pickup Location : ${mapLink}
            Drop Bus Route : ${busRoute}`;

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

                                <input
                                    type="text"
                                    placeholder="busRoute"
                                    value={busRoute}
                                    onChange={(e) => setBusRoute(e.target.value)}
                                    className="w-full border p-3 rounded-lg"
                                    required
                                />

                                <button className="w-full mb-4 bg-indigo-600 text-white py-2 rounded-lg"
                                    onClick={sendWhatsApp} >Confirm</button>

                            </div>

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


export default ParcelBus;