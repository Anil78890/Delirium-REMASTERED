
import { useEffect, useState } from "react";
import L from "leaflet";
import {
    MapContainer,
    Marker,
    TileLayer,
    useMap,
    useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

export type DeliveryLocation = {
    latitude: number;
    longitude: number;
    address: string;
};

type DeliveryLocationMapProps = {
    initialPosition?: {
        latitude: number;
        longitude: number;
    } | null;
    onLocationSelect: (location: DeliveryLocation) => void;
};

type Coordinates = {
    latitude: number;
    longitude: number;
};

const RESTAURANT_POSITION: Coordinates = {
    latitude: 22.503053546678277,
    longitude: 88.36097805582347,
};

const markerIcon = L.divIcon({
    className: "delivery-map-marker-wrapper",
    html: '<div class="delivery-map-marker"></div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

async function reverseGeocode(
    latitude: number,
    longitude: number,
): Promise<string> {
    const params = new URLSearchParams({
        format: "jsonv2",
        lat: String(latitude),
        lon: String(longitude),
        addressdetails: "1",
    });

    const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
        {
            headers: {
                Accept: "application/json",
            },
        },
    );

    if (!response.ok) {
        throw new Error("Unable to find the address for this location.");
    }

    const data: { display_name?: string } = await response.json();

    if (!data.display_name) {
        throw new Error("No readable address was found. Try another location.");
    }

    return data.display_name;
}

function MapClickHandler({
    onMapClick,
}: {
    onMapClick: (position: Coordinates) => void;
}) {
    useMapEvents({
        click(event) {
            onMapClick({
                latitude: event.latlng.lat,
                longitude: event.latlng.lng,
            });
        },
    });

    return null;
}

function MapCenterUpdater({ position }: { position: Coordinates }) {
    const map = useMap();

    useEffect(() => {
        map.flyTo([position.latitude, position.longitude], 16);
    }, [map, position.latitude, position.longitude]);

    return null;
}

export default function DeliveryLocationMap({
    initialPosition,
    onLocationSelect,
}: DeliveryLocationMapProps) {
    const [position, setPosition] = useState<Coordinates>(
        initialPosition ?? RESTAURANT_POSITION,
    );


    
useEffect(() => {
    // When editing a saved address, use its coordinates instead of GPS.
    if (initialPosition) return;

    if (!navigator.geolocation) {
        setError(
            "Location detection is unavailable. Search for an address or select a point on the map.",
        );
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (result) => {
            const currentPosition: Coordinates = {
                latitude: result.coords.latitude,
                longitude: result.coords.longitude,
            };

            setPosition(currentPosition);
            void selectPosition(currentPosition);
        },
        (locationError) => {
            if (locationError.code === locationError.PERMISSION_DENIED) {
                setError(
                    "Location permission was denied. You can still search or select a point on the map.",
                );
            } else {
                setError(
                    "Couldn't detect your current location. You can still search or select a point on the map.",
                );
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0,
        },
    );
}, [initialPosition?.latitude, initialPosition?.longitude]);




    const [searchQuery, setSearchQuery] = useState("");
    const [address, setAddress] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [isResolvingAddress, setIsResolvingAddress] = useState(false);
    const [error, setError] = useState("");

   

    async function selectPosition(nextPosition: Coordinates) {
        setPosition(nextPosition);
        setError("");
        setIsResolvingAddress(true);

        try {
            const readableAddress = await reverseGeocode(
                nextPosition.latitude,
                nextPosition.longitude,
            );

            setAddress(readableAddress);

            onLocationSelect({
                ...nextPosition,
                address: readableAddress,
            });
        } catch (err) {
            setAddress("");
            setError(
                err instanceof Error
                    ? err.message
                    : "Could not find this address. Please try again.",
            );
        } finally {
            setIsResolvingAddress(false);
        }
    }

    async function handleSearch() {
        const query = searchQuery.trim();

        if (!query) {
            setError("Enter an address or place to search.");
            return;
        }

        setIsSearching(true);
        setError("");

        try {
            const params = new URLSearchParams({
                format: "jsonv2",
                q: query,
                limit: "1",
                countrycodes: "in",
            });

            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?${params.toString()}`,
                {
                    headers: {
                        Accept: "application/json",
                    },
                },
            );

            if (!response.ok) {
                throw new Error("Address search failed. Please try again.");
            }

            const results: Array<{ lat: string; lon: string }> =
                await response.json();

            if (results.length === 0) {
                throw new Error(
                    "No matching place found. Try a nearby landmark or street.",
                );
            }

            const resultPosition: Coordinates = {
                latitude: Number(results[0].lat),
                longitude: Number(results[0].lon),
            };

            await selectPosition(resultPosition);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Could not search for that address.",
            );
        } finally {
            setIsSearching(false);
        }
    }

    return (
        <section className="delivery-map">
            <div className="delivery-map__heading">
                <h3>Choose your delivery location</h3>
                <p>
                    Search for a place, or click the map to position the pin
                    where you want your order delivered.
                </p>
            </div>

          

<div className="delivery-map__search">
    <input
        type="search"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="Search area, street, landmark..."
        aria-label="Search delivery location"
        onKeyDown={(event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                void handleSearch();
            }
        }}
    />

    <button
        type="button"
        disabled={isSearching || isResolvingAddress}
        onClick={() => void handleSearch()}
    >
        {isSearching ? "Searching..." : "Search"}
    </button>
</div>



            <div className="delivery-map__canvas">
                <MapContainer
                    center={[position.latitude, position.longitude]}
                    zoom={15}
                    scrollWheelZoom
                    className="delivery-map__leaflet"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapClickHandler
                        onMapClick={(nextPosition) => {
                            void selectPosition(nextPosition);
                        }}
                    />

                    <MapCenterUpdater position={position} />

                    <Marker
                        position={[position.latitude, position.longitude]}
                        icon={markerIcon}
                        draggable
                        eventHandlers={{
                            dragend(event) {
                                const marker = event.target as L.Marker;
                                const latLng = marker.getLatLng();

                                void selectPosition({
                                    latitude: latLng.lat,
                                    longitude: latLng.lng,
                                });
                            },
                        }}
                    />
                </MapContainer>
            </div>

            <div className="delivery-map__result" aria-live="polite">
                {isResolvingAddress ? (
                    <p>Finding the address for your selected pin...</p>
                ) : address ? (
                    <>
                        <strong>Selected address</strong>
                        <p>{address}</p>
                        <small>
                            {position.latitude.toFixed(6)},{" "}
                            {position.longitude.toFixed(6)}
                        </small>
                    </>
                ) : (
                    <p>Select a point on the map to find its address.</p>
                )}

                {error && (
                    <p className="delivery-map__error" role="alert">
                        {error}
                    </p>
                )}
            </div>
        </section>
    );
}
