# JobHub - Job Aggregator with Subscription Model

A full-stack job aggregation platform that collects jobs from LinkedIn, Naukri, Indeed, Bayt and other job sites into one dashboard. Users subscribe monthly to access jobs in their region.

---

## 📊 Business Model

```
Users pay monthly subscription:
├─ India: ₹250/month
├─ UAE: 10 AED/month
├─ USA: $10/month
└─ Canada: $10/month

Your revenue (after payment gateway fees ~3-5%):
├─ 10 users = ₹2,000-2,350/month
├─ 50 users = ₹10,000-11,750/month
└─ 100 users = ₹20,000-23,500/month
```

---

## 🎯 Key Features

✅ **Phone + Email Login** - OTP-based authentication
✅ **Job Search & Filter** - By location, title, company
✅ **Save Favorite Jobs** - Personal job list
✅ **Multi-region Jobs** - India, UAE, USA, Canada
✅ **Monthly Billing** - Razorpay (India/UAE) + Stripe (USA/Canada)
✅ **Application Tracking** - Track applied jobs
✅ **Mobile Responsive** - Works on phone/tablet/desktop

---

## 📁 Project Structure

```
jobhub/
├── jobhub-frontend/           # React app (Vercel)
│   ├── src/
│   │   └── App.jsx            # Main component (JobAggregatorApp.jsx)
│   ├── package.json
│   └── .vercelignore
│
├── jobhub-backend/            # Node.js server (Render)
│   ├── backend-server.js      # Express server + API routes
│   ├── package.json
│   ├── .env                   # Environment variables (SECRET)
│   └── .gitignore
│
└── Documentation/
    ├── DEPLOYMENT_GUIDE.md    # Step-by-step deployment
    └── README.md              # This file
```

---

## 🚀 Quick Start (5 Minutes)

### 1. Clone/Download Project Files
```bash
# Create folders
mkdir jobhub
cd jobhub

# Copy files from outputs:
# - JobAggregatorApp.jsx (→ frontend)
# - backend-server.js (→ backend)
# - package.json (→ backend)
# - .env.example (→ backend, rename to .env)
# - DEPLOYMENT_GUIDE.md (for reference)
```

### 2. Test Locally (Optional)

**Frontend:**
```bash
npx create-react-app jobhub-frontend
cd jobhub-frontend
npm install lucide-react
# Replace src/App.jsx with JobAggregatorApp.jsx code
npm run dev
# Opens http://localhost:3000
```

**Backend:**
```bash
cd jobhub-backend
npm install
# Update .env with real credentials
node backend-server.js
# Server runs on http://localhost:5000
```

### 3. Deploy to Free Platforms

**Frontend → Vercel (2 minutes):**
```bash
npm i -g vercel
cd jobhub-frontend
vercel
# Auto-deploys, gives you live URL
```

**Backend → Render.com (2 minutes):**
1. Go to https://render.com
2. Connect GitHub repo
3. Add environment variables
4. Deploy

**Database → MongoDB Atlas (1 minute):**
1. Go to https://mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Add to `.env` on Render

**Payments → Razorpay (1 minute):**
1. Go to https://razorpay.com
2. Sign up → Get API keys
3. Add keys to `.env` on Render

---

## 💰 How to Earn

### Month 1: Build Awareness
1. Post on LinkedIn: "Built a job aggregator in 48 hours"
2. Share GitHub link
3. Get 10-20 visitors
4. **Target:** 3-5 paying customers = ₹750-1,250

### Month 2: Grow Organically
1. Improve job coverage (add more sources)
2. Share on Twitter, Reddit, IndieHackers
3. Ask friends to invite friends (referral)
4. **Target:** 15-20 paying customers = ₹3,750-5,000

### Month 3: Expand Regions
1. Add UAE (10 AED = ₹100 per month per user)
2. Add USA/Canada ($10/month)
3. Optimize conversion (landing page)
4. **Target:** 50+ users across regions = ₹15,000+/month

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP and create user

