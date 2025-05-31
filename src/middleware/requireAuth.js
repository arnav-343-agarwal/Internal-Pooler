import { verifyToken } from '@/lib/auth/jwt';
import User from '@/lib/models/User';
import dbConnect from '@/lib/dbConnect';

export async function requireAuth(req) {
  await dbConnect();
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) return null;

  const user = await User.findById(decoded.id);
  return user || null;
}
