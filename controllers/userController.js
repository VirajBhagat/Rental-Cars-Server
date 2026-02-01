import sql from "../configs/db.js";

export const getCars = async (req, res) => {
    try{
        const {userId} = req.auth();

        const creations = await sql`SELECT * FROM cars`;

        res.json({success: true, creations: creations});
    } catch (error){
        res.json({success: false, message: error.message});
    }
}

export const createCarBooking = async (req, res) => {
  try {
    const { userId } = req.auth();

    const {
      car_id,
      user_name,
      user_email,
      user_phone,
      booking_date,
      message,
      days,
      persons,
      price_per_day
    } = req.body;

    if (
      !car_id ||
      !user_name ||
      !user_email ||
      !user_phone ||
      !booking_date ||
      !days ||
      !persons ||
      !price_per_day
    ) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const subtotal = price_per_day * days * persons;
    const delivery_fee = 20;
    const tax = 2;
    const total_amount = subtotal + delivery_fee + tax;

    const [booking] = await sql`
      INSERT INTO bookings (
        clerk_user_id,
        car_id,
        user_name,
        user_email,
        user_phone,
        booking_date,
        message,
        days,
        persons,
        subtotal,
        delivery_fee,
        tax,
        total_amount
      )
      VALUES (
        ${userId},
        ${car_id},
        ${user_name},
        ${user_email},
        ${user_phone},
        ${booking_date},
        ${message},
        ${days},
        ${persons},
        ${subtotal},
        ${delivery_fee},
        ${tax},
        ${total_amount}
      )
      RETURNING *;
    `;

    res.json({
      success: true,
      message: "Car booked successfully",
      booking
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.auth();

    const bookings = await sql`
      SELECT 
        b.id,
        b.car_id,
        c.car_name,
        c.car_image,
        c.car_category,
        b.booking_date,
        b.days,
        b.persons,
        b.subtotal,
        b.delivery_fee,
        b.tax,
        b.total_amount,
        b.status,
        b.created_at
      FROM bookings b
      JOIN cars c ON c.id = b.car_id
      WHERE b.clerk_user_id = ${userId}
      ORDER BY b.created_at DESC;
    `;

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};