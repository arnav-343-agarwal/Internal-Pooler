import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcryptjs';
import User from '../models/User';

passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  const user = await User.findOne({ email });
  if (!user || !user.passwordHash) return done(null, false, { message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.passwordHash);
  return match ? done(null, user) : done(null, false, { message: 'Invalid credentials' });
}));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  let user = await User.findOne({ googleId: profile.id });
  if (!user) {
    user = await User.create({
      name: profile.displayName,
      email: profile.emails[0].value,
      googleId: profile.id
    });
  }
  done(null, user);
}));

export default passport;
