"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SentRequestsPage() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/riderRequests/sent", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch requests");
        const data = await res.json();
        setRequests(data.requests || []);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchRequests();
  }, []);

  const getStatusBadge = (status) => {
    const normalized = status?.toLowerCase();

    switch (normalized) {
      case "accepted":
        return <Badge className="bg-green-600 text-white">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-600 text-white">Rejected</Badge>;
      case "pending":
      default:
        return <Badge className="bg-yellow-500 text-black">Pending</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">My Join Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-500">No join requests sent.</p>
      ) : (
        requests.map((req) => (
          <Card
            key={req._id}
            className="border border-muted-foreground/10 shadow-sm"
          >
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {req.ride?.from?.text} → {req.ride?.to?.text}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(req.ride?.dateTime).toLocaleString()}
                  </p>
                </div>
                <div>{getStatusBadge(req.status)}</div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {req.ride?.description || "No description"}
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
