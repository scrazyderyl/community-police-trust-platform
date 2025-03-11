# 🛡️ Community Law Enforcement Complaint Tracker
# Link: [Misconduct Complaint App](https://misconduct-complain-app.vercel.app/)

A full-stack, responsive web application built with **Next.js**, **React.js**, **Node.js**, and **Tailwind CSS** to empower community members to report, update, and track law enforcement misconduct complaints. The platform leverages **Firestore** for real-time data storage and **HERE Maps API** for interactive location-based complaint lookup.

---

## 🚀 Features

- 🌍 **Interactive Map View (HERE Maps API)**  
  Search or click on the map to view municipality-specific complaint filing information.

- 📋 **Create & Track Complaints**  
  Users can submit misconduct complaint records without personal information and track updates using a unique receipt string.

- 🔐 **Secure Record Update via Receipt String**  
  Users can update their complaint records by entering a unique auto-generated receipt code.

- 📧 **Automated Email Notification (SendGrid API)**  
  Upon record submission, the system emails the receipt string to the user’s provided email address.

- 📈 **Community Tracker Dashboard**  
  A summary table shows submitted, in-progress, and addressed complaints by municipality.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js, React.js, Tailwind CSS  
- **Backend**: Node.js (API Routes)  
- **Database**: Firebase Firestore (NoSQL, real-time updates)  
- **Geolocation Services**: HERE Maps JavaScript API  
- **Email Service**: SendGrid API (Single Sender mode)  
- **Deployment**: Vercel (CI/CD integrated)

---

## 📦 Setup & Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/your-username/community-complaint-tracker.git
cd community-complaint-tracker

# 2. Install dependencies
npm install

# 3. Add your environment variables
touch .env.local
# Add:
# NEXT_PUBLIC_HERE_MAPS_API_KEY=your_here_api_key
# SENDGRID_API_KEY=your_sendgrid_key
# FIREBASE_API_KEYS...

# 4. Start dev server
npm run dev
```


