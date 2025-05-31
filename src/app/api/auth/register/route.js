import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth/jwt';
import dbConnect from '@/lib/dbConnect';

export async function POST(req) {
  await dbConnect();
  const { name, email, password } = await req.json();
  const existing = await User.findOne({ email });
  if (existing) return new Response('Email already in use', { status: 400 });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });
  const token = signToken(user);

  return Response.json({ token, user: { id: user._id, name: user.name, email: user.email } });
}
