const { StatusCodes } = require("http-status-codes");
const { BookingService } = require("../services/index");
const { createChannel, publishMessage } = require("../utils/messageQueue");
const { REMINDER_BINDING_KEY } = require("../config/serverConfig");

const bookingService = new BookingService();

class BookingController {
  constructor() {}
  async sendMessageToQueue(req, res) {
    const channel = await createChannel();
    const data = {
      message: "This is data",
    };
    publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(data));
    return res.status(200).json({
      message: "Message Published",
    });
  }

  async create(req, res) {
    try {
      const response = await bookingService.createBooking(req.body);
      return res.status(StatusCodes.OK).json({
        message: "Booking created successfully",
        data: response,
      });
    } catch (error) {
      return res.status(error.statusCode).json({
        message: error.message,
        data: {},
        err: error.explanation,
      });
    }
  }
}

module.exports = BookingController;
