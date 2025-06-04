"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";

export default function PostRidePage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [form, setForm] = useState({
    from: "",
    to: "",
    dateTime: "",
    maxSeats: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) router.push("/login");
    setToken(t);
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/rides/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      toast.success("Ride posted successfully!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Post a New Ride</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="from">From</Label>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-gray-500" />
                <Input name="from" placeholder="Origin location" value={form.from} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-gray-500" />
                <Input name="to" placeholder="Destination" value={form.to} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label htmlFor="dateTime">Date & Time</Label>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-gray-500" />
                <Input type="datetime-local" name="dateTime" value={form.dateTime} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label htmlFor="maxSeats">Max Seats</Label>
              <div className="flex items-center gap-2">
                <UsersIcon className="w-5 h-5 text-gray-500" />
                <Input type="number" name="maxSeats" placeholder="e.g. 3" value={form.maxSeats} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea name="description" placeholder="Optional description (pickup notes, preferences, etc.)" value={form.description} onChange={handleChange} />
            </div>

            <div className="col-span-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Posting Ride..." : "Post Ride"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
