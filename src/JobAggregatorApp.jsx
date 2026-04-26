import React, { useState, useEffect } from 'react';
import { Briefcase, Search, Heart, LogOut, Menu, X, Lock } from 'lucide-react';

const JobAggregatorApp = () => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('India');
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  // Mock data - Replace with real API calls
  const mockJobs = {
    'India': [
      { id: 1, title: 'Power BI Developer', company: 'TCS', location: 'Bangalore', salary: '₹8-12 LPA', link: 'https://www.linkedin.com/jobs' },
      { id: 2, title: 'Data Analyst', company: 'Infosys', location: 'Pune', salary: '₹6-10 LPA', link: 'https://www.naukri.com' },
      { id: 3, title: 'Full Stack Engineer', company: 'Flipkart', location: 'Bangalore', salary: '₹12-18 LPA', link: 'https://www.indeed.co.in' },
      { id: 4, title: 'SQL Developer', company: 'Accenture', location: 'Mumbai', salary: '₹7-11 LPA', link: 'https://www.naukri.com' },
      { id: 5, title: 'Data Engineer', company: 'Amazon', location: 'Bangalore', salary: '₹15-25 LPA', link: 'https://www.linkedin.com/jobs' },
    ],
    'UAE': [
      { id: 6, title: 'Power BI Specialist', company: 'ADNOC', location: 'Abu Dhabi', salary: 'AED 8,000-12,000', link: 'https://www.bayt.com' },
      { id: 7, title: 'Business Analyst', company: 'Emaar', location: 'Dubai', salary: 'AED 7,000-10,000', link: 'https://www.bayt.com' },
      { id: 8, title: 'Data Analyst', company: 'ENOC', location: 'Dubai', salary: 'AED 6,500-9,500', link: 'https://www.bayt.com' },
      { id: 9, title: 'Full Stack Developer', company: 'Noon', location: 'Dubai', salary: 'AED 10,000-15,000', link: 'https://www.linkedin.com/jobs' },
      { id: 10, title: 'Solutions Architect', company: 'Etisalat', location: 'Abu Dhabi', salary: 'AED 12,000-16,000', link: 'https://www.bayt.com' },
    ],
    'USA': [
      { id: 11, title: 'Power BI Engineer', company: 'Microsoft', location: 'Seattle', salary: '$120,000-160,000', link: 'https://www.linkedin.com/jobs' },
      { id: 12, title: 'Data Scientist', company: 'Google', location: 'Mountain View', salary: '$150,000-200,000', link: 'https://careers.google.com' },
      { id: 13, title: 'Full Stack Developer', company: 'Amazon', location: 'New York', salary: '$130,000-180,000', link: 'https://www.indeed.com' },
      { id: 14, title: 'Analytics Engineer', company: 'Netflix', location: 'Los Angeles', salary: '$140,000-190,000', link: 'https://www.linkedin.com/jobs' },
      { id: 15, title: 'Data Engineer', company: 'Meta', location: 'San Francisco', salary: '$160,000-220,000', link: 'https://www.linkedin.com/jobs' },
    ],
    'Canada': [
      { id: 16, title: 'Power BI Developer', company: 'RBC', location: 'Toronto', salary: 'CAD $90,000-130,000', link: 'https://www.linkedin.com/jobs' },
      { id: 17, title: 'Data Analyst', company: 'TD Bank', location: 'Vancouver', salary: 'CAD $85,000-120,000', link: 'https://www.indeed.ca' },
      { id: 18, title: 'Full Stack Engineer', company: 'Shopify', location: 'Ottawa', salary: 'CAD $110,000-160,000', link: 'https://www.linkedin.com/jobs' },
      { id: 19, title: 'Solutions Architect', company: 'IBM', location: 'Montreal', salary: 'CAD $100,000-150,000', link: 'https://www.indeed.ca' },
      { id: 20, title: 'Database Developer', company: 'Telus', location: 'Calgary', salary: 'CAD $95,000-135,000', link: 'https://www.linkedin.com/jobs' },
    ]
  };

  const pricingPlans = {
    'India': { price: 250, currency: '₹', period: 'month' },
    'UAE': { price: 10, currency: 'AED', period: 'month' },
    'USA': { price: 10, currency: '$', period: 'month' },
    'Canada': { price: 10, currency: 'CAD', period: 'month' }
  };

  // Mock OTP verification
  const handleSendOtp = () => {
    if (!phone || !email) {
      alert('Please enter phone and email');
      return;
    }
    setShowOtp(true);
    alert(`OTP sent to ${phone} (Mock: Use any 4 digits)`);
  };

  const handleVerifyOtp = () => {
    if (otp.length === 4) {
      setUser({ phone, email, location: 'India' });
      setCurrentPage('subscription');
      setPhone('');
      setEmail('');
      setOtp('');
      setShowOtp(false);
    } else {
      alert('Please enter 4-digit OTP');
    }
  };

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      const filtered = mockJobs[selectedLocation]?.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase())
      ) || [];
      setJobs(filtered);
      setLoading(false);
    }, 500);
  };

  const toggleSaveJob = (job) => {
    const isSaved = savedJobs.some(j => j.id === job.id);
    if (isSaved) {
      setSavedJobs(savedJobs.filter(j => j.id !== job.id));
    } else {
      setSavedJobs([...savedJobs, job]);
    }
  };

  const handleSubscribe = (location) => {
    const plan = pricingPlans[location];
    alert(`Processing payment: ${plan.currency}${plan.price}/${plan.period} via Razorpay/Stripe\n\nThis will redirect to payment gateway.`);
    setSubscription(location);
    setCurrentPage('jobs');
    loadJobsForLocation(location);
  };

  const loadJobsForLocation = (location) => {
    setSelectedLocation(location);
    setJobs(mockJobs[location] || []);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
    setSavedJobs([]);
    setSubscription(null);
  };

  // LOGIN PAGE
  if (currentPage === 'login' && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          <div className="flex items-center justify-center mb-8">
            <Briefcase className="w-10 h-10 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">JobHub</h1>
          </div>
          
          <h2 className="text-xl font-semibold text-center mb-6 text-gray-700">Find Your Dream Job</h2>

          {!showOtp ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email ID</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <button
                onClick={handleSendOtp}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Send OTP
              </button>
            </>
          ) : (
            <>
              <div className="mb-6 text-center">
                <p className="text-gray-600 mb-4">OTP sent to {phone}</p>
                <input
                  type="text"
                  placeholder="Enter 4-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.slice(0, 4))}
                  maxLength="4"
                  className="w-full px-4 py-3 text-center text-2xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none tracking-widest"
                />
              </div>

              <button
                onClick={handleVerifyOtp}
                className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Verify OTP
              </button>

              <button
                onClick={() => setShowOtp(false)}
                className="w-full mt-2 text-blue-600 py-2 font-semibold hover:underline"
              >
                Back
              </button>
            </>
          )}

          <p className="text-center text-gray-600 text-sm mt-6">
            Secure login • Monthly billing • Cancel anytime
          </p>
        </div>
      </div>
    );
  }

  // SUBSCRIPTION PAGE
  if (currentPage === 'subscription' && user && !subscription) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Plan</h1>
            <p className="text-gray-600">Access jobs in your region</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(pricingPlans).map(([region, plan]) => (
              <div key={region} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{region}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-blue-600">{plan.currency}{plan.price}</span>
                  <span className="text-gray-600 ml-2">/{plan.period}</span>
                </div>
                <ul className="text-sm text-gray-600 mb-6 space-y-2">
                  <li>✓ Access to {region} jobs</li>
                  <li>✓ Job alerts</li>
                  <li>✓ Save favorites</li>
                  <li>✓ Apply tracking</li>
                </ul>
                <button
                  onClick={() => handleSubscribe(region)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Subscribe Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // JOBS PAGE
  if (currentPage === 'jobs' && user && subscription) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <Briefcase className="w-8 h-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">JobHub</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-gray-600">{user.email}</span>
              <button
                onClick={() => setCurrentPage('saved')}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Saved ({savedJobs.length})
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>

            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden"
            >
              {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {showMenu && (
            <div className="md:hidden bg-gray-100 p-4 space-y-2">
              <button onClick={() => setCurrentPage('saved')} className="block w-full text-left text-blue-600 py-2">
                Saved Jobs ({savedJobs.length})
              </button>
              <button onClick={handleLogout} className="block w-full text-left text-red-600 py-2">
                Logout
              </button>
            </div>
          )}
        </header>

        {/* Search Section */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Job title or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
              />
              <select
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  setJobs(mockJobs[e.target.value] || []);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
              >
                {Object.keys(pricingPlans).map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {loading ? (
            <div className="text-center text-gray-600">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center text-gray-600">No jobs found. Try a different search.</div>
          ) : (
            <div className="space-y-4">
              {jobs.map(job => (
                <div key={job.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
                      <p className="text-gray-600">{job.company} • {job.location}</p>
                      <p className="text-lg font-semibold text-blue-600 mt-2">{job.salary}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleSaveJob(job)}
                        className={`p-2 rounded-lg transition ${
                          savedJobs.some(j => j.id === job.id)
                            ? 'bg-red-100 text-red-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <Heart className="w-5 h-5" fill="currentColor" />
                      </button>
                      <a
                        href={job.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Apply
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // SAVED JOBS PAGE
  if (currentPage === 'saved' && user && subscription) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Saved Jobs</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentPage('jobs')}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Back to Jobs
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {savedJobs.length === 0 ? (
            <div className="text-center text-gray-600 py-12">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p>No saved jobs yet. Start saving your favorites!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedJobs.map(job => (
                <div key={job.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
                      <p className="text-gray-600">{job.company} • {job.location}</p>
                      <p className="text-lg font-semibold text-blue-600 mt-2">{job.salary}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleSaveJob(job)}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        <Heart className="w-5 h-5" fill="currentColor" />
                      </button>
                      <a
                        href={job.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Apply
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default JobAggregatorApp;