const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Add cache-busting headers
app.use((req, res, next) => {
  // Disable caching for HTML files
  if (req.url.endsWith('.html') || req.url === '/') {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
  } else {
    // Cache static assets (CSS, JS, images) for 1 hour
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }
  next();
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle all routes by serving index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`TryTavvy server running on port ${PORT}`);
});
