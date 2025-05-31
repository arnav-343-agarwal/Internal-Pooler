import { requireAuth } from '@/middleware/requireAuth';

export async function GET(req) {
  const user = await requireAuth(req);
  if (!user) return new Response('Unauthorized', { status: 401 });

  // Exclude sensitive info like password
  const userProfile = {
    _id: user._id,
    name: user.name,
    email: user.email,
    googleId: user.googleId || null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return Response.json({ success: true, user: userProfile });
}

export async function PUT(req) {
  const user = await requireAuth(req);
  if (!user) return new Response('Unauthorized', { status: 401 });

  const body = await req.json();
  const { name } = body;

  if (!name) {
    return new Response(JSON.stringify({ success: false, message: 'Name is required' }), { status: 400 });
  }

  user.name = name;
  await user.save();

  return new Response(JSON.stringify({ success: true, user: { _id: user._id, name: user.name, email: user.email } }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}