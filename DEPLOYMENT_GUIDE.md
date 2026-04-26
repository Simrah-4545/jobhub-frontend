# JobHub - Complete Deployment Guide
## Deploy FREE Frontend + Backend + Start Earning ₹250/Month

---

## STEP 1: Frontend Deployment (React App) - FREE on Vercel

### 1.1 Create Vercel Account
- Go to: **https://vercel.com**
- Sign up with GitHub (best option) or email
- Click "New Project"

### 1.2 Set Up Project
```bash
# Clone or create your React app
npx create-react-app jobhub-frontend
cd jobhub-frontend

# Or use Vite (faster):
npm create vite@latest jobhub-frontend -- --template react
```

### 1.3 Add Your App Code
1. Replace `src/App.jsx` with the `JobAggregatorApp.jsx` code I provided
2. Install Lucide icons:
```bash
npm install lucide-react
```

### 1.4 Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# From your project folder:
vercel
```
- Follow prompts
- Connect to GitHub repository
- Vercel auto-deploys on every push
- Your URL: `https://jobhub.vercel.app` (or custom domain)

**Cost: FREE** ✓

---

## STEP 2: Backend Deployment - FREE on Render.com

### 2.1 Create Render Account
- Go to: **https://render.com**
- Sign up with GitHub
- Click "New +" → "Web Service"

### 2.2 Connect Repository
1. Create folder `jobhub-backend` with:
   - `backend-server.js` (code I provided)
   - `package.json` (dependencies)
   - `.env` (environment variables)
   - `.gitignore` file (add `.env` to it)

2. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial backend"
git push origin main
```

3. On Render:
   - Select your GitHub repository
   - Set **Start Command**: `npm install && node backend-server.js`
   - Set **Node Version**: 18
   - Add environment variables (from .env)

### 2.3 Set Environment Variables on Render
Go to Environment tab and add:
```
MONGODB_URI=your_mongodb_connection_string
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret
STRIPE_SECRET_KEY=your_stripe_key
FRONTEND_URL=https://jobhub.vercel.app
```

**Cost: FREE** (up to 750 hours/month)

Your backend URL: `https://jobhub-backend.onrender.com`

---

## STEP 3: Database Setup - MongoDB Atlas (FREE)

### 3.1 Create MongoDB Account
- Go to: **https://www.mongodb.com/cloud/atlas**
- Sign up
- Create cluster (FREE tier: 512MB)

### 3.2 Get Connection String
1. Click "Connect"
2. Copy connection string
3. Replace username, password
4. Add to `.env` as `MONGODB_URI`

Example:
```
mongodb+srv://ahmed:password123@cluster0.mongodb.net/jobhub?retryWrites=true&w=majority
```

**Cost: FREE** ✓

---

## STEP 4: Payment Setup

### 4.1 Razorpay (India & UAE)

**For India (₹250/month):**
1. Go to: **https://razorpay.com**
2. Sign up → Get API keys
3. Add to `.env`:
   ```
   RAZORPAY_KEY_ID=rzp_live_xxxxx
   RAZORPAY_KEY_SECRET=your_secret_key
   ```
4. Test mode works immediately
5. Go live (KYC required, 24-48 hours)

**For UAE (10 AED/month):**
- Same Razorpay account works for UAE
- Just add pricing in frontend

**How it works:**
- User pays → Razorpay processes
- Money goes to your bank account (within 24 hours)
- Razorpay fee: 2% + ₹3 per transaction

---

### 4.2 Stripe (USA & Canada)

**For USA/Canada ($10/month):**
1. Go to: **https://stripe.com**
2. Sign up
3. Add to `.env`:
   ```
   STRIPE_PUBLIC_KEY=pk_live_xxxxx
   STRIPE_SECRET_KEY=sk_live_xxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

**How it works:**
- Same process
- Stripe fee: 2.9% + $0.30 per transaction
- Money reaches your account in 2-3 days

**Note:** For international payments, Stripe is better (card payments worldwide)

---

## STEP 5: Job API Integration (Optional but Recommended)

### 5.1 Add Indeed API
1. Register: **https://opensource.indeedeng.io**
2. Get API key
3. Add to backend:
```javascript
// In backend-server.js
const indeedUrl = `https://api.indeed.com/jobs?q=power+bi&location=bangalore&api_key=${process.env.INDEED_API_KEY}`;
const response = await axios.get(indeedUrl);
```

### 5.2 Naukri Scraping (No API needed)
Use **Puppeteer** or **Cheerio** to scrape job listings:
```javascript
const puppeteer = require('puppeteer');

