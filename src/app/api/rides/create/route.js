import { requireAuth } from "@/middleware/requireAuth";
import Ride from "@/lib/models/Ride";

export async function POST(req) {
  const user = await requireAuth(req);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();

  const ride = await Ride.create({
    poster: user._id,
    from: {
      text: body.from,
      lat: null,
      lng: null,
    },
    to: {
      text: body.to,
      lat: null,
      lng: null,
    },
    dateTime: new Date(body.dateTime),
    maxSeats: body.maxSeats,
    description: body.description || "",
  });

  return Response.json({ success: true, ride });
}
