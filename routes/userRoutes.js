import express from "express";
import { auth } from "../middlewares/auth.js";
import { getCars, createCarBooking, getUserBookings } from "../controllers/userController.js";

const userRouter =  express.Router();

userRouter.get('/get-cars', auth, getCars);
userRouter.post('/insert-car-rent', auth, createCarBooking);
userRouter.get('/my-bookings', auth, getUserBookings);

export default userRouter;