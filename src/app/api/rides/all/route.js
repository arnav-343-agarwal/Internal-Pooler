import { requireAuth } from "@/middleware/requireAuth";
import Ride from "@/lib/models/Ride";
import RideRequest from "@/lib/models/RideRequest";

export async function GET(req) {
  const user = await requireAuth(req);
  if (!user) return new Response("Unauthorized", { status: 401 });

  // Get ride IDs the user has already requested
  const requestedRideIds = await RideRequest.find({
    requester: user._id,
  }).distinct("ride");

  // Get rides not created by the user and not already requested
  const rides = await Ride.find({
    poster: { $ne: user._id },
    _id: { $nin: requestedRideIds },
  }).populate("poster");

  // For each ride, calculate number of accepted requests
  const ridesWithAvailability = await Promise.all(
    rides.map(async (ride) => {
      const acceptedCount = await RideRequest.countDocuments({
        ride: ride._id,
        status: "accepted", // or "approved" if that's your updated enum
      });

      return {
        ...ride.toObject(),
        availableSeats: ride.maxSeats - acceptedCount,
      };
    })
  );

  return Response.json({ success: true, rides: ridesWithAvailability });
}
