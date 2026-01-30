# TryTavvy - Launch Page

Welcome page for Tavvy's official launch. This page introduces the platform and directs professionals to their respective portals.

## Features

- **Dark theme** with Tavvy gradient accents
- **Responsive design** (mobile, tablet, desktop)
- **Smooth animations** and scroll effects
- **Three professional paths**:
  - Service Professionals → pros.tavvy.com
  - Realtors → realtor.tavvy.com
  - Mobile Businesses → onthego.tavvy.com
- **Founders Access** section with exclusive benefits

## Deployment

### Railway

1. Connect this repository to Railway
2. Railway will automatically detect the Dockerfile
3. Set environment variables (if needed):
   - `PORT` (auto-set by Railway)
4. Deploy!

### Local Development

```bash
npm install
npm start
```

Visit http://localhost:3000

## Structure

```
trytavvy/
├── public/
│   ├── index.html      # Main HTML
│   ├── css/
│   │   └── styles.css  # All styles
│   ├── js/
│   │   └── main.js     # Scroll animations
│   └── images/         # (future assets)
├── server.js           # Express server
├── package.json
├── Dockerfile
└── README.md
```

## Color Palette

- **Primary**: #6B7FFF (blue)
- **Accent**: #00CED1 (teal)
- **Highlight**: #FFD700 (yellow)
- **Background**: #000000 (black)
- **Cards**: #1A1F2E (dark navy)

## Links

- Service Professionals: https://pros.tavvy.com
- Realtors: https://realtor.tavvy.com
- Mobile Businesses: https://onthego.tavvy.com
