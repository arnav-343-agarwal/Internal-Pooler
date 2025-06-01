import { requireAuth } from '@/middleware/requireAuth';
import RideRequest from '@/lib/models/RideRequest';

export async function GET(req) {
  const user = await requireAuth(req);
  if (!user) return new Response('Unauthorized', { status: 401 });

  // Find requests where the ride's poster is the user
  const requests = await RideRequest.find({
    status: 'pending'
  })
    .populate({
      path: 'ride',
      match: { poster: user._id },
      select: 'from to dateTime maxSeats description',
    })
    .populate('requester', 'name email')
    .exec();

  // Filter out requests where ride is null (not posted by this user)
  const filtered = requests.filter(r => r.ride !== null);
  // console.log(filtered)
  return Response.json({ success: true, requests: filtered });
}
