# Quick Start Guide - Vine Treatment Manager PWA

## Running the App Locally

### Method 1: PowerShell Server (Included)
```powershell
cd vine-pwa
.\start-server.ps1
```
Opens automatically at http://localhost:8000

### Method 2: Python (if installed)
```powershell
python -m http.server 8000
```
Then open http://localhost:8000

### Method 3: Node.js (if installed)
```powershell
npx http-server -p 8000
```
Then open http://localhost:8000

### Method 4: VS Code Live Server
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

---

## Using the App

### 1. Create Your First Treatment

1. Click **"New Treatment"** button
2. Date/time is auto-filled (you can edit it)
3. **Add Chemicals:**
   - Type in the search box (try "Mancozeb", "Rally", "Captan", "Luna", "Sevin")
   - Click a chemical from the suggestions
   - Adjust application rates if needed
   - Add multiple chemicals for tank mixes
4. **Enter Treatment Area:** e.g., 5000 sq ft
5. **Watch auto-calculations:**
   - Finished solution volume (gallons)
   - Amount of each chemical needed
6. **Optional:** Enter retreatment interval (days) and notes
7. Click **"Submit Treatment"**

### 2. View Treatment History

1. Click **"View Logs"** from dashboard
2. See all your treatments sorted by date
3. **Search/Filter:** Type in the search box to find specific chemicals or dates
4. **View Details:** Click any treatment to see full information
5. **Delete:** Open a treatment → Click "Delete" button

### 3. Export Your Data

1. Click **"Export Data"** from dashboard
2. Choose format:
   - **CSV** - for Excel or Google Sheets
   - **JSON** - for backups or data analysis
3. File downloads to your device automatically

---

## Sample Chemicals Included

The app includes these sample chemicals to get started:

| Chemical | Type | MOA Group | Default Rate |
|----------|------|-----------|--------------|
| Mancozeb 75DF | Fungicide | M3 | 2 lb/acre |
| Rally 40WSP | Fungicide | 3 | 5 oz/acre |
| Captan 50WP | Fungicide | M4 | 3 lb/acre |
| Luna Experience | Fungicide | 7+11 | 6 oz/acre |
| Sevin XLR Plus | Insecticide | 1A | 1 qt/acre |

More chemicals will be added in future iterations, or you can expand the database yourself.

---

## Understanding Auto-Calculations

**Application Rate:** 20 gallons per 1000 sq ft (typical vineyard rate)

**Example:**
- Treatment Area: 5,000 sq ft
- Calculation: 5,000 ÷ 1,000 × 20 = **100 gallons** total solution

**Chemical Amounts:**
- Area in acres: 5,000 sq ft ÷ 43,560 = 0.115 acres
- If Mancozeb rate is 2 lb/acre: 2 × 0.115 = **0.23 lb needed**

---

## Installing as a Mobile App

### iPhone/iPad (Safari)
1. Open the app in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Name it "Vine Treatments"
5. Tap "Add"

### Android (Chrome)
1. Open the app in Chrome
2. Tap the menu (⋮)
3. Tap **"Add to Home Screen"**
4. Or look for the install banner at the bottom

### Desktop (Chrome/Edge)
1. Look for the install icon (⊕) in the address bar
2. Click it and confirm installation
3. App opens in its own window

---

## Data Storage & Backup

**Where is my data stored?**
- All data is saved locally in your browser's storage
- Data persists even when offline
- Each device/browser has its own data

**How to backup or transfer data:**
1. Use the Export function to save JSON files
2. Store these files in cloud storage or on your device
3. To restore, you'll need to manually re-enter treatments (import coming in future update)

**Important:** Clearing browser data will delete your treatments!

---

## Tips & Best Practices

### Field Use
- ✅ Install as home screen app for quick access
- ✅ Works completely offline after first load
- ✅ Enter treatments immediately after application
- ✅ Take photos separately and reference in notes

### Data Management
- 🔄 Export regularly as backup
- 📅 Use consistent date formats when searching
- 📝 Add detailed notes for future reference
- 🔍 Search by chemical name or partial dates

### Chemical Selection
- Mix-compatible chemicals can be selected together
- Application rates can be adjusted per treatment
- Default rates are suggestions only - verify with labels
- MOA groups help track rotation (more in iteration 4)

---

## Troubleshooting

**App won't load?**
- Check that JavaScript is enabled
- Try a different browser
- Clear browser cache and reload

**Treatments not saving?**
- Check browser storage permissions
- Ensure you're not in Private/Incognito mode
- Check available storage space

**Can't find a chemical?**
- Currently using a limited sample database
- More chemicals coming in iteration 3
- Or you can add to `src/app.js` manually

**Service Worker issues?**
- Unregister old service worker in browser DevTools
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Close all tabs and reopen

---

## Coming Soon

✅ **Iteration 1** - Core treatment tracking (COMPLETE)
⏳ **Iteration 2** - GPS weather auto-fill (NEXT)
⏳ **Iteration 3** - Chemical compatibility rules
⏳ **Iteration 4** - Rotation reminders & retreatment alerts
⏳ **Iteration 5** - Enhanced export & edit features

---

## Need Help?

- Check [README.md](README.md) for detailed documentation
- Review the project structure
- Examine sample treatments to understand data format
- All code is commented for learning and customization

**Happy Spraying! 🌿**
