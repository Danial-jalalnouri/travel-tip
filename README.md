# Travel Tips

A simple travel tip sharing website where users can add, search, and view travel tips from others.

## Features

- **Add Travel Tips** - Share tips with country, city, date, and description
- **Search Tips** - Filter by country, city, date, or description text
- **Firebase Database** - Tips stored in Firebase Firestore
- **Auto Deploy** - Automatically deploys to Firebase Hosting on push

## Project Structure

```
travel_tip/
├── index.html           # Main HTML page
├── firebase.json        # Firebase configuration
├── firestore.rules      # Firestore security rules
├── css/
│   └── styles.css       # Styling
└── js/
    ├── app.js           # Application logic
    └── database.js      # Firebase Firestore connection
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

## CI/CD with GitHub Actions

This project uses **GitHub Actions** for automatic deployment to Firebase Hosting.

### How It Works

1. Push code to `main` branch
2. GitHub Actions detects the push
3. Workflow runs automatically
4. Code deploys to Firebase Hosting
5. Live site updates in ~1-2 minutes

### GitHub Workflow Files

```
.github/workflows/
├── firebase-hosting-merge.yml      # Deploys on push to main
└── firebase-hosting-pull-request.yml # Preview on pull requests
```

#### `firebase-hosting-merge.yml`

Triggers on every push to `main` branch. Deploys directly to the live site.

```yaml
on:
  push:
    branches:
      - main
```

**What it does:**
- Checks out the code
- Deploys to Firebase Hosting (live channel)
- Site updates automatically

#### `firebase-hosting-pull-request.yml`

Triggers on pull requests. Creates a preview URL before merging.

```yaml
on: pull_request
```

**What it does:**
- Checks out the code
- Deploys to a preview channel
- Posts preview URL on the PR

### Setting Up GitHub Actions

**1. Firebase token is stored as a GitHub secret:**
- Go to repo Settings → Secrets → Actions
- `FIREBASE_TOKEN` - Used for authentication

**2. Required permissions:**
- `GITHUB_TOKEN` - Auto-provided by GitHub
- `FIREBASE_SERVICE_ACCOUNT` - Firebase service account key

### Manual Deployment

If you need to deploy manually without GitHub:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy
firebase deploy
```

## Firebase Configuration

### Firestore Rules (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tips/{tipId} {
      allow read: if true;      // Anyone can read
      allow create: if true;    // Anyone can create
      allow update, delete: if false; // No edit/delete
    }
  }
}
```

### Firebase Config (`firebase.json`)

```json
{
  "hosting": {
    "public": ".",
    "rewrites": [
      { "source": "**", "destination": "/index.html" }
    ]
  },
  "firestore": {
    "rules": "firestore.rules"
  }
}
```