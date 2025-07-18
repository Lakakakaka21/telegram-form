
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const TELEGRAM_BOT_TOKEN = '7841062429:AAFSsD7DtALiyq10Vt5ToChq';
const TELEGRAM_CHAT_ID = '@your_channel_or_chat_id'; // Заміни на свій chat_id

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/submit', async (req, res) => {
  const { fullName, phone, document, address, region } = req.body;

  if (!fullName || !phone || !document || !address || !region) {
    return res.status(400).json({ error: 'Всі поля обов’язкові' });
  }

  const message = `
Нова заявка на заміну інтернет-кабеля:

Регіон: ${region}
ФІО: ${fullName}
Телефон: ${phone}
Документ: ${document}
Адреса: ${address}
  `;

  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML',
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Telegram API error:', error.message);
    res.status(500).json({ error: 'Помилка надсилання повідомлення' });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
