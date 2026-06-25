import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../context/supabaseClient";
import { UserAuth } from "../context/AuthContext";
import Layout from "../component/Layout";
import {
  ArrowLeft,
  MapPin,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Truck,
} from "lucide-react";

export default function Tracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { session, userRole } = UserAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Leaflet references
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // 1. Fetch order details on mount
  useEffect(() => {
    if (!session) {
      navigate("/login");
      return;
    }

    const fetchOrder = async () => {
      try {
        const { data, error: err } = await supabase
          .from("orders")
          .select(
            `
            id,
            status,
            total,
            delivery_address,
            user_id,
            dispatcher_id,
            dispatcher_lat,
            dispatcher_lng,
            created_at
          `,
          )
          .eq("id", orderId)
          .single();

        if (err) {
          setError("Failed to fetch order details.");
          setLoading(false);
          return;
        }

        // Security check: Only the buyer of this order should be allowed to track it
        if (data.user_id !== session.user.id || userRole !== "buyer") {
          setError(
            "Access Denied. Live tracking is only available in the buyer's account.",
          );
          setLoading(false);
          return;
        }

        setOrder(data);
        setLoading(false);
      } catch (ex) {
        setError("An unexpected error occurred.");
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, session, userRole, navigate]);

  // 2. Real-time subscription to order updates
  useEffect(() => {
    if (!orderId || !session) return;

    const channel = supabase
      .channel(`order_tracking_${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          console.log("Realtime order update received:", payload.new);
          setOrder((prev) =>
            prev ? { ...prev, ...payload.new } : payload.new,
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, session]);

  // 3. Load Leaflet library dynamically
  useEffect(() => {
    if (leafletLoaded) return;

    // Load Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => {
      setLeafletLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      // Clean up tags on unmount if needed
    };
  }, [leafletLoaded]);

  // 4. Initialize or update map when coordinates change
  useEffect(() => {
    if (!leafletLoaded || !order || !mapContainerRef.current) return;

    const lat = order.dispatcher_lat ? parseFloat(order.dispatcher_lat) : null;
    const lng = order.dispatcher_lng ? parseFloat(order.dispatcher_lng) : null;

    if (lat === null || lng === null) {
      // Coordinates not yet available, don't display marker yet
      return;
    }

    if (!mapRef.current) {
      // First-time map initialization
      const L = window.L;
      const initialMap = L.map(mapContainerRef.current).setView([lat, lng], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(initialMap);

      // Custom Courier Icon
      const courierIcon = L.divIcon({
        className: "custom-courier-icon",
        html: `
          <div class="flex items-center justify-center w-10 h-10 bg-[#F24E05] text-white rounded-full shadow-lg border-2 border-white animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="2" ry="2"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const initialMarker = L.marker([lat, lng], { icon: courierIcon }).addTo(
        initialMap,
      );
      initialMarker
        .bindPopup("<strong>Courier Location</strong><br/>Out for Delivery")
        .openPopup();

      mapRef.current = initialMap;
      markerRef.current = initialMarker;
    } else {
      // Update existing marker and pan view
      const L = window.L;
      const newPos = new L.LatLng(lat, lng);
      markerRef.current.setLatLng(newPos);
      mapRef.current.panTo(newPos);
    }
  }, [leafletLoaded, order]);

  // Clean UI helper
  const displayOrderId = (id) => {
    if (!id) return "";
    return id.startsWith("ORD-") ? id : `ORD-${id.slice(0, 8).toUpperCase()}`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDF5ED] text-gray-800">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F24E05] mb-4"></div>
          <p className="font-semibold text-gray-500">
            Initializing Live Maps...
          </p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDF5ED] px-6 text-center text-gray-800">
          <AlertCircle className="text-red-500 mb-4" size={56} />
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Access Restricted
          </h1>
          <p className="text-gray-500 mt-2 max-w-md">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 rounded-full bg-gray-900 text-white px-6 py-3 font-semibold text-sm transition-all hover:bg-black cursor-pointer flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Return to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  const isDeliveryActive = order.status === "Out for Delivery";
  const hasCoordinates = order.dispatcher_lat && order.dispatcher_lng;

  return (
    <Layout>
      <div className="py-24 min-h-screen bg-[#FDF5ED] px-4 sm:px-6 md:px-10 lg:px-20 text-gray-800">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-black transition cursor-pointer"
            >
              <ArrowLeft size={18} /> Back to Orders
            </button>
            <span
              className={`rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider ${
                order.status === "Out for Delivery"
                  ? "bg-indigo-100 text-indigo-800 animate-pulse"
                  : order.status === "Completed"
                    ? "bg-green-100 text-green-800"
                    : order.status === "Cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
              }`}
            >
              {order.status === "Out for Delivery"
                ? "Courier On the Way"
                : order.status}
            </span>
          </div>

          {/* Tracking Card Details */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-black/[0.03] space-y-6">
            {/* ID & Address summary */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-5">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Tracking Order
                </p>
                <h2 className="text-xl font-extrabold text-gray-900 mt-1">
                  {displayOrderId(order.id)}
                </h2>
              </div>
              <div className="flex items-start gap-2.5 max-w-sm">
                <MapPin size={18} className="text-[#F24E05] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Delivery Destination
                  </p>
                  <p className="text-sm font-semibold text-gray-700 mt-0.5">
                    {order.deliveryAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Map Container Block */}
            <div className="relative rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 h-[400px] w-full flex items-center justify-center">
              {/* Map Mount Target */}
              {isDeliveryActive && hasCoordinates ? (
                <div ref={mapContainerRef} className="w-full h-full z-10" />
              ) : (
                <div className="text-center p-8 flex flex-col items-center max-w-md z-20">
                  {order.status === "Completed" ? (
                    <>
                      <CheckCircle2 size={56} className="text-green-500 mb-3" />
                      <h3 className="text-lg font-bold text-gray-900">
                        Delivery Completed!
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        This shipment has been marked successful by the courier
                        user.
                      </p>
                    </>
                  ) : order.status === "Cancelled" ? (
                    <>
                      <XCircle size={56} className="text-red-500 mb-3" />
                      <h3 className="text-lg font-bold text-gray-900">
                        Delivery Cancelled
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        This order was cancelled by the shop or customer.
                      </p>
                    </>
                  ) : !hasCoordinates ? (
                    <>
                      <Truck
                        size={56}
                        className="text-indigo-400 mb-3 animate-bounce"
                      />
                      <h3 className="text-lg font-bold text-gray-900">
                        Awaiting Courier Location Coordinates
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        The logistics rider has accepted the order and is on
                        their way. Location signals will stream live shortly.
                      </p>
                    </>
                  ) : (
                    <>
                      <Clock size={56} className="text-yellow-500 mb-3" />
                      <h3 className="text-lg font-bold text-gray-900">
                        Preparing Order
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        The vendor is currently preparing your meal. Real-time
                        maps will activate once dispatcher claims the shipment.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Status Footer Banner */}
            {isDeliveryActive && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4.5 flex gap-3.5 items-start">
                <Truck className="text-indigo-600 mt-0.5 shrink-0" size={20} />
                <div className="text-xs font-semibold text-indigo-900 leading-relaxed">
                  <strong>Courier Dispatch Alert:</strong> The logistics user is
                  active. Position updates are streaming directly from their GPS
                  sensor. Leave this page open to watch the map marker move
                  live.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
