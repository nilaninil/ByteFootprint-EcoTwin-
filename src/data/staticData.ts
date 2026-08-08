import { Challenge, Badge, EcoTip, RecyclingItem, TwinStageInfo } from '../types';

export const TWIN_STAGES: Record<number, TwinStageInfo> = {
  1: {
    stage: 1,
    name: "Wilted",
    statusLine: "Your twin needs care — try logging lower carbon habits today",
    description: "Your carbon footprint is noticeably elevated. Lowering your streaming quality and taking public transit can revive your tree!",
    color: "#D97706",
    bgGradient: "from-amber-100/60 to-orange-50/40"
  },
  2: {
    stage: 2,
    name: "Recovering",
    statusLine: "Your twin is recovering — small daily steps lead to steady growth",
    description: "New green shoots are sprouting! You're making conscious efforts to reduce daily emissions.",
    color: "#84CC16",
    bgGradient: "from-lime-100/60 to-emerald-50/40"
  },
  3: {
    stage: 3,
    name: "Budding",
    statusLine: "Your twin is budding — steady eco habits are working great",
    description: "A healthy, vibrant canopy with promising leaf buds. Your footprint is well balanced across all 4 categories.",
    color: "#22C55E",
    bgGradient: "from-emerald-100/60 to-green-50/40"
  },
  4: {
    stage: 4,
    name: "Thriving",
    statusLine: "Your twin is thriving — keep up the fantastic eco habits!",
    description: "A lush, radiant green canopy with sparkling leaves. Your digital and physical emissions are consistently low.",
    color: "#16A34A",
    bgGradient: "from-green-100/80 to-teal-50/50"
  },
  5: {
    stage: 5,
    name: "Flourishing",
    statusLine: "Your twin is flourishing — you are a true sustainability champion!",
    description: "A majestic, blooming tree with golden fruits and flowers! You've mastered digital detoxes and sustainable living.",
    color: "#059669",
    bgGradient: "from-emerald-200/80 to-teal-100/60"
  }
};

export const ALL_CHALLENGES: Challenge[] = [
  {
    id: "digital-720p",
    title: "Stream at 720p HD Today",
    description: "Switch video resolution from 4K/1080p down to 720p or HD on YouTube or Netflix. It cuts digital server energy usage by up to 70%!",
    category: "digital",
    impactKgSaved: 0.9,
    points: 15,
    actionText: "Lower Resolution Set",
    digitalFact: "1 hour of 4K streaming generates ~350g CO2 — switching to 720p saves over 250g CO2 per hour!"
  },
  {
    id: "digital-inbox-clean",
    title: "Digital Inbox Detox",
    description: "Unsubscribe from 5 promotional newsletters and delete old attachment-heavy emails sitting in server storage.",
    category: "digital",
    impactKgSaved: 0.5,
    points: 10,
    actionText: "Inbox Cleaned",
    digitalFact: "Storing 1,000 unread marketing emails in cloud server racks uses ~10kg CO2 per year in cooling."
  },
  {
    id: "digital-audio-mode",
    title: "Audio-Only Mode for Music",
    description: "Listen to music or podcasts via audio stream instead of playing video files on background tabs.",
    category: "digital",
    impactKgSaved: 0.7,
    points: 12,
    actionText: "Audio Mode Used",
    digitalFact: "Streaming music with video requires 20x to 50x more bandwidth than an audio-only stream."
  },
  {
    id: "transport-transit",
    title: "Public Transit or Pedal Power",
    description: "Replace at least one car trip today with a bus, commuter rail, bicycle, or walking.",
    category: "transport",
    impactKgSaved: 1.2,
    points: 20,
    actionText: "Rode Green Transit"
  },
  {
    id: "transport-carpool",
    title: "Combine Errands or Carpool",
    description: "Combine multiple errands into a single trip or carpool with a fellow classmate/colleague.",
    category: "transport",
    impactKgSaved: 0.8,
    points: 15,
    actionText: "Trip Combined"
  },
  {
    id: "food-veggie-day",
    title: "Plant-Powered Meal",
    description: "Enjoy a fully plant-based meal today (e.g., lentil curry, veggie bowl, or tofu fry).",
    category: "food",
    impactKgSaved: 1.8,
    points: 20,
    actionText: "Ate Veggie Meal"
  },
  {
    id: "food-local-fresh",
    title: "Zero Food Waste Meal",
    description: "Cook a meal using leftovers or locally sourced ingredients to reduce food transportation and waste.",
    category: "food",
    impactKgSaved: 1.0,
    points: 15,
    actionText: "Zero Waste Meal Finished"
  },
  {
    id: "energy-unplug",
    title: "Unplug Phantom Chargers",
    description: "Unplug laptop chargers, gaming consoles, and appliances when not actively in use.",
    category: "energy",
    impactKgSaved: 0.6,
    points: 10,
    actionText: "Vampire Power Cut"
  },
  {
    id: "energy-dark-mode",
    title: "System Dark Mode & Eco Power",
    description: "Enable system-wide Dark Mode on OLED screens and set laptop to Battery Saver profile.",
    category: "energy",
    impactKgSaved: 0.4,
    points: 10,
    actionText: "Eco Power Activated"
  }
];

