const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Токен і чат ID
const TOKEN = '7841062429:AAFSsD7DtALiyq10Vt5ToChqPLB9G3UC7MA';
const CHAT_ID = '1577518423';
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public')); // для index.html

// Обробка POST-запиту з форми
app.post('/send', async (req, res) => {
    const { name, address, phone } = req.body;

    const text = `
📥 Нова заявка:
👤 Ім'я: ${name}
🏠 Адреса: ${address}
📞 Телефон: ${phone}
    `;

    try {
        const response = await fetch(TELEGRAM_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text,
                parse_mode: 'HTML'
            })
        });

        const data = await response.json();

        if (data.ok) {
            res.status(200).send({ success: true });
        } else {
            console.error('Telegram error:', data);
            res.status(500).send({ success: false, error: data });
        }
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).send({ success: false, error });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущено на порті ${PORT}`);
});
