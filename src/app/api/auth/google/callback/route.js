import passport from '@/lib/auth/passport';
import { signToken } from '@/lib/auth/jwt';

export async function GET(req, context) {
  return new Promise((resolve, reject) => {
    passport.authenticate('google', { session: false }, async (err, user) => {
      if (err || !user) {
        return resolve(Response.redirect('/login?error=true'));
      }

      const token = signToken(user);
      const url = new URL('/dashboard', req.url);
      url.searchParams.set('token', token);
      return resolve(Response.redirect(url.toString()));
    })(req);
  });
}
