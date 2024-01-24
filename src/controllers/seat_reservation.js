const seat = require('../models/seat_reservations');
const mongoose = require('mongoose');
const date = require('date-and-time');

// Initialize seats
const initializeSeats = async () => {
  for (let i = 1; i <= 12; i++) {
    const seatCount = i === 12 ? 3 : 7; // Last row has 3 seats
    const seats = Array.from({ length: seatCount }, (_, j) => ({
      seat_no: `R${i} Seat${j + 1}`,
      is_booked: false
    }));

    const newRow = new seat({
      _id: `Row${i}`,
      seats
    });

    await newRow.save(); // Await each save operation
  }
};

// Book seats
const bookSeats = (allSeats, numberOfSeats) => {
  let bookedSeats = [];
  let seatsToBook = numberOfSeats;

  for (let row of allSeats) {
    let availableSeatsInRow = row.seats.filter(seat => !seat.is_booked);

    // Book seats in the same row if possible
    if (availableSeatsInRow.length >= seatsToBook) {
      bookedSeats = availableSeatsInRow.slice(0, seatsToBook).map(seat => ({
        row: row._id,
        seat_no: seat.seat_no
      }));

      availableSeatsInRow.forEach((seat, index) => {
        if (index < seatsToBook) seat.is_booked = true;
      });

      break;
    }
  }

  // Book seats in multiple rows if needed
  if (bookedSeats.length < numberOfSeats) {
    for (let row of allSeats) {
      let availableSeatsInRow = row.seats.filter(seat => !seat.is_booked);

      for (let seat of availableSeatsInRow) {
        if (seatsToBook === 0) break;

        bookedSeats.push({ row: row._id, seat_no: seat.seat_no });
        seat.is_booked = true;
        seatsToBook--;
      }
    }
  }

  return bookedSeats;
};

// Express handler for booking seats
exports.bookSeats = async (req, res) => {
  try {
    const numberOfSeats = req.body.numberOfSeats;
    let allSeats = await seat.find({});

    if (allSeats.length === 0) {
      await initializeSeats();
      allSeats = await seat.find({});
    }

    const bookedSeats = bookSeats(allSeats, numberOfSeats);

    if (bookedSeats.length > 0) {
      const updatePromises = bookedSeats.map(bookedSeat =>
        seat.updateOne(
          { '_id': bookedSeat.row },
          { '$set': { 'seats.$[elem].is_booked': true } },
          { arrayFilters: [{ 'elem.seat_no': bookedSeat.seat_no }] }
        )
      );

      await Promise.all(updatePromises);
      res.json({ status: 0, message: 'Seats booked successfully', bookedSeats });
    } else {
      res.status(400).json({ status: 1, message: 'Unable to book the requested number of seats' });
    }
  } catch (error) {
    res.status(500).json({ status: 1, message: 'Server error', error: error.message });
  }
};

exports.getSeats=async (req, res) => {
  try {
    let allSeats = await seat.find({});
    if (allSeats.length === 0) {
      await initializeSeats();
      allSeats = await seat.find({});
    }
    let availableSeats = [];

    allSeats.forEach(row => {
      row.seats.forEach(seat => {
       
          availableSeats.push({ row: row._id, seat_no: seat.seat_no ,is_booked:seat.is_booked});
      
      });
    });

    res.json({ status: 0,message: 'All Seats', availableSeats });
  } catch (error) {
    res.status(500).json({ status: 1, message: 'Server error', error });
  }
}