export const ALL_BADGES: Badge[] = [
  {
    id: "thriving-twin",
    title: "🌳 Forest Guardian",
    description: "Nurtured your EcoTwin tree to Stage 4 (Thriving) or higher through consistent habit tracking.",
    iconName: "TreePine",
    category: "general",
    requirement: "Reach Twin Stage 4",
    conditionType: "stage",
    targetValue: 4
  },
  {
    id: "digital-detox",
    title: "☁ Cloud Cleaner",
    description: "Kept daily digital carbon footprint under 0.8 kg CO2 by lowering video stream quality and inbox detoxes.",
    iconName: "WifiOff",
    category: "digital",
    requirement: "Digital footprint < 0.8kg CO2",
    conditionType: "digital_low",
    targetValue: 0.8
  },
  {
    id: "first-log",
    title: "💻 Digital Minimalist",
    description: "Logged your daily digital carbon habits and reduced unnecessary cloud synchronization.",
    iconName: "Sprout",
    category: "digital",
    requirement: "Log habits 1 time",
    conditionType: "total_logs",
    targetValue: 1
  },
  {
    id: "streak-3",
    title: "🚶 Green Commuter",
    description: "Logged zero-emission transit or carpooling for 3 consecutive days.",
    iconName: "Zap",
    category: "transport",
    requirement: "Maintain a 3-day streak",
    conditionType: "streak",
    targetValue: 3
  },
  {
    id: "streak-7",
    title: "🌍 Earth Ally",
    description: "Maintained a full week streak of sustainable habits across transport, food, energy, and digital.",
    iconName: "Flame",
    category: "general",
    requirement: "Maintain a 7-day streak",
    conditionType: "streak",
    targetValue: 7
  },
  {
    id: "flourishing-master",
    title: "✨ EcoTwin Master",
    description: "Achieved Stage 5 Flourishing status with golden blooms and master eco score!",
    iconName: "Crown",
    category: "general",
    requirement: "Reach Twin Stage 5",
    conditionType: "stage",
    targetValue: 5
  },
  {
    id: "challenge-hero",
    title: "🛡️ Quest Slayer",
    description: "Completed 5 daily personalized eco missions and quests.",
    iconName: "CheckCircle2",
    category: "general",
    requirement: "Complete 5 challenges",
    conditionType: "challenges",
    targetValue: 5
  },
  {
    id: "balanced-lifestyle",
    title: "⚖️ Harmony Guardian",
    description: "Kept all 4 category footprints balanced under 2.5 kg CO2 in a single log.",
    iconName: "Scale",
    category: "general",
    requirement: "All categories under 2.5kg",
    conditionType: "balanced",
    targetValue: 2.5
  }
];

