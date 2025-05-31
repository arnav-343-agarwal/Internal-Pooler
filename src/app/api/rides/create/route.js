import { requireAuth } from '@/middleware/requireAuth';
import Ride from '@/lib/models/Ride';

export async function POST(req) {
  const user = await requireAuth(req);
  if (!user) return new Response('Unauthorized', { status: 401 });

  const body = await req.json();

  const ride = await Ride.create({
    poster: user._id,
    from: {
      text: body.from.text,
      lat: body.from.lat,
      lng: body.from.lng,
    },
    to: {
      text: body.to.text,
      lat: body.to.lat,
      lng: body.to.lng,
    },
    dateTime: new Date(body.dateTime),
    maxSeats: body.maxSeats,
    description: body.description || '',
  });

  return Response.json({ success: true, ride });
}
