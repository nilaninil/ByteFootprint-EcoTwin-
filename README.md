ByteFootprint × EcoTwin 🌱

Your carbon footprint, given a pulse.

Built for PixxelHack 2.0 — a National Level Web Development Hackathon by TCET-ACM-SIGITE.

The Problem

Most sustainability apps assume the problem is visibility — students overspend their carbon budget because they can't see where it goes. But there's a deeper blind spot: students who stay in and stream instead of driving already feel eco-conscious for it — and they're often wrong. No existing student sustainability tool tracks the carbon cost of digital habits: streaming, cloud storage, and email.

The Solution

ByteFootprint × EcoTwin tracks the one carbon source every student generates daily but no other app measures — digital footprint — alongside standard transport, food, and energy habits. Instead of a static score, the result is delivered through EcoTwin, a living tree companion that visibly thrives or wilts based on your real footprint, turning an invisible number into something you actually feel and return to daily.

✨ Features
🌳 EcoTwin — an illustrated, animated tree companion with 5 growth stages (Wilted → Recovering → Budding → Thriving → Flourishing), reacting to your real habits
📊 Carbon Footprint Estimator — real emission-factor calculations across Transport, Food, Energy, and Digital (streaming, cloud, email)
🎯 Personalized Eco Challenges — one actionable challenge generated daily from your worst-impact category
🏆 Green Score & Badges — a live score plus unlockable achievements for streaks and milestones
♻️ Recycling & E-Waste Guide — searchable disposal reference, including tech/e-waste
💡 Daily Eco Tips — rotating knowledge cards, including digital-carbon facts most people have never seen
📈 Trends & Filmstrip — footprint history by category over time, plus a visual record of your twin's growth journey
🔒 Local-only profile — no real accounts, no backend, no data ever leaves your browser
🛠️ Tech Stack
React.js — component architecture
Tailwind CSS — responsive, utility-first styling
Framer Motion — EcoTwin animations and page transitions
Chart.js — footprint trend visualization
Web Storage API (localStorage) — fully client-side persistence, no backend or database
⚙️ How It Works
Log Daily Habits (Transport · Food · Energy · Digital)
        ↓
Emission-Factor Engine (real published sources: IEA, IPCC)
        ↓
Worst-Impact Category Detected  →  usually: Digital
        ↓
EcoTwin Visual State Updates  +  Personalized Challenge Generated
        ↓
Trend Dashboard (Green Score, History, Badges)

All calculations run entirely client-side. No server, no API keys, no user accounts — your data lives only in your browser's local storage.

🚀 Getting Started
bash
# Clone the repository
git clone <repo-url>
cd bytefootprint-ecotwin

# Install dependencies
npm install

# Run locally
npm run dev

The app will be available at http://localhost:5173 (or your framework's default port).
