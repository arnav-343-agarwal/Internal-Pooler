import passport from '@/lib/auth/passport';

export async function GET(req) {
  return passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })(req);
}
