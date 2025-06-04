"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RidesPage() {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    async function fetchRides() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/rides/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch rides");
        }

        const data = await res.json();
        setRides(data.rides || []);
      } catch (err) {
        console.error("Error fetching rides:", err);
        setRides([]);
      }
    }

    fetchRides();
  }, []);

  const handleRequest = async (rideId) => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/riderRequests/create", {
      method: "POST",
      body: JSON.stringify({ rideId }),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      alert("Request sent!");
      setRides((prev) => prev.filter((r) => r._id !== rideId));
    } else {
      alert("Error sending request.");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Available Rides</h1>
      {rides.map((ride) => (
        <Card key={ride._id}>
          <CardHeader>
            {ride.from?.text} → {ride.to?.text} (
            {new Date(ride.dateTime).toLocaleString()})
          </CardHeader>
          <CardContent>
            <p>Posted by: {ride.poster?.name || "Unknown"}</p>
            <p>{ride.description}</p>
            <p className="text-sm text-gray-500">
              Max Seats: {ride.maxSeats} | Available Seats:{" "}
              {ride.availableSeats}
            </p>
            <Button onClick={() => handleRequest(ride._id)}>
              Request to Join
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
