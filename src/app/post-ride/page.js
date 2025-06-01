"use client";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PostRidePage() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
    // else console.log(token)
  }, []);
  const router = useRouter();
  const [form, setForm] = useState({
    from: "",
    to: "",
    dateTime: "",
    maxSeats: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/rides/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Post a New Ride</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="from"
              placeholder="From"
              value={form.from}
              onChange={handleChange}
              required
            />
            <Input
              name="to"
              placeholder="To"
              value={form.to}
              onChange={handleChange}
              required
            />
            <Input
              name="dateTime"
              type="datetime-local"
              value={form.dateTime}
              onChange={handleChange}
              required
            />
            <Input
              name="maxSeats"
              type="number"
              placeholder="Max Seats"
              value={form.maxSeats}
              onChange={handleChange}
              required
            />
            <Textarea
              name="description"
              placeholder="Optional Description"
              value={form.description}
              onChange={handleChange}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" disabled={loading}>
              {loading ? "Posting..." : "Post Ride"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
