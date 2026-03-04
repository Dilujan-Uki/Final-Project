// src/scripts/seedGuides.js
const path = require('path');
const mongoose = require('mongoose');
const User = require('../model/User');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const guideAccounts = [
  {
    name: "Rajitha Fernando",
    email: "rajitha.fernando@ceylontours.lk",
    password: "Guide@123",
    role: "guide",
    phone: "+94 77 123 4567"
  },
  {
    name: "Kamal Silva",
    email: "kamal.silva@ceylontours.lk", 
    password: "Guide@123",
    role: "guide",
    phone: "+94 77 234 5678"
  },
  {
    name: "Nimaltha Perera",
    email: "nimal.perera@ceylontours.lk",
    password: "Guide@123",
    role: "guide",
    phone: "+94 77 345 6789"
  },
  {
    name: "Sanduni Perera",
    email: "sanduni.perera@ceylontours.lk",
    password: "Guide@123", 
    role: "guide",
    phone: "+94 77 456 7890"
  },
  {
    name: "Chaminda Wickramasinghe",
    email: "chaminda.w@ceylontours.lk",
    password: "Guide@123",
    role: "guide",
    phone: "+94 77 567 8901"
  },
  {
    name: "Priya Jayawardena",
    email: "priya.j@ceylontours.lk",
    password: "Guide@123",
    role: "guide",
    phone: "+94 77 678 9012"
  }
];

const seedGuides = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    for (const guide of guideAccounts) {
      const existing = await User.findOne({ email: guide.email });
      if (!existing) {
        await User.create(guide);
        console.log(`✅ Created guide: ${guide.name}`);
      } else {
        console.log(`⏭️ Guide already exists: ${guide.name}`);
      }
    }

    console.log('\n✅ All guide accounts processed!');
    console.log('\n📋 Guide Login Credentials:');
    console.log('Email: rajitha.fernando@ceylontours.lk');
    console.log('Email: kamal.silva@ceylontours.lk');
    console.log('Email: nimal.perera@ceylontours.lk');
    console.log('Email: sanduni.perera@ceylontours.lk');
    console.log('Email: chaminda.w@ceylontours.lk');
    console.log('Email: priya.j@ceylontours.lk');
    console.log('Password for all: Guide@123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedGuides();