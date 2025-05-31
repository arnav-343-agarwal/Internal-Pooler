import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema({
  poster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  from: {
    text: String,
    lat: Number,
    lng: Number
  },
  to: {
    text: String,
    lat: Number,
    lng: Number
  },
  dateTime: {
    type: Date,
    required: true
  },
  maxSeats: {
    type: Number,
    required: true
  },
  description: String,
  requests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RideRequest'
  }]
}, { timestamps: true });

export default mongoose.models.Ride || mongoose.model('Ride', rideSchema);
