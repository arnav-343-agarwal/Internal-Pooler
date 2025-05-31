import { requireAuth } from '@/middleware/requireAuth';
import Ride from '@/lib/models/Ride';
import RideRequest from '@/lib/models/RideRequest';

export async function POST(req) {
  const user = await requireAuth(req);
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { rideId, message } = await req.json();

  // Check ride exists
  const ride = await Ride.findById(rideId);
  if (!ride) return new Response('Ride not found', { status: 404 });

  // Prevent user from requesting own ride
  if (ride.poster.toString() === user._id.toString()) {
    return new Response('Cannot request to join your own ride', { status: 400 });
  }

  // Create request
  const rideRequest = await RideRequest.create({
    ride: ride._id,
    requester: user._id,
    message: message || '',
    status: 'pending',
  });

  // Add request to ride.requests
  ride.requests.push(rideRequest._id);
  await ride.save();

  return Response.json({ success: true, rideRequest });
}
