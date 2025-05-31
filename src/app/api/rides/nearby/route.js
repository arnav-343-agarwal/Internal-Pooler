import Ride from '@/lib/models/Ride';
import dbConnect from '@/lib/dbConnect';

export async function POST(req) {
  await dbConnect();
  const { lat, lng, radiusInKm } = await req.json();

  const rides = await Ride.find({
    dateTime: { $gte: new Date() },
    'from.lat': { $exists: true },
    'from.lng': { $exists: true },
  }).lean();

  const nearbyRides = rides.filter((ride) => {
    const distance = getDistanceFromLatLonInKm(lat, lng, ride.from.lat, ride.from.lng);
    return distance <= radiusInKm;
  });

  return Response.json({ rides: nearbyRides });
}

// Simple Haversine formula
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
