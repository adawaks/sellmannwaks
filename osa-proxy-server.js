// Express backend proxy for Google Apps Script form submission
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Replace with your Apps Script endpoint
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzUefX98Nadjj9Pt5vQ4AMQ6vyNwofU6f6A_HR2hI995aLJLJ1P5ni-DZ7TXwZHW96PHA/exec';

app.post('/api/submit-osa', async (req, res) => {
  try {
    // Convert JSON body to form data
    const formData = new URLSearchParams();
    Object.entries(req.body).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Forward to Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
    const text = await response.text();
    // Optionally parse the HTML response for feedback
    if (response.ok && text.includes('Tack för ditt svar!')) {
      res.json({ status: 'success', message: 'Tack för ditt svar!' });
    } else {
      res.json({ status: 'error', message: 'Något gick fel, försök igen senare' });
    }
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Något gick fel, försök igen senare' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
