import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Tour from '../model/Tour.js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const seedTours = async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not defined in .env file');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');
    await Tour.deleteMany({});
    const tours = [
      { name: "Cultural Triangle Explorer", description: "Visit ancient cities of Anuradhapura, Polonnaruwa, and climb the iconic Sigiriya Rock Fortress", duration: "3 Days", groupSize: "2-13 People", price: 240, features: ["Sigiriya Rock Fortress", "Ancient Temples", "UNESCO Sites"], category: "cultural", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop" },
      { name: "Hill Country Adventure", description: "Experience the scenic train journey through tea plantations and visit Ella's breathtaking views", duration: "4 Days", groupSize: "2-12 People", price: 320, features: ["Scenic Train Ride", "Tea Factory Visit", "Nine Arch Bridge"], category: "hill", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop" },
      { name: "Wildlife Safari Experience", description: "Spot elephants, leopards, and exotic birds in Yala and Udawalawe National Parks", duration: "3 Days", groupSize: "2-8 People", price: 240, features: ["Safari Jeep Tours", "Elephant Watching", "Bird Watching"], category: "wildlife", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop" },
      { name: "Coastal Paradise Tour", description: "Explore historic Galle Fort, pristine beaches, and enjoy water sports in the southern coast.", duration: "4 Days", groupSize: "2-10 People", price: 320, features: ["Galle Fort", "Beach Relaxation", "Water Sports"], category: "beach", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop" },
      { name: "Tea Country Journey", description: "Immerse yourself in the lush tea estates of Nuwara Eliya and learn about Ceylon tea", duration: "3 Days", groupSize: "2-15 People", price: 240, features: ["Tea Plantation Tour", "Tea Tasting", "Colonial Heritage"], category: "hill", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop" },
      { name: "Complete Sri Lanka Experience", description: "A comprehensive tour covering cultural sites, wildlife, hill country, and coastal attractions.", duration: "12 Days", groupSize: "2-30 People", price: 960, features: ["All Major Attractions", "Full Island Tour", "Cultural Immersion"], category: "cultural", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop" }
    ];
    const createdTours = await Tour.insertMany(tours);
    console.log('Tours seeded successfully!');
    createdTours.forEach((tour, i) => console.log(`${i + 1}. ${tour.name}: ${tour._id}`));
    process.exit(0);
  } catch (error) {
    console.error('Error seeding tours:', error);
    process.exit(1);
  }
};

seedTours();
