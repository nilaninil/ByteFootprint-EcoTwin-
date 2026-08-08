/**
 * Emission factors for EcoTwin footprint calculations.
 * Values are based on published estimates from IEA (International Energy Agency),
 * IPCC (Intergovernmental Panel on Climate Change), and ICT energy-intensity research.
 */

import { TransportMode, StreamingQuality } from '../types';

// Transport emission factors in kg CO2e per kilometer
// Source: UK BEIS / IPCC Transport Guidelines
export const TRANSPORT_FACTORS: Record<TransportMode, number> = {
  car: 0.170,      // Average petrol passenger car
  bus: 0.080,      // Average city/regional transit bus per passenger
  train: 0.035,    // Commuter rail / subway per passenger
  ev: 0.045,       // Electric vehicle (based on average grid mix)
  bike_walk: 0.000 // Zero direct emissions
};

// Food emission factors in kg CO2e per meal type
// Source: IPCC Special Report on Climate Change and Land / Poore & Nemecek (2018)
export const MEAT_MEAL_FACTOR = 2.50; // High-emission animal protein meal (beef/pork/dairy)
export const VEG_MEAL_FACTOR = 0.70;  // Plant-based or low-impact meal

// Energy emission factors in kg CO2e per daily home energy intensity level
// Source: IEA Household Energy Intensity benchmarks
export const ENERGY_FACTORS: Record<number, number> = {
  1: 1.50, // Low usage (eco-mode, natural lighting, minimal heating/cooling)
  2: 3.50, // Medium usage (average thermostat, normal appliance usage)
  3: 7.00  // High usage (heavy AC/heating, multiple monitors, high wattage)
};

// Digital emission factors
// Source: IEA Digital & Data Center Energy Intensity Research & The Shift Project (2020)
export const STREAMING_QUALITY_FACTORS: Record<StreamingQuality, number> = {
  '4K': 0.350,       // ~350g CO2e per hour (high bandwidth encoding, edge server, 4K screen)
  '1080p': 0.100,    // ~100g CO2e per hour
  '720p': 0.036,     // ~36g CO2e per hour (efficient stream)
  'audio_only': 0.010 // ~10g CO2e per hour (low bit-rate audio)
};

// Source: Berners-Lee, M. "How Bad Are Bananas? The Carbon Footprint of Everything"
export const EMAIL_FACTOR = 0.004; // 4g CO2e per email with attachments / cloud storage sync

// Cloud storage emission factor in kg CO2e per GB stored per day
// Source: Data Center Energy Intensity Estimates (~2.0 kWh per GB/year)
export const CLOUD_STORAGE_FACTOR = 0.002; // 2g CO2e per GB daily for active cloud sync & server power

/**
 * Calculates category breakdown and total footprint for a day's habits
 */
export function calculateFootprint(data: {
  transportKm: number;
  transportMode: TransportMode;
  meals: number;
  meatMeals: number;
  energyLevel: number;
  streamingHours: number;
  streamingQuality: StreamingQuality;
  emailsSent: number;
  cloudBackupGB: number;
}) {
  const vegMeals = Math.max(0, data.meals - data.meatMeals);
  
  const transport = Number((data.transportKm * TRANSPORT_FACTORS[data.transportMode]).toFixed(2));
  const food = Number((data.meatMeals * MEAT_MEAL_FACTOR + vegMeals * VEG_MEAL_FACTOR).toFixed(2));
  const energy = Number((ENERGY_FACTORS[data.energyLevel] || ENERGY_FACTORS[2]).toFixed(2));
  
  const streamingCO2 = data.streamingHours * STREAMING_QUALITY_FACTORS[data.streamingQuality];
  const emailCO2 = data.emailsSent * EMAIL_FACTOR;
  const cloudCO2 = data.cloudBackupGB * CLOUD_STORAGE_FACTOR;
  const digital = Number((streamingCO2 + emailCO2 + cloudCO2).toFixed(2));

  const total = Number((transport + food + energy + digital).toFixed(2));

  // Determine worst category
  const categories: Array<{ name: keyof typeof footprintByCategory; val: number }> = [
    { name: 'transport', val: transport },
    { name: 'food', val: food },
    { name: 'energy', val: energy },
    { name: 'digital', val: digital }
  ];

  categories.sort((a, b) => b.val - a.val);
  const worstCategory = categories[0].name;

  const footprintByCategory = {
    transport,
    food,
    energy,
    digital
  };

  return {
    footprintByCategory,
    totalFootprint: total,
    worstCategory
  };
}
