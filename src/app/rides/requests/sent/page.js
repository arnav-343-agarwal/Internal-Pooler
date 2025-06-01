'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function SentRequestsPage() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/riderRequests/sent', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch requests');
        const data = await res.json();
        setRequests(data.requests || []);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">My Join Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-500">No join requests sent.</p>
      ) : (
        requests.map((req) => (
          <Card key={req._id}>
            <CardHeader>
              <p className="font-medium">{req.ride?.from?.text} → {req.ride?.to?.text}</p>
              <p className="text-sm text-gray-500">
                {new Date(req.ride?.dateTime).toLocaleString()}
              </p>
            </CardHeader>
            <CardContent>
              <p>Status: <strong>{req.status}</strong></p>
              <p>Description: {req.ride?.description || "No description"}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
