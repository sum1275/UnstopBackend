module.exports = (app) => {
  const seat=require('../controllers/seat_reservation')
  app.post('/bookseat',seat.bookSeats);
  app.get('/allseats',seat.getSeats)
}