# Portfolio Dashboard

A modern, interactive portfolio dashboard that pulls project data from Airtable and displays it beautifully.

## 📋 What You Need

Before starting, have these ready:
- Airtable Base ID
- Airtable API Token
- GitHub account
- Vercel account (free)

---

## 🚀 SETUP: Part 1 - Airtable

### Step 1: Create Airtable Base
1. Go to **airtable.com** and sign up (free)
2. Create a new Base called `Portfolio`
3. Create a table named `Projects`

### Step 2: Add Table Columns
Click the `+` to add these columns:

| Column | Type | Details |
|--------|------|---------|
| Title | Single line text | Main title |
| Description | Long text | Full description |
| Category | Single select | Options: Press Kit Content, Design & Graphics, Tools & Dashboards, Video & Media, Strategy & Planning |
| Type | Single select | Options: Web, Documentation, Design, Strategy, Content, Analytics, Tool, Video |
| Tags | Multiple select | Any relevant tags |
| Link | URL | Optional - link to project |
| Status | Single select | Options: Published, Draft, Archived |

### Step 3: Add Your Projects
Add all 13 projects to the table. Example:
- **Title:** Press Kit Site Updates
- **Description:** Refreshed press kit website with updated sections
- **Category:** Press Kit Content
- **Type:** Web
- **Tags:** Design, Content
- **Status:** Published

**Tip:** You can bulk-import CSV data if you prefer.

### Step 4: Get Your Base ID
1. Open your Portfolio base
2. Look at the URL: `https://airtable.com/app**XXXXXXXXXXXXX**/`
3. Copy the part after `/app` until the next `/` 
4. This is your **Base ID** (save it)

### Step 5: Create API Token
1. Go to **airtable.com/account** (click your avatar, top right)
2. Click **"Tokens"** in the left sidebar
3. Click **"Create new token"**
4. Name it: `Portfolio Dashboard`
5. Under **Scopes**, check: `data.records:read`
6. Under **Access**, select your `Portfolio` base
7. Click **Create token**
8. **Copy the token** and save it (you won't see it again!)

✅ **You now have:**
- Base ID
- API Token

---

## 🛠️ SETUP: Part 2 - GitHub Repo

### Step 1: Create GitHub Repository
1. Go to **github.com** and sign in
2. Click **New** (top left)
3. Name it `portfolio`
4. Make it **Public**
5. Click **Create repository**

### Step 2: Clone or Download Repo Template
You have two options:

**Option A: Use Git (Recommended)**
```bash
# Clone the empty repo
git clone https://github.com/YOUR_USERNAME/portfolio.git
cd portfolio

# Copy all the files I provided into this folder
# Files: package.json, .gitignore, public/, src/
```

**Option B: Upload Files Manually**
1. Create folders: `public/`, `src/`
2. Upload each file to the right location on GitHub web interface
3. Keep the folder structure

### Step 3: Add Environment Variables (Locally)
In your project root, create `.env.local` (never commit this):

```
REACT_APP_AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
REACT_APP_AIRTABLE_TOKEN=patXXXXXXXXXXXXXX
```

Replace with your actual Base ID and Token from Airtable.

### Step 4: Test Locally (Optional)
```bash
npm install
npm start
```
Visit `http://localhost:3000` to see your dashboard live!

---

## 🚀 SETUP: Part 3 - Deploy to Vercel

### Step 1: Sign Up for Vercel
1. Go to **vercel.com**
2. Sign up with your GitHub account
3. Authorize Vercel to access your GitHub repos

### Step 2: Deploy Your Repo
1. In Vercel dashboard, click **Add New...** → **Project**
2. Select your `portfolio` repository
3. Click **Import**

### Step 3: Add Environment Variables
1. Scroll to **Environment Variables** section
2. Add:
   - **Name:** `REACT_APP_AIRTABLE_BASE_ID`
   - **Value:** Your Base ID
3. Click **Add**
4. Add again:
   - **Name:** `REACT_APP_AIRTABLE_TOKEN`
   - **Value:** Your API Token
5. Click **Add**

### Step 4: Deploy!
1. Click **Deploy**
2. Wait 2-3 minutes (grab coffee ☕)
3. See "Congratulations!" message
4. Click **Visit** to see your live dashboard!

✅ **Your portfolio is now live!**

---

## 📝 Update Your Portfolio

### Adding a New Project
1. Go to your **Airtable base**
2. Click **+** to add a new record
3. Fill in: Title, Description, Category, Type, Tags, Status
4. Set **Status** to `Published`
5. Save
6. **Vercel auto-redeploys** (usually within 1-2 minutes)

### Updating an Existing Project
1. Edit the record in Airtable
2. Save
3. Dashboard updates automatically

### Hiding/Archiving Projects
1. Set the project's **Status** to `Draft` or `Archived`
2. It disappears from the dashboard immediately

---

## 🎨 Customization

### Change Colors
Open `src/App.css` and update the `:root` section:
```css
:root {
  --text-primary: #2c2c2a;  /* Main text color */
  --text-secondary: #888780;  /* Supporting text */
  /* ... etc */
}
```

### Change Project Type Colors
In `src/App.jsx`, find the `typeColors` object and edit hex values:
```javascript
const typeColors = {
  Web: '#378ADD',
  Documentation: '#0F6E56',
  // ... customize as needed
};
```

### Add Custom Domain
1. Go to your Vercel project dashboard
2. Click **Settings** → **Domains**
3. Enter your domain (e.g., `portfolio.yourname.com`)
4. Follow DNS instructions
5. Done!

---

## ❓ Troubleshooting

### Dashboard shows error "Missing Airtable credentials"
- Check `.env.local` file exists in your project root
- Verify Base ID and Token are correct
- Restart `npm start`

### "API error: 401"
- Your API token might be wrong or expired
- Regenerate a new token in Airtable account settings

### "API error: 404"
- Your table might not be named exactly `Projects`
- Check Airtable table name matches

### Projects not showing after update
- Make sure Status is set to `Published`
- Only "Published" projects appear
- Wait 1-2 minutes for Vercel to redeploy

### Vercel deployment failed
- Check **Deployments** tab in Vercel for error logs
- Common issue: Node version incompatibility
- Try rebuilding: Click deployment → **Redeploy**

---

## 📱 Mobile Responsive
The dashboard automatically adapts to mobile, tablet, and desktop. No extra work needed!

---

## 🔒 Security
- ✅ API token is only visible in Vercel environment (never in code)
- ✅ `.env.local` is in `.gitignore` (never uploaded to GitHub)
- ✅ API token is read-only (can't modify Airtable)

---

## 📞 Questions?

- **Airtable Help:** airtable.com/help
- **Vercel Help:** vercel.com/docs
- **React Help:** react.dev

---

## 🎉 You're All Set!

Your portfolio is now:
- ✅ Live on the internet
- ✅ Automatically updated when you edit Airtable
- ✅ Professional and visually impressive
- ✅ Easy to maintain

Share your Vercel link: `https://portfolio-XXXXX.vercel.app`

Enjoy! 🚀
