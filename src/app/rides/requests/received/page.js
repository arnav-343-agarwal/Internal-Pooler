'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ReceivedRequestsPage() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/riderRequests/received', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setRequests(data.requests || []);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchRequests();
  }, []);

  const handleRespond = async (requestId, status) => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/riderRequests/respond', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ requestId, status }),
    });

    if (res.ok) {
      setRequests((prev) =>
        prev.map((r) =>
          r._id === requestId ? { ...r, status } : r
        )
      );
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Requests on My Rides</h2>
      {requests.length === 0 ? (
        <p className="text-gray-500">No requests received.</p>
      ) : (
        requests.map((req) => (
          <Card key={req._id}>
            <CardHeader>
              <p><strong>{req.sender?.name}</strong> wants to join your ride</p>
              <p>{req.ride?.from?.text} → {req.ride?.to?.text}</p>
              <p className="text-sm text-gray-500">{new Date(req.ride?.dateTime).toLocaleString()}</p>
            </CardHeader>
            <CardContent>
              <p>Status: <strong>{req.status}</strong></p>
              {req.status === 'pending' && (
                <div className="space-x-2 mt-2">
                  <Button onClick={() => handleRespond(req._id, 'accepted')}>Accept</Button>
                  <Button variant="destructive" onClick={() => handleRespond(req._id, 'rejected')}>Reject</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
