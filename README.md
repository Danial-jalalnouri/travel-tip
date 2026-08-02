# Travel Tips

A simple travel tip sharing website where users can add, search, and view travel tips from others.

## Features

- **Add Travel Tips** - Share tips with country, city, date, and description
- **Search Tips** - Filter by country, city, date, or description text
- **Edit/Delete Tips** - Modify or remove your tips
- **Persistent Storage** - Tips saved to `db.json` via local server

## Project Structure

```
travel_tip/
├── index.html       # Main HTML page
├── db.json          # Database (JSON file)
├── server.js        # Express server for API
├── package.json     # Node.js dependencies
├── css/
│   └── styles.css   # Styling
└── js/
    ├── app.js       # Application logic
    └── database.js  # Database abstraction layer
```

## Running Locally

```bash
# Install dependencies
npm install

# Start server
npm start
```

Then open `http://localhost:3000` in your browser.

## Firebase Migration

When ready to migrate to Firebase:

1. Add Firebase config to your project
2. Replace the API calls in `js/database.js` with Firebase Firestore calls
3. Remove `server.js` and `package.json`
4. Deploy the frontend to Firebase Hosting