import express from 'express';
import { Booking } from '../../models/Melissa/Bookings';
import ShortUniqueId from 'short-unique-id';

const router = express.Router();

interface ITable {
  table: number;
  sitting: number;
}

router.get('/all', async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.json(bookings);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  console.log('ID!!!');
  try {
    const booking = await Booking.findOne({ shortId: id });
    res.json(booking);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.post('/search', async (req, res) => {
  try {
    const bookings = await Booking.find(req.body);
    const tables: ITable[] = [];

    for (let i = 0; i < 15; i++) {
      const table = i + 1;
      tables.push({ table: table, sitting: 1 });
      tables.push({ table: table, sitting: 2 });
    }

    bookings.forEach((booking) => {
      const tempObj = { table: booking.table, sitting: booking.sitting };
      const index = tables.findIndex((table) => table.table == tempObj.table && table.sitting == tempObj.sitting);
      tables.splice(index, 1);
    });

    res.json(tables);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

router.post('/create', async (req, res, next) => {
  req.body.shortId = new ShortUniqueId().randomUUID(6);
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ error: err });
  }
});

router.post('/cancel', async (req, res, next) => {
  try {
    const booking = await Booking.findOne(req.body);
    console.log(booking);
    if (booking !== null) {
      booking.isDeleted = true;
      booking.save();
    }
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

export default router;
