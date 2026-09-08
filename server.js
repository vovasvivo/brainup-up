const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());
app.use(express.static('.'));

const BOT_TOKEN = process.env.BOT_TOKEN;

app.post('/api/create-invoice', async (req, res) => {
    try {
        const { title, description, amount } = req.body;
        
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: title || 'BrainUp Stars',
                description: description || 'Purchase Stars for BrainUp',
                payload: 'brainup_stars_payload',
                provider_token: '',
                currency: 'XTR',
                prices: [{ label: 'Stars', amount: amount || 1 }]
            })
        });

        const data = await response.json();
        if (data.ok) {
            res.json({ invoiceLink: data.result });
        } else {
            res.status(400).json({ error: data.description });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
