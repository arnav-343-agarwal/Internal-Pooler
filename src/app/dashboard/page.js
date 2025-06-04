"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserIcon, UsersIcon, CarIcon } from "lucide-react";

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
      setUser(await userRes.json());

      const ridesRes = await fetch("/api/rides/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ridesData = await ridesRes.json();
      setPostedRides(ridesData.posted || []);
      setJoinedRides(ridesData.joined || []);

      const reqRes = await fetch("/api/riderRequests/received", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const requestsData = await reqRes.json();
      setReceivedRequests(requestsData.requests || []);
    };

    fetchData();
  }, []);

  const handleRespond = async (requestId, status) => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/riderRequests/respond", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ requestId, action: status }),
    });

    if (!res.ok) {
      console.error("Failed to respond:", await res.text());
      return;
    }

    setReceivedRequests(prev => prev.filter(r => r._id !== requestId));
  };

  return (
    <div className="p-6 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
        <Button onClick={() => router.push("/post-ride")}>+ Post New Ride</Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex items-center gap-2">
            <CarIcon className="w-5 h-5 text-blue-600" />
            <CardTitle>Posted Rides</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{postedRides.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-green-600" />
            <CardTitle>Joined Rides</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{joinedRides.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-orange-600" />
            <CardTitle>Join Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{receivedRequests.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Posted Rides */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Your Posted Rides</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {postedRides.map((ride) => (
            <Card key={ride._id}>
              <CardHeader>
                <CardTitle>{ride.from?.text} → {ride.to?.text}</CardTitle>
                <CardDescription>{new Date(ride.dateTime).toLocaleString()}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>{ride.description}</p>
                <p className="text-sm text-muted-foreground">
                  Seats: {ride.maxSeats} | Available: {ride.availableSeats ?? "?"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Join Requests */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Join Requests for Your Rides</h2>
        {receivedRequests.length === 0 ? (
          <p className="text-sm text-muted-foreground">No new requests</p>
        ) : (
          <div className="space-y-4">
            {receivedRequests.map((req) => (
              <Card key={req._id}>
                <CardContent className="flex justify-between items-center py-4">
                  <div>
                    <p className="font-medium">
                      {req.requester?.name ?? "Unknown User"} requested to join:
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {req.ride?.from?.text} → {req.ride?.to?.text}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button onClick={() => handleRespond(req._id, "approved")}>Approve</Button>
                    <Button variant="destructive" onClick={() => handleRespond(req._id, "rejected")}>
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Joined Rides */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Rides You Joined</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {joinedRides.map((ride) => (
            <Card key={ride._id}>
              <CardHeader>
                <CardTitle>{ride.from?.text} → {ride.to?.text}</CardTitle>
                <CardDescription>{new Date(ride.dateTime).toLocaleString()}</CardDescription>
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
