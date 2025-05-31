import { requireAuth } from '@/middleware/requireAuth';
import RideRequest from '@/lib/models/RideRequest';

export async function GET(req) {
  const user = await requireAuth(req);
  if (!user) return new Response('Unauthorized', { status: 401 });

  const requests = await RideRequest.find({ requester: user._id })
    .populate('ride', 'from to dateTime maxSeats description')
    .exec();

  return Response.json({ success: true, requests });
}
