import { requireAuth } from '@/middleware/requireAuth';
import Ride from '@/lib/models/Ride';
import RideRequest from '@/lib/models/RideRequest';

export async function GET(req) {
  const user = await requireAuth(req);
  if (!user) return new Response('Unauthorized', { status: 401 });

  const posted = await Ride.find({ poster: user._id }).sort({ dateTime: 1 });

  // Add availableSeats dynamically
  const postedWithAvailability = posted.map(ride => ({
    ...ride.toObject(),
    availableSeats: ride.maxSeats - (ride.joinedUsers?.length || 0)
  }));

  const rideRequests = await RideRequest.find({ 
    requester: user._id, 
    status: 'accepted' // ✅ Only approved join requests
  }).populate('ride');

  const joined = rideRequests.map(req => req.ride);

  return Response.json({ posted: postedWithAvailability, joined });
}
