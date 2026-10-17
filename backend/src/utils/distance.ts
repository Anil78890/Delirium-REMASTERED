
const EARTH_RADIUS_KM = 6371;

type Coordinates = {
    latitude: number;
    longitude: number;
};

export function calculateDistanceKm(
    pointA: Coordinates,
    pointB: Coordinates,
): number {
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

    const latitudeDifference = toRadians(
        pointB.latitude - pointA.latitude,
    );

    const longitudeDifference = toRadians(
        pointB.longitude - pointA.longitude,
    );

    const latitudeA = toRadians(pointA.latitude);
    const latitudeB = toRadians(pointB.latitude);

    const haversine =
        Math.sin(latitudeDifference / 2) ** 2 +
        Math.cos(latitudeA) *
            Math.cos(latitudeB) *
            Math.sin(longitudeDifference / 2) ** 2;

    const centralAngle =
        2 * Math.atan2(
            Math.sqrt(haversine),
            Math.sqrt(1 - haversine),
        );

    return EARTH_RADIUS_KM * centralAngle;
}
