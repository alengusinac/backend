import express from 'express';
import { sendEmail } from '../../services/emailService';
import { Newsletter } from '../../models/OceanCanvas/NewsletterSchema';

const router = express.Router();

router.post('/send', async (req, res) => {
  const { email } = req.body;
  try {
    const emailDb = await Newsletter.create({ email });

    if (!emailDb) {
      return res.status(400).json({
        status: 400,
        message: 'Email already registered to the newsletter.',
      });
    }

    const emailData = {
      from: 'OceanCanvas',
      to: email,
      subject: 'OceanCanvas - Newsletter Subscription',
      text: 'Thank you for subscribing to our newsletter. We will keep you updated with our latest products and offers.',
    };

    sendEmail(emailData);

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Email sent successfully.',
    });
  } catch (error: any) {
    console.log('SendEmail Error: ', error);

    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
});

export default router;
