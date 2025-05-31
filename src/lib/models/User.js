import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: String, // For local auth
  googleId: String,     // For Google OAuth
  createdRides: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ride' }],
  joinedRides: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ride' }]
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
