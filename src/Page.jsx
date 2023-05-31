import React, { useEffect, useState } from "react";
import arrow from "./images/icon-arrow.svg";
import background from "./images/pattern-bg-desktop.png";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import Markerposition from "./Markerposition";

const Page = () => {
  const [address, setAddress] = useState(null);
  const [ipAddress, setIpAddress] = useState("");
  const [checkIp, setCheckIp] = useState([])
  const checkIpAddress =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
  const checkDomain =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;

  useEffect(() => {
    try {
      const getInitialData = async () => {
        const res = await fetch(
          `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_4GYgT2EuML7q83x6aWh5c6rjMecIU&ipAddress=${checkIp}`
        );
        const data = await res.json();
        setAddress(data);
        console.log(data);
      };
      getInitialData();
    } catch (error) {
      console.trace(error);
    }
  }, []);

  const getEnteredAddress = async () => {
    const res = await fetch(
      `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_umObrfd1Zel30OHcak8KgPnMjK5oq&${
        checkIpAddress.test(ipAddress)
          ? `ipAddress=${ipAddress}`
          : checkDomain.test(ipAddress)
          ? `domain=${ipAddress}`
          : ""
      }`
    );
    const data = await res.json();
    setAddress(data);
    console.log(data);
  };

  return (
    <section>
      <div className="absolute -z-10">
        <img className="w-full h-80 object-cover" src={background} alt="" />
      </div>
      <article className="p-8">
        <h1 className="text-2xl lg:text-3xl text-center text-white font-bold mb-8">
          IP Address Tracker
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            getEnteredAddress();
            setIpAddress("");
            setCheckIp(e.target.value)
          }}
          autoComplete="off"
          className="flex justify-center max-w-xl mx-auto"
        >
          <input
            type="text"
            name="ipaddress"
            id="ipaddress"
            placeholder="Search for any IP Address or domain"
            required
            className="py-2 px-4 rounded-l-lg w-full outline-none"
            value={ipAddress}
            onChange={(e) => {
              setIpAddress(e.target.value);
            }}
          />
          <button
            className="bg-black py-4 px-4 hover:opacity-60 rounded-r-lg"
            type="submit"
          >
            <img src={arrow} alt="" />{" "}
          </button>
        </form>
      </article>
      {address && (
        <>
          <article
            className="bg-white rounded-lg shadow p-8 mx-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl xl:mx-auto text-center md:text-left lg:-mb-16 relative"
            style={{ zIndex: "500" }}
          >
            <div className="lg:border-r lg:border-slate-400">
              <h2 className="uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">
                IP Address
              </h2>
              <p className="font-semibold text-slate-900 text-lg md:text-2xl xl:text-2xl">
                {address.ip}
              </p>
            </div>
            <div className="lg:border-r lg:border-slate-400">
              <h2 className="uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">
                Location
              </h2>
              <p className="font-semibold text-slate-900 text-lg md:text-2xl xl:text-2xl">
                {address.location.city}, {address.location.region}
              </p>
            </div>
            <div className="lg:border-r lg:border-slate-400">
              <h2 className="uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">
                timezone
              </h2>
              <p className="font-semibold text-slate-900 text-lg md:text-2xl xl:text-2xl">
                UTC {address.location.timezone}
              </p>
            </div>
            <div className="">
              <h2 className="uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">
                isp
              </h2>
              <p className="font-semibold text-slate-900 text-lg md:text-2xl xl:text-2xl">
                {address.isp}
              </p>
            </div>
          </article>

          <MapContainer
            center={[address.location.lat, address.location.lng]}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "100vh", width: "100vw" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Markerposition address={address} />
          </MapContainer>
        </>
      )}
    </section>
  );
};

export default Page;