export const DAILY_ECO_TIPS: EcoTip[] = [
  {
    id: "tip-1",
    title: "The 4K Video Myth",
    content: "Streaming a video in 4K resolution transmits over 7GB of data per hour. Dropping to 1080p or 720p reduces data server cooling load by 60% with almost no noticeable difference on phones or laptops!",
    category: "digital",
    funFact: "Global video streaming accounts for nearly 1% of worldwide greenhouse emissions — equivalent to the entire country of Spain!"
  },
  {
    id: "tip-2",
    title: "Dark Mode Saves Screen & Server Energy",
    content: "On OLED and AMOLED mobile screens, switching apps to Dark Mode saves up to 30% display battery energy, reducing how frequently you need to recharge.",
    category: "energy",
    funFact: "OLED pixels display black by turning completely off, drawing 0 milliwatts of screen power."
  },
  {
    id: "tip-3",
    title: "Public Transit Multiplication",
    content: "A full commuter bus takes ~40 cars off the road. Even taking the bus twice a week cuts personal transport footprint by over 300kg CO2 per year.",
    category: "transport",
    funFact: "Electric urban buses produce zero direct tailpipe emissions and emit up to 80% less CO2 per passenger km than single-occupancy cars."
  },
  {
    id: "tip-4",
    title: "Cloud Backup Hygiene",
    content: "Delete duplicate phone photos, blurry videos, and huge temp files synced to Google Drive or iCloud. Unneeded cloud files sit on powered server drives 24/7/365.",
    category: "digital",
    funFact: "Data centers currently consume about 2% of global electricity, projected to reach 8% by 2030."
  },
  {
    id: "tip-5",
    title: "Meatless Mondays Count",
    content: "Replacing beef or pork with beans, lentils, or tofu for just 1 meal per day reduces your annual carbon footprint by nearly 500kg CO2e.",
    category: "food",
    funFact: "Producing 1kg of beef emits ~60kg CO2e, whereas 1kg of lentils emits only 0.9kg CO2e!"
  }
];

export const RECYCLING_GUIDE: RecyclingItem[] = [
  {
    id: "old-laptop-phone",
    name: "Old Laptops, Phones & Tablets",
    category: "electronics",
    binName: "E-Waste / Tech Recycling Center",
    binColor: "#D97706",
    instructions: "Do NOT place in standard curb bins! Take to an e-waste drop-off point, university tech recycling box, or retail trade-in program.",
    prepTip: "Wipe personal data & perform factory reset before dropping off. Batteries contain valuable lithium and cobalt.",
    digitalRelated: true
  },
  {
    id: "chargers-cables",
    name: "Charging Cables & Power Adapters",
    category: "electronics",
    binName: "E-Waste Drop Box",
    binColor: "#D97706",
    instructions: "Collect old USB cables, broken dongles, and power bricks for dedicated electronics collection bins.",
    prepTip: "Bundle cables with a twist tie to prevent tangling in recycling sort facilities.",
    digitalRelated: true
  },
  {
    id: "plastic-bottles",
    name: "PET Plastic Water & Soda Bottles",
    category: "plastics",
    binName: "Yellow / Blue Recycling Bin (Plastics)",
    binColor: "#2563EB",
    instructions: "Rinse out liquids. Place bottle and cap in the plastics recycling container.",
    prepTip: "Screw cap back on tightly after squishing the bottle to save transport bin space."
  },
  {
    id: "cardboard-boxes",
    name: "Delivery Cardboard & Pizza Boxes",
    category: "paper",
    binName: "Blue Recycling Bin (Paper & Cardboard)",
    binColor: "#1D4ED8",
    instructions: "Flatten all cardboard shipping boxes. Remove plastic packing tape if possible.",
    prepTip: "If pizza box bottom is heavily soaked in grease, tear off the clean top lid for recycling and compost the greasy bottom."
  },
  {
    id: "aluminum-cans",
    name: "Soda Cans & Foil Trays",
    category: "metal",
    binName: "Yellow / Metal Recycling Bin",
    binColor: "#CA8A04",
    instructions: "Rinse remaining drink or food residue. Aluminum can be recycled infinitely with 95% energy savings over raw mining!",
    prepTip: "Crush cans slightly to save bin space."
  },
  {
    id: "glass-jars",
    name: "Glass Bottles & Food Jars",
    category: "glass",
    binName: "Green / Glass Recycling Container",
    binColor: "#15803D",
    instructions: "Rinse jar. Metal lids can be recycled in the metal stream.",
    prepTip: "Do not include broken lightbulbs or ceramic cups as they melt at different temperatures."
  },
  {
    id: "food-scraps",
    name: "Fruit Peels, Coffee Grounds & Food Scraps",
    category: "compost",
    binName: "Brown Compost / Green Organics Bin",
    binColor: "#15803D",
    instructions: "Place all raw food scraps, coffee grounds, eggshells, and tea bags in the compost bin.",
    prepTip: "Composting food waste prevents methane gas generation in sealed landfills."
  },
  {
    id: "batteries",
    name: "AA, AAA, Lithium Ion Batteries",
    category: "hazardous",
    binName: "Hazardous / Battery Drop Box",
    binColor: "#DC2626",
    instructions: "Never throw batteries in regular trash! They present severe fire hazards in garbage trucks.",
    prepTip: "Tape over battery terminals with clear tape prior to disposal in battery drop bins."
  }
];

