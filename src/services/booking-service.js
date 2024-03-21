const { FLIGHT_SERVICE_PATH } = require("../config/serverConfig");
const { BookingRepository } = require("../repositories/index");
const { ServiceError } = require("../utils/errors");
const axios = require("axios");

class BookingService {
  constructor() {
    this.bookingRepository = new BookingRepository();
  }
  async createBooking(data) {
    try {
      const flightId = data.flightId;
      const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
      const response = await axios.get(getFlightRequestURL);
      const flightData = response.data.data;
      let priceOfTheFlight = flightData.price;
      if (data.noOfSeats > flightData.totalSeats) {
        throw new ServiceError(
          "Something went wrong",
          "Not enough seats available"
        );
      }
      let totalCost = priceOfTheFlight * data.noOfSeats;
      const bookingPayload = { ...data, totalCost };
      const booking = await this.bookingRepository.create(bookingPayload);
      const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
      axios.patch(updateFlightRequestURL, {
        totalSeats: flightData.totalSeats - booking.noOfSeats,
      });
      const finalBooking = await this.bookingRepository.update(booking.id, {
        status: "Booked",
      });
      return finalBooking;
    } catch (error) {
      if (error.name == "RepositoryError" || error.name == "ValidationError") {
        throw error;
      }
      throw new ServiceError();
    }
  }
}
module.exports = BookingService;
