"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [postedRides, setPostedRides] = useState([]);
  const [joinedRides, setJoinedRides] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      const userRes = await fetch("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();
      setUser(userData);

      const ridesRes = await fetch("/api/rides/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(ridesRes);
      const ridesData = await ridesRes.json();
      setPostedRides(ridesData.posted || []);
      setJoinedRides(ridesData.joined || []);

      const reqRes = await fetch("/api/riderRequests/received", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const requestsData = await reqRes.json();
      // console.log(requestsData)
      setReceivedRequests(requestsData.requests || []);
    };

    fetchData();
  }, []);

  const handleRespond = async (requestId, status) => {
    const token = localStorage.getItem("token");
    const action = status === "approved" ? "approve" : "reject";

    const res = await fetch("/api/riderRequests/respond", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ requestId, action }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Failed to respond:", err);
      return;
    }

    // Optimistically remove from UI
    const newReqs = receivedRequests.filter((r) => r._id !== requestId);
    setReceivedRequests(newReqs);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Welcome, {user?.name}</h1>

      <Button
        className="bg-blue-600 text-white"
        onClick={() => router.push("/post-ride")}
      >
        + Create New Ride
      </Button>

      {/* Posted Rides Section */}
      <section>
        <h2 className="text-xl font-medium mb-2">Your Posted Rides</h2>
        <div className="grid gap-4">
          {postedRides.map((ride) => (
            <Card key={ride._id}>
              <CardHeader>
                {(ride.from?.text || ride.from) ?? "Unknown"} →{" "}
                {(ride.to?.text || ride.to) ?? "Unknown"} (
                {new Date(ride.dateTime).toLocaleString()})
              </CardHeader>

              <CardContent>
                <p>{ride.description}</p>
                <p className="text-sm text-gray-500">
                  Max Seats: {ride.maxSeats} | Available: {ride.availableSeats}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Received Requests */}
      <section>
        <h2 className="text-xl font-medium mb-2">
          Join Requests for Your Rides
        </h2>
        {receivedRequests.length === 0 ? (
          <p className="text-sm text-muted-foreground">No new requests</p>
        ) : (
          receivedRequests.map((req) => (
            <Card
              key={req._id}
              className="flex justify-between items-center p-4"
            >
              <div>
                <p>
                  <strong>{req.requester?.name ?? "Unknown User"}</strong>{" "}
                  requested to join ride: : {req.ride?.from?.text ?? "?"} →{" "}
                  {req.ride?.to?.text ?? "?"}
                </p>
              </div>
              <div className="space-x-2">
                <Button onClick={() => handleRespond(req._id, "approved")}>
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleRespond(req._id, "rejected")}
                >
                  Reject
                </Button>
              </div>
            </Card>
          ))
        )}
      </section>

      {/* Joined Rides */}
      <section>
        <h2 className="text-xl font-medium mb-2">Rides You Joined</h2>
        <div className="grid gap-4">
          {joinedRides.map((ride) => (
            <Card key={ride._id}>
              <CardHeader>
                {(ride.from?.text || ride.from) ?? "Unknown"} →{" "}
                {(ride.to?.text || ride.to) ?? "Unknown"} (
                {new Date(ride.dateTime).toLocaleString()})
              </CardHeader>

              <CardContent>
                <p>{ride.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