// Pre-seeded sample data (past 7 days) to show vibrant initial dashboard
export function getSampleHistory() {
  const today = new Date();
  const history = [];

  const sampleConfigs = [
    { dayOffset: 6, transportKm: 12, transportMode: 'car' as const, meals: 3, meatMeals: 2, energyLevel: 3, streamingHours: 4, streamingQuality: '4K' as const, emailsSent: 15, cloudBackupGB: 15 },
    { dayOffset: 5, transportKm: 8, transportMode: 'bus' as const, meals: 3, meatMeals: 1, energyLevel: 2, streamingHours: 3, streamingQuality: '1080p' as const, emailsSent: 10, cloudBackupGB: 10 },
    { dayOffset: 4, transportKm: 5, transportMode: 'bus' as const, meals: 3, meatMeals: 1, energyLevel: 2, streamingHours: 2, streamingQuality: '1080p' as const, emailsSent: 8, cloudBackupGB: 8 },
    { dayOffset: 3, transportKm: 3, transportMode: 'train' as const, meals: 3, meatMeals: 0, energyLevel: 1, streamingHours: 1.5, streamingQuality: '720p' as const, emailsSent: 5, cloudBackupGB: 5 },
    { dayOffset: 2, transportKm: 0, transportMode: 'bike_walk' as const, meals: 3, meatMeals: 0, energyLevel: 1, streamingHours: 2, streamingQuality: '720p' as const, emailsSent: 6, cloudBackupGB: 4 },
    { dayOffset: 1, transportKm: 4, transportMode: 'bus' as const, meals: 3, meatMeals: 1, energyLevel: 2, streamingHours: 2.5, streamingQuality: '1080p' as const, emailsSent: 12, cloudBackupGB: 6 }
  ];

  for (const cfg of sampleConfigs) {
    const dateObj = new Date(today);
    dateObj.setDate(today.getDate() - cfg.dayOffset);
    const dateStr = dateObj.toISOString().split('T')[0];

    const vegMeals = cfg.meals - cfg.meatMeals;
    const transport = Number((cfg.transportKm * (cfg.transportMode === 'car' ? 0.17 : cfg.transportMode === 'bus' ? 0.08 : 0.035)).toFixed(2));
    const food = Number((cfg.meatMeals * 2.5 + vegMeals * 0.7).toFixed(2));
    const energy = Number((cfg.energyLevel === 3 ? 7.0 : cfg.energyLevel === 2 ? 3.5 : 1.5).toFixed(2));
    
    const streamCO2 = cfg.streamingHours * (cfg.streamingQuality === '4K' ? 0.35 : cfg.streamingQuality === '1080p' ? 0.10 : 0.036);
    const digital = Number((streamCO2 + cfg.emailsSent * 0.004 + cfg.cloudBackupGB * 0.002).toFixed(2));
    const total = Number((transport + food + energy + digital).toFixed(2));

    const cats = [
      { name: 'transport' as const, val: transport },
      { name: 'food' as const, val: food },
      { name: 'energy' as const, val: energy },
      { name: 'digital' as const, val: digital }
    ];
    cats.sort((a, b) => b.val - a.val);

    history.push({
      id: `sample-${dateStr}`,
      date: dateStr,
      transportKm: cfg.transportKm,
      transportMode: cfg.transportMode,
      meals: cfg.meals,
      meatMeals: cfg.meatMeals,
      energyLevel: cfg.energyLevel,
      streamingHours: cfg.streamingHours,
      streamingQuality: cfg.streamingQuality,
      emailsSent: cfg.emailsSent,
      cloudBackupGB: cfg.cloudBackupGB,
      worstCategory: cats[0].name,
      footprintByCategory: { transport, food, energy, digital },
      totalFootprint: total
    });
  }

  return history;
}
