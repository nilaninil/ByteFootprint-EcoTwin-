# ByteFootprint × EcoTwin 🌱

Your carbon footprint, given a pulse.

Built for PixxelHack 2.0 — a National Level Web Development Hackathon by TCET-ACM-SIGITE Student Chapter.

🔗 Live App: bytefootprintxecotwin.vercel.app

# The Problem

Most students believe staying indoors and streaming instead of driving automatically makes them eco-friendly. They're often wrong — and no existing student sustainability tool tells them so. Every competing app tracks physical habits (transport, food, energy) because those are visible and intuitive. Nobody tracks the carbon cost of streaming in 4K, backing up files to the cloud, or sending large email attachments.

 # The Solution

ByteFootprint × EcoTwin tracks the one carbon source every student generates daily but no other app measures — digital footprint — alongside standard transport, food, and energy habits. Instead of a static score, the result is delivered through EcoTwin, a living tree companion that visibly thrives or wilts based on real behavior, turning an invisible number into something you actually feel and return to daily.

# Features
🌳 EcoTwin Growth System — an animated tree companion with multiple growth stages (Wilted → Recovering → Budding → Thriving → Flourishing), reacting in real time to logged habits
📊 Carbon Footprint Estimator — emission-factor calculations across Transport, Food, Household & Energy, and Digital Footprint (streaming, cloud storage, email, video calls)
🎯 Personalized Eco Challenges — one actionable challenge generated daily from the user's worst-impact category
🏆 Green Score & Consistency/Streak Tracker — a live score plus streak-based accountability
🎖️ Achievement Badges — unlockable milestones for consistent habits
♻️ Recycling & E-Waste Bin Guide — searchable disposal reference, including dedicated tech/e-waste categories (old laptops, phones, charging cables)
💡 Daily Eco Tips — rotating knowledge cards, including digital-carbon facts most users have never seen (e.g. "the 4K video myth")
📈 Footprint Trends & Filmstrip — category-wise footprint history and a visual record of the tree's growth journey over time
🔒 Local-first & Private — no backend accounts required; users' data stays local, never shared
# Tech Stack
React + TypeScript — component architecture
Tailwind CSS — responsive, utility-first styling
Framer Motion — EcoTwin animations and transitions
Chart.js / Recharts — footprint trend visualizations
Vite — build tooling
Vercel — deployment
# How It Works
Log Daily Habits (Transport · Food · Energy · Digital)
        ↓
Emission-Factor Engine (real published sources: IEA, IPCC)
        ↓
Worst-Impact Category Detected  →  usually: Digital Footprint
        ↓
EcoTwin Visual State Updates  +  Personalized Challenge Generated
        ↓
Trend Dashboard (Green Score, History, Badges, Streaks)

All core calculations run client-side using published emission-factor research — no black-box AI model, no unverifiable numbers.

# Getting Started Locally
bash
# Clone the repository
git clone <repo-url>
cd bytefootprint-ecotwin

# Install dependencies
npm install
# or: bun install

# Run locally
npm run dev

The app will be available at http://localhost:5173 by default (Vite).

📚 Research & References
IEA — Digitalization & Energy Report (iea.org)
The Shift Project — Lean ICT: Towards Digital Sobriety (theshiftproject.org)
Malmodin & Lundén (2018) — Energy & Carbon Footprint of Global ICT/E&M Sectors, Sustainability journal
Aslan et al. (2021) — Electricity Intensity of Internet Data Transmission, Journal of Industrial Ecology
IPCC Guidelines for National Greenhouse Gas Inventories — Emission Factors for Electricity
Green Web Foundation (greenwebfoundation.org) & Google Environmental Insights Explorer
👥 Team — Code Masters

# Built for PixxelHack 2.0, TCET-ACM-SIGITE Student Chapter.

Nilani S — Concept, product design, UI/UX direction, core application build

Harshana B — Concept, deployment, logistics, submission 
# 📄 License

Built as a hackathon project for PixxelHack 2.0. Educational use.
