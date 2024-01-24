const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seat_no: String,
  is_booked: {
    type: Boolean,
    default: false
  }
});

const SeatReservationsSchema = new mongoose.Schema({
  _id: String, // using _id as the row identifier
  seats: [seatSchema],
  date: {
    type: Date,
    default: Date.now // This will automatically set the date when a new document is created
  }
});
const SeatReservations = mongoose.model('SeatReservations', SeatReservationsSchema,"seatreservations");

module.exports = SeatReservations;
