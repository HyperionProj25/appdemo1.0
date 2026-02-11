# Baseline Analytics Demo

Local-only clickable demo of the Baseline facility + player experience.

## Quick Start

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Mock Data

Place CSV files in the `mockdata/` folder (already included):
- `mock_bp_data.csv` - Batting practice data
- `mock_combined_data.csv` - Combined game/practice data
- `mock_live_data.csv` - Live game data

Player data is hard-coded from these CSVs in `src/data/players.ts`.

## Routes

| Route | Screen |
|-------|--------|
| `/` | Login (pick Facility or Player demo) |
| `/facility/sessions` | Facility - Sessions tab |
| `/facility/players` | Facility - Players tab |
| `/facility/groups` | Facility - Groups tab |
| `/player/:id/dashboard` | Player - Hitting Dashboard |
| `/player/:id/metrics` | Player - Hitting Metrics |
| `/player/:id/pitching` | Player - Pitching Dashboard |
| `/player/:id/pitching/metrics` | Player - Pitching Metrics |
| `/player/:id/strength` | Player - Strength |
| `/player/:id/ecosystem` | Player - Ecosystem |

## Branding

- Logo and icon from `NewBranding/` are copied to `public/branding/`
- Fonts (GT America Standard + Mono) are in `public/fonts/`
- Colors are defined as CSS variables in `src/index.css`

## No External Dependencies

- No database, no auth, no API calls
- All data is hard-coded or deterministically generated
- AI responses are canned keyword-matched text
