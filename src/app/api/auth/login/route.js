import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth/jwt";
import dbConnect from "@/lib/dbConnect";

export async function POST(req) {
  await dbConnect();
  const { email, password } = await req.json();
  const user = await User.findOne({ email });

  if (!user || !user.passwordHash)
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match)
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });

  const token = signToken(user);
  return Response.json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
}
