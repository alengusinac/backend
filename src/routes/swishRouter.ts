import express from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('node-fetch');

const router = express.Router();

router.post('/generate-qr', async (req, res) => {
  console.log('Swish QR code generation endpoint hit!');
  const body = req.body;

  const response = await fetch('https://mpc.getswish.net/qrg-swish/api/v1/prefilled', {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
  const imageBuffer = await response.buffer();
  res.send(imageBuffer);
});

export default router;