app.get('/api/jobs/naukri', async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.naukri.com/jobs-data-analyst');
  const jobs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.jobTuple')).map(el => ({
      title: el.querySelector('a.title')?.textContent,
      company: el.querySelector('.company')?.textContent,
      location: el.querySelector('.location')?.textContent,
    }));
  });
  await browser.close();
  res.json(jobs);
});
```

Install: `npm install puppeteer`

---

## STEP 6: Custom Domain (Optional)

### Option A: Free Domain
- Use Vercel's free domain: `jobhub.vercel.app`

### Option B: Cheap Domain + Custom Email
1. Buy domain: **Namecheap** (₹99/year) or **GoDaddy**
2. Point to Vercel (DNS settings)
3. Update frontend URL in backend `.env`

---

## STEP 7: Testing & Launch

### 7.1 Test Locally
```bash
# Frontend
cd jobhub-frontend
npm run dev
# Goes to http://localhost:5173

# Backend (in separate terminal)
cd jobhub-backend
npm install
node backend-server.js
# Goes to http://localhost:5000
```

### 7.2 Update API URLs in Frontend
In `JobAggregatorApp.jsx`, replace localhost with your Render backend:
```javascript
const API_URL = 'https://jobhub-backend.onrender.com/api';
// Make API calls:
fetch(`${API_URL}/auth/send-otp`, { ... })
```

### 7.3 Create Landing Page (Optional)
Add a marketing page to explain the value:
```html
<h1>Find Jobs Faster</h1>
<p>Aggregates jobs from LinkedIn, Naukri, Indeed, Bayt - All in one place</p>
<p>₹250/month (India) | 10 AED/month (UAE) | $10/month (USA/Canada)</p>
<button>Subscribe Now</button>
```

---

## STEP 8: Marketing & Getting First Users

### Quick Win Strategy:
1. **LinkedIn**: Post that you built a job aggregator
   - "Built a job aggregator in 48 hours - jobhub.vercel.app"
   - Get 20-30 views = 2-3 paying customers = ₹500-750/month

2. **GitHub**: Share code
   - People love supporting indie builders
   - Even if they don't subscribe, it builds credibility

3. **Twitter/X**: "I built a free job aggregator for Indians. Link in bio."

4. **Job Boards**: Post in r/forhire, IndieHackers, ProductHunt

5. **WhatsApp Groups**: Share with 10-15 jobless friends
   - If 3 pay = ₹750/month income

---

## STEP 9: Scaling to Multiple Regions

Once working in India, expand:
1. **UAE**: Change pricing to 10 AED (easy update)
2. **USA/Canada**: Add Stripe for $10/month
3. **Global**: Add more job sources (AngelList, Indeed global)

---

## Cost Breakdown (ZERO Upfront)

| Service | Cost | Notes |
|---------|------|-------|
| Vercel (Frontend) | FREE | ∞ | 
| Render (Backend) | FREE | 750 hrs/mo |
| MongoDB | FREE | 512MB storage |
| Razorpay | 2% + ₹3 | Per transaction |
| Stripe | 2.9% + $0.30 | Per transaction |
| Domain | ₹0-500/yr | Optional |
| **TOTAL** | **₹0** | All free to start |

---

## Income Projection (Conservative)

**Month 1:**
- 10 users from LinkedIn post
- 3 pay = ₹750 (India @ ₹250)
- Your profit: ₹500 (after Razorpay fee)

**Month 2:**
- Word of mouth + organic
- 20 users paying
- ₹5,000 revenue

**Month 3:**
- 50+ users
- ₹12,500/month
- Scale to UAE/US

---

## Troubleshooting

### Issue: Payment not going through
**Solution:** Check Razorpay test credentials. In test mode, use:
- Card: 4111 1111 1111 1111
- Expiry: 12/25
- CVV: 123

### Issue: Backend not connecting to frontend
**Solution:** Check CORS. In backend add:
```javascript
app.use(cors({
  origin: 'https://jobhub.vercel.app',
  credentials: true
}));
```

### Issue: MongoDB connection fails
**Solution:** Check if your IP is whitelisted in MongoDB Atlas
- Network Access → Add IP: 0.0.0.0/0 (allow all)

---

## Next Steps

1. ✅ Create GitHub repo
2. ✅ Deploy frontend to Vercel
3. ✅ Deploy backend to Render
4. ✅ Set up Razorpay + Stripe
5. ✅ Test payment flow
6. ✅ Launch & share on LinkedIn
7. ✅ Monitor earnings

---

**You're ready to launch in 2 days and start earning!**

Questions? Ask me to help debug deployment issues.