### Jobs
- `GET /api/jobs/search?location=India&query=power+bi` - Search jobs
- `POST /api/jobs/save` - Save job to favorites
- `GET /api/jobs/saved/:userId` - Get saved jobs

### Payments
- `POST /api/payment/create-order` - Create Razorpay order (India/UAE)
- `POST /api/payment/verify-razorpay` - Verify payment
- `POST /api/payment/create-intent` - Create Stripe intent (USA/Canada)
- `POST /api/payment/stripe-webhook` - Handle Stripe webhook

### Subscription
- `GET /api/subscription/:userId` - Check subscription status

---

## 🔐 Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
# Database
MONGODB_URI=mongodb+srv://...

# Payments
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
STRIPE_SECRET_KEY=sk_...

# Email (optional)
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your_app_password
```

⚠️ **Never commit `.env` to GitHub!**

---

## 📱 Mobile Optimization

App is fully responsive:
- ✅ Works on iPhone/Android
- ✅ Touch-friendly buttons
- ✅ Mobile menu
- ✅ Fast loading

---

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Tailwind CSS (styling)
- Lucide Icons
- Vite (build tool)

**Backend:**
- Node.js + Express
- MongoDB (database)
- Razorpay (India/UAE payments)
- Stripe (USA/Canada payments)
- Mongoose (ORM)

**Deployment:**
- Vercel (frontend, free)
- Render.com (backend, free)
- MongoDB Atlas (database, free 512MB)

---

## 📈 Metrics to Track

1. **Users:** Total signups (check MongoDB)
2. **Conversion:** Users who subscribe / Total users
3. **Revenue:** Monthly recurring
4. **Retention:** Users who renew (should be high for 30-day subscription)
5. **Traffic:** Google Analytics (add to landing page)

---

## 🐛 Common Issues & Solutions

### "Backend not connecting to frontend"
- Check CORS in backend
- Verify API URL matches your Render backend URL
- Check browser console for errors

### "Razorpay payment failing"
- Are you using test keys? Switch to live keys when ready
- Check webhook is configured
- Verify mobile number format (+91 or 0?)

### "MongoDB connection timeout"
- Add your IP to MongoDB Atlas whitelist
- Use 0.0.0.0/0 to allow all IPs (not secure for production)
- Check connection string format

### "OTP not sending"
- Currently mocked (for testing)
- To enable real OTP: integrate Twilio
- Cost: $0.0075 per SMS

---

## 🚢 Going Live Checklist

- [ ] Frontend deployed on Vercel
- [ ] Backend deployed on Render
- [ ] MongoDB cluster created
- [ ] Razorpay account created (test mode works)
- [ ] Stripe account created (test mode works)
- [ ] Test full payment flow (end-to-end)
- [ ] Share on LinkedIn/Twitter/GitHub
- [ ] Get first 10 users
- [ ] Collect feedback
- [ ] Go live with live API keys

---

## 💡 Future Ideas (Phase 2)

1. **Referral Program** - Users earn ₹50 per referral
2. **Resume Builder** - Users can upload resume
3. **Email Alerts** - Daily job matches
4. **Job Board Scraper** - Add more sources (Glassdoor, AngelList, etc.)
5. **AI Matching** - Show jobs matching user's skills
6. **Chat Support** - Help users navigate
7. **Mobile App** - Native iOS/Android app
8. **Pricing Tiers** - Free (limited) vs Premium

---

## 📞 Support & Questions

If stuck on deployment:
1. Check DEPLOYMENT_GUIDE.md
2. Read error messages carefully
3. Google the exact error
4. Check Stack Overflow

---

## 💪 Mindset

This is your **immediate income tool** while job hunting:
- Day 1-2: Build & deploy
- Day 3: Share on LinkedIn
- Day 7: First paying customer ✅
- Month 1: ₹750-1,250 income
- Month 3: ₹15,000+/month

**You've got the skills (Power BI, Data, Full Stack) — now you have the product. Execute.**

---

**Good luck! You've got this. 🚀**