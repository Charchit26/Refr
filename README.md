# 🎁 Refr - Community Referral Hub

A beautiful, serverless web app for sharing and discovering referral codes. Built with React + Firebase, hosted free on GitHub Pages.

![Refr Preview](https://img.shields.io/badge/React-18-blue) ![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange) ![GitHub Pages](https://img.shields.io/badge/Hosting-GitHub%20Pages-green)

## ✨ Features

- **Share referral codes** for popular apps (Uber, DoorDash, Robinhood, etc.)
- **Community voting** - thumbs up/down to flag working vs broken codes
- **Auto-hide bad codes** - codes with >40% downvotes are hidden
- **No login required** - just share and vote
- **Beautiful dark UI** with smooth animations
- **100% Free hosting** on GitHub Pages

## 🚀 Quick Start

### 1. Set up Firebase (Free)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** (or use an existing one)
3. Once created, click **"Add app"** → **Web** (</> icon)
4. Register your app name, then copy the config object

5. **Enable Firestore Database:**
   - In Firebase Console, go to **Build** → **Firestore Database**
   - Click **"Create database"**
   - Choose **"Start in test mode"** (for now)
   - Select a location close to your users

6. **Update Firestore Rules** (for public read/write):
   - Go to **Firestore Database** → **Rules** tab
   - Replace with:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /referrals/{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
   - Click **"Publish"**

### 2. Configure the App

Open `src/firebase.js` and replace the placeholder config:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",           // Your API key
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 3. Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see your app!

### 4. Deploy to GitHub Pages (Free)

1. **Create a GitHub repo** named `Refr` (or your preferred name)

2. **Update `vite.config.js`** if your repo name is different:
   ```javascript
   base: '/your-repo-name/',
   ```

3. **Push your code:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/Refr.git
   git push -u origin main
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages:**
   - Go to your repo → **Settings** → **Pages**
   - Under "Source", select **gh-pages** branch
   - Save and wait a minute

Your app will be live at: `https://YOUR_USERNAME.github.io/Refr/`

## 🛡️ Security Notes

The current Firestore rules allow anyone to read/write. For a production app, consider:

1. **Rate limiting** via Firebase App Check
2. **Stricter rules** to prevent abuse:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /referrals/{document} {
         // Anyone can read
         allow read: if true;
         
         // Only allow creating new docs (no updates/deletes)
         allow create: if request.resource.data.keys().hasAll(['appName', 'code', 'upvotes', 'downvotes'])
                       && request.resource.data.upvotes == 0
                       && request.resource.data.downvotes == 0;
         
         // Only allow updating votes
         allow update: if request.resource.data.diff(resource.data).affectedKeys().hasOnly(['upvotes', 'downvotes']);
       }
     }
   }
   ```

## 📁 Project Structure

```
Refr/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Header.jsx/css
│   │   ├── Hero.jsx/css
│   │   ├── AppFilter.jsx/css
│   │   ├── ReferralCard.jsx/css
│   │   ├── AddReferralModal.jsx/css
│   │   └── EmptyState.jsx/css
│   ├── App.jsx/css
│   ├── firebase.js          # ⚠️ Add your config here
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Customization

### Add More Apps

Edit the `POPULAR_APPS` array in `src/App.jsx`:

```javascript
export const POPULAR_APPS = [
  { name: 'Your App', color: '#FF0000', icon: '🎯' },
  // ... more apps
];
```

### Change Theme Colors

Edit CSS variables in `src/index.css`:

```css
:root {
  --accent-primary: #FF6B35;    /* Main accent */
  --accent-secondary: #F7C59F;  /* Secondary accent */
  /* ... */
}
```

### Adjust Downvote Threshold

In `src/App.jsx`, change `DOWNVOTE_THRESHOLD`:

```javascript
const DOWNVOTE_THRESHOLD = 0.4; // 40% downvotes = hidden
```

## 📄 License

MIT - Do whatever you want with it!

---

Made with 🧡 for the sharing economy
