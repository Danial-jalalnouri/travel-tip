# Travel Tips

A simple travel tip sharing website where users can add, search, and view travel tips from others.

## Features

- **Add Travel Tips** - Share tips with country, city, date, and description
- **Search Tips** - Filter by country, city, date, or description text
- **Edit/Delete Tips** - Modify or remove your tips
- **Firebase Database** - Tips stored in Firebase Firestore

## Project Structure

```
travel_tip/
├── index.html       # Main HTML page
├── css/
│   └── styles.css   # Styling
└── js/
    ├── app.js       # Application logic
    └── database.js  # Firebase Firestore connection
```

## Running Locally

```bash
npx serve .
```

Then open `http://localhost:3000` in your browser.

## How It Works

- Connects directly to Firebase Firestore (no backend server needed)
- Data persists in Firebase cloud
- All users share the same database