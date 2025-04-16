const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// News API endpoint
app.get('/api/news', async (req, res) => {
  try {
    const { category, q: searchTerm } = req.query;
    const apiKey = process.env.NEWS_API_KEY;
    
    let url = 'https://newsapi.org/v2/top-headlines?country=us';
    
    if (category) {
      url += `&category=${category}`;
    }
    
    if (searchTerm) {
      url += `&q=${encodeURIComponent(searchTerm)}`;
    }
    
    url += `&apiKey=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'ok') {
      res.json(data);
    } else {
      throw new Error(data.message || 'Failed to fetch news');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch news' });
  }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 