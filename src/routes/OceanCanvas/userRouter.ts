import express from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { User } from '../../models/OceanCanvas/UserSchema';
import bcrypt from 'bcrypt';
import verifyToken from '../../middleware/verifyToken';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.find({});

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Users fetched successfully',
      data: users,
    });
  } catch (error: any) {
    console.log('GetUsersError: ', error);

    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
});

router.post('/register', async (req, res) => {
  try {
    const user = req.body;
    const { name, email, password } = user;

    const doesEmailExist = await User.findOne({
      email: email,
    });

    if (doesEmailExist) {
      res.status(400).json({
        status: 400,
        message: 'Email already in use.',
      });
      return;
    }

    bcrypt.hash(password, 10, async function (err, hash) {
      const newUser = await User.create({
        name,
        email,
        password: hash,
      });

      res.status(201).json({
        status: 201,
        success: true,
        message: 'User created successfully.',
        user: newUser,
      });
    });
  } catch (error: any) {
    console.log('RegisterError: ', error);

    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const userReq = req.body;
    const { email, password } = userReq;

    const user = await User.findOne({
      email: email,
    });

    if (!user) {
      res.status(404).json({
        status: 404,
        success: false,
        message: 'User not found',
      });
      return;
    }

    bcrypt.compare(password, user.password, function (err, result) {
      if (!result) {
        res.status(400).json({
          status: 400,
          success: false,
          message: 'Wrong password',
        });
        return;
      }

      const token = jwt.sign(
        { _id: user?._id, name: user?.name, email: user?.email, admin: user?.admin, address: user?.address },
        process.env.JWT_SECRET as Secret,
        {
          expiresIn: '1d',
        }
      );

      res.status(200).json({
        status: 200,
        success: true,
        message: 'Login is successful',
        token: token,
      });
    });
  } catch (error: any) {
    console.log('LoginError: ', error);

    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
});

router.post('/validate', verifyToken, async (req, res) => {
  try {
    res.status(200).json({
      status: 200,
      message: 'Valid token',
    });
  } catch (error: any) {
    console.log('ValidateError: ', error);

    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
});

router.put('/change-address', verifyToken, async (req: any, res) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      res.status(404).json({
        status: 404,
        message: 'User not found',
      });
      return;
    }
    user.address = req.body;
    await user.save();
    res.status(200).json({
      status: 200,
      message: 'Address updated successfully',
    });
  } catch (error: any) {
    console.log('ChangeAddressError: ', error);

    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
});

router.put('/change-password', verifyToken, async (req: any, res) => {
  try {
    const user = await User.findOne({ _id: req.userId });

    if (!user) {
      res.status(404).json({
        status: 404,
        message: 'User not found',
      });
      return;
    }

    bcrypt.hash(req.body.newPassword, 10, async function (err, hash) {
      user.password = hash;
      await user.save();

      res.status(200).json({
        status: 200,
        message: 'Password changed successfully',
      });
    });
  } catch (error: any) {
    console.log('ChangePasswordError: ', error);

    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
});

export default router;
