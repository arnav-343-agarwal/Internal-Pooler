import { requireAuth } from '@/middleware/requireAuth';
import RideRequest from '@/lib/models/RideRequest';
import Ride from '@/lib/models/Ride';

export async function POST(req) {
  const user = await requireAuth(req);
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { requestId, action } = await req.json();

  if (!['approve', 'reject'].includes(action)) {
    return new Response('Invalid action', { status: 400 });
  }

  const rideRequest = await RideRequest.findById(requestId);
  if (!rideRequest) return new Response('Request not found', { status: 404 });

  const ride = await Ride.findById(rideRequest.ride);
  if (!ride) return new Response('Ride not found', { status: 404 });

  if (ride.poster.toString() !== user._id.toString()) {
    return new Response('Not authorized', { status: 403 });
  }

  if (rideRequest.status !== 'pending') {
    return new Response('Request already responded', { status: 400 });
  }

  // Set and save status
  rideRequest.status = action === 'approve' ? 'accepted' : 'rejected';

  try {
    await rideRequest.save(); // ✅ This must succeed
    console.log(`RideRequest ${requestId} status updated to ${rideRequest.status}`);
  } catch (err) {
    console.error('Error saving RideRequest status:', err);
    return new Response('Failed to save request status', { status: 500 });
  }

  if (action === 'approve') {
    if (ride.joinedUsers.length >= ride.maxSeats) {
      return new Response('No seats available', { status: 400 });
    }

    if (!ride.joinedUsers.includes(rideRequest.requester)) {
      ride.joinedUsers.push(rideRequest.requester);
      try {
        await ride.save(); // ✅ Save the ride after updating
        console.log(`User ${rideRequest.requester} added to joinedUsers`);
      } catch (err) {
        console.error('Error saving ride:', err);
        return new Response('Failed to update ride', { status: 500 });
      }
    }
  }

  return Response.json({ success: true, rideRequest });
}
