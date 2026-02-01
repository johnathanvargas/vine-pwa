# Vine Treatment Manager PWA

A Progressive Web App for tracking pesticide treatments in vineyards. Manage chemical applications, track weather conditions, monitor chemical rotation, and set retreatment reminders.

## Features

### ✅ Implemented (Iteration 1)
- **Dashboard** with quick stats and action buttons
- **New Treatment Form** with:
  - Auto-filled date/time (editable)
  - Manual weather entry (auto-fill coming in iteration 2)
  - Chemical selection from searchable database
  - Multiple chemical support
  - Auto-calculated solution volumes and chemical amounts
  - Retreatment interval tracking
  - Notes field
- **Treatment Logs** with search and filtering
- **Treatment Details** view with edit/delete
- **Export** to CSV and JSON formats
- **Offline Support** via Service Worker
- **Mobile-First Design** with responsive layout
- **Local Storage** persistence

### 🚧 Coming Soon
- **Iteration 2:** GPS-based weather auto-fill using weather API
- **Iteration 3:** Enhanced chemical compatibility checker with MOA groups
- **Iteration 4:** Chemical rotation alerts and retreatment dashboard widgets
- **Iteration 5:** Enhanced filtering, search, and export options

## Quick Start

### Local Development

1. **Clone or navigate to the repository:**
   ```powershell
   cd c:\Users\1014396\Desktop\equinox_repo\vine-pwa
   ```

2. **Start a local web server:**
   
   **Option A: Using Python**
   ```powershell
   python -m http.server 8000
   ```
   
   **Option B: Using Node.js (npx)**
   ```powershell
   npx http-server -p 8000
   ```
   
   **Option C: Using VS Code Live Server Extension**
   - Install "Live Server" extension in VS Code
   - Right-click [index.html](index.html) and select "Open with Live Server"

3. **Open in browser:**
   Navigate to `http://localhost:8000`

4. **Install as PWA (Optional):**
   - Chrome/Edge: Click the install icon in the address bar
   - Safari: Share menu → "Add to Home Screen"
   - Mobile: "Add to Home Screen" from browser menu

### Testing the App

1. **Create a Treatment:**
   - Click "New Treatment"
   - Date/time auto-fills
   - Search and add chemicals (try "Mancozeb", "Rally", "Captan")
   - Enter treatment area (e.g., 5000 sq ft)
   - Watch auto-calculations update
   - Submit

2. **View Logs:**
   - Click "View Logs" to see all treatments
   - Click any treatment to see full details
   - Use search to filter by chemical or date

3. **Export Data:**
   - Click "Export Data"
   - Choose CSV or JSON format
   - File downloads to device

## GitHub Pages Deployment

### Option 1: Manual Deployment

1. **Create `gh-pages` branch:**
   ```powershell
   git checkout -b gh-pages
   git push origin gh-pages
   ```

2. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: `gh-pages` / `root`
   - Save

3. **Access your app:**
   `https://[username].github.io/vine-pwa/`

### Option 2: GitHub Actions (Automated)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

Push to `main` branch to auto-deploy.

### Custom Domain (Optional)

1. Add `CNAME` file to root:
   ```
   your-domain.com
   ```

2. Configure DNS:
   - Add A records pointing to GitHub Pages IPs
   - Or CNAME record pointing to `[username].github.io`

3. Enable HTTPS in GitHub Pages settings

## Project Structure

```
vine-pwa/
├── index.html              # Main app HTML
├── manifest.json           # PWA manifest
├── service-worker.js       # Offline support
├── styles.css              # Mobile-first styles
├── icon-192.png           # App icon (192x192)
├── icon-512.png           # App icon (512x512)
├── src/
│   ├── app.js             # Main application logic
│   ├── storage.js         # LocalStorage wrapper
│   ├── chemicals.js       # Chemical database (iteration 3)
│   ├── weather.js         # Weather integration (iteration 2)
│   ├── reminders.js       # Rotation/retreatment (iteration 4)
│   └── export.js          # Export utilities (iteration 5)
└── README.md
```

## Data Storage

All data is stored locally in your browser's localStorage:
- **Treatments:** Complete treatment records
- **Settings:** User preferences (future)
- **Chemicals:** Custom chemical inventory (future)

**Note:** Data is device-specific. Use export feature to backup or transfer between devices.

## Browser Support

- Chrome/Edge: Full support
- Safari: Full support (iOS 11.3+)
- Firefox: Full support
- Mobile browsers: Optimized for mobile use

## Development Roadmap

### Iteration 1: ✅ Core Treatment Flow (COMPLETE)
- Basic PWA structure
- Treatment form with calculations
- Local storage
- Logs and export

### Iteration 2: Weather Integration (NEXT)
- GPS geolocation
- Weather API integration (WeatherAPI.com)
- Auto-fill temperature, humidity, wind
- Graceful permission fallback

### Iteration 3: Chemical Compatibility
- Expand chemical database
- MOA group tracking
- Compatibility rules engine
- Visual warnings for incompatible mixes

### Iteration 4: Rotation & Retreatment
- MOA usage pattern detection
- Rotation reminder alerts
- Retreatment dashboard widget
- Overdue treatment notifications

### Iteration 5: Polish & Enhanced Features
- Advanced filtering and search
- Edit treatment functionality
- Batch export options
- Settings panel
- Custom chemical management

## Assumptions & Design Decisions

1. **Application Rate:** Default 20 gallons per 1000 sq ft (typical vineyard spraying)
2. **Chemical Rates:** User-provided or stored defaults only (no label scraping)
3. **Compatibility:** Simple lookup table for known incompatibilities (expandable)
4. **Weather:** Manual entry now, API integration in iteration 2
5. **Offline-First:** All core features work without internet
6. **Mobile-First:** Optimized for phone/tablet use in the field

## Contributing

This is a personal project, but suggestions welcome! Areas for enhancement:
- Additional weather API providers
- More comprehensive chemical database
- Integration with vineyard management systems
- Multi-language support

## License

MIT License - Free to use and modify

---

**Built with:** Vanilla JavaScript, CSS3, HTML5, Service Workers
**No frameworks or build tools required** - just open and run!
