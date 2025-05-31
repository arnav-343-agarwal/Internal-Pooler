import { requireAuth } from '@/middleware/requireAuth';
import Ride from '@/lib/models/Ride';

export async function GET(req) {
  const user = await requireAuth(req);
  if (!user) return new Response('Unauthorized', { status: 401 });

  const rides = await Ride.find({ poster: user._id }).sort({ dateTime: 1 });
  
  return Response.json({ success: true, rides });
}
