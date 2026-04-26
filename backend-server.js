// JobHub Backend - Node.js + Express
// Deploy on Render.com, Railway.app, or Vercel Functions (free)

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const Razorpay = require('razorpay');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// ==================== DATABASE SETUP ====================
// MongoDB Atlas (Free Tier: 512MB storage, enough for MVP)
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Database Schemas
const UserSchema = new mongoose.Schema({
  phone: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now },
  subscription: {
    region: String,
    status: { type: String, enum: ['active', 'inactive', 'expired'], default: 'inactive' },
    startDate: Date,
    expiryDate: Date,
    amount: Number,
    currency: String,
  },
  savedJobs: [{ type: Object }],
});

const TransactionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  phone: String,
  amount: Number,
  currency: String,
  paymentId: String,
  orderId: String,
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  gateway: { type: String, enum: ['razorpay', 'stripe'] },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);

// ==================== PAYMENT SETUP ====================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ==================== AUTHENTICATION ====================
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { phone, email } = req.body;

    // Validate input
    if (!phone || !email) {
      return res.status(400).json({ error: 'Phone and email required' });
    }

    // In production, send real OTP via Twilio/AWS SNS
    // For now, mock OTP
    const otp = Math.floor(1000 + Math.random() * 9000);
    console.log(`OTP for ${phone}: ${otp}`); // In production, log to database

    // Store OTP in Redis (or temp database) with 5-minute expiry
    // redis.setex(`otp:${phone}`, 300, otp);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      mockOtp: otp, // Remove in production!
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { phone, email, otp } = req.body;

    // Verify OTP
    // In production: const storedOtp = redis.get(`otp:${phone}`);
    // For MVP: accept any 4-digit number

    if (otp.length !== 4) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Find or create user
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone, email });
    }

    res.json({
      success: true,
      userId: user._id,
      message: 'Authentication successful',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== JOB AGGREGATION ====================
// Integrate with Indeed, Naukri, Bayt APIs
app.get('/api/jobs/search', async (req, res) => {
  try {
    const { location, query } = req.query;

    // Integrate real job APIs here
    // Example: Indeed API, Naukri scraping, Bayt.com API

    const jobs = {
      'India': [
        {
          id: 1,
          title: 'Power BI Developer',
          company: 'TCS',
          location: 'Bangalore',
          salary: '₹8-12 LPA',
          source: 'naukri',
          link: 'https://www.naukri.com',
          description: 'Develop interactive Power BI dashboards for enterprise clients',
          posted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        // Add more jobs...
      ],
      'UAE': [
        {
          id: 6,
          title: 'Power BI Specialist',
          company: 'ADNOC',
          location: 'Abu Dhabi',
          salary: 'AED 8,000-12,000',
          source: 'bayt',
          link: 'https://www.bayt.com',
          description: 'Design and implement BI solutions for energy sector',
          posted: new Date(),
        },
      ],
    };

    res.json({
      success: true,
      jobs: jobs[location] || [],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PAYMENT PROCESSING ====================
// Create Razorpay Order (for India/UAE)
app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { userId, amount, currency, region } = req.body;

    const options = {
      amount: amount * 100, // Convert to paise
      currency: currency,
      receipt: `order_${userId}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save transaction to database
    const transaction = await Transaction.create({
      userId,
      amount,
      currency,
      orderId: order.id,
      status: 'pending',
      gateway: 'razorpay',
    });

    res.json({
      success: true,
      order,
      transactionId: transaction._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify Razorpay Payment
app.post('/api/payment/verify-razorpay', async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    const crypto = require('crypto');

    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(orderId + '|' + paymentId)
      .digest('hex');

    if (generated_signature === signature) {
      // Payment successful
      const transaction = await Transaction.findOneAndUpdate(
        { orderId },
        { status: 'completed', paymentId },
        { new: true }
      );

      // Update user subscription
      const user = await User.findById(transaction.userId);
      user.subscription.status = 'active';
      user.subscription.startDate = new Date();
      user.subscription.expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      await user.save();

      res.json({
        success: true,
        message: 'Payment verified and subscription activated',
      });
    } else {
      res.status(400).json({ error: 'Payment verification failed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Stripe Payment Intent (for USA/Canada)
app.post('/api/payment/create-intent', async (req, res) => {
  try {
    const { userId, amount, currency } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      metadata: { userId },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook for Stripe (handle payment completion)
app.post('/api/payment/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const { metadata } = event.data.object;
    const user = await User.findById(metadata.userId);

    user.subscription.status = 'active';
    user.subscription.startDate = new Date();
    user.subscription.expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await user.save();
  }

  res.json({ received: true });
});

// ==================== SAVED JOBS ====================
app.post('/api/jobs/save', async (req, res) => {
  try {
    const { userId, job } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { savedJobs: job } },
      { new: true }
    );
    res.json({ success: true, savedJobs: user.savedJobs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/jobs/saved/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.json({ success: true, savedJobs: user.savedJobs || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SUBSCRIPTION MANAGEMENT ====================
app.get('/api/subscription/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.json({
      success: true,
      subscription: user.subscription,
      isActive: user.subscription.status === 'active' && new Date() < user.subscription.expiryDate,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auto-renew subscription (Cron job)
// Use node-cron or AWS Lambda to check expirations daily
const cron = require('node-cron');
cron.schedule('0 0 * * *', async () => {
  const expiredUsers = await User.find({
    'subscription.expiryDate': { $lt: new Date() },
    'subscription.status': 'active',
  });

  for (const user of expiredUsers) {
    user.subscription.status = 'expired';
    await user.save();
  }
  console.log(`Checked ${expiredUsers.length} expired subscriptions`);
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`JobHub Backend running on port ${PORT}`);
});

// Export for Vercel Functions
module.exports = app;