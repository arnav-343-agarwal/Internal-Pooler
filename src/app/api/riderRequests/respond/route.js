import { requireAuth } from '@/middleware/requireAuth';
import RideRequest from '@/lib/models/RideRequest';
import Ride from '@/lib/models/Ride';

export async function POST(req) {
  const user = await requireAuth(req);
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { requestId, action } = await req.json(); // action = 'approve' or 'reject'

  if (!['approve', 'reject'].includes(action)) {
    return new Response('Invalid action', { status: 400 });
  }

  const rideRequest = await RideRequest.findById(requestId);
  if (!rideRequest) return new Response('Request not found', { status: 404 });

  const ride = await Ride.findById(rideRequest.ride);
  if (!ride) return new Response('Ride not found', { status: 404 });

  // Only poster can respond
  if (ride.poster.toString() !== user._id.toString()) {
    return new Response('Not authorized', { status: 403 });
  }

  if (rideRequest.status !== 'pending') {
    return new Response('Request already responded', { status: 400 });
  }

  rideRequest.status = action === 'approve' ? 'approved' : 'rejected';
  await rideRequest.save();

  return Response.json({ success: true, rideRequest });
}
