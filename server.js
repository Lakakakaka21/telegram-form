import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;
const TELEGRAM_TOKEN = '7841062429:AAFSsD7DtALiyq10Vt5ToChqPLB9G3UC7MA';
const CHAT_ID = '1577518423';  // Заміни на свій чат айді

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/send', async (req, res) => {
  const { name, address, phone } = req.body;
  if (!name || !address || !phone) {
    return res.status(400).send('Missing fields');
  }

  const message = `Новая заявка:\nИмя: ${name}\nАдрес: ${address}\nТелефон: ${phone}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message })
    });

    if (!response.ok) throw new Error('Telegram API error');

    res.status(200).send('Message sent');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending message');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
