const path = require('path');
const mongoose = require('mongoose');
const User = require('../model/User');
const Guide = require('../model/Guide');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

// Image filenames (these will be used by frontend)
const guideImages = {
  rajitha: 'Rajitha.png',
  kamal: 'Kamal.png',
  nimal: 'Nimal.png',
  sanduni: 'Sanduni.png',
  chaminda: 'Chaminda.png',
  priya: 'Priya.png'
};

const guideAccounts = [
  {
    user: {
      name: "Rajitha Fernando",
      email: "rajitha.fernando@ceylontours.lk",
      password: "Guide@123",
      role: "guide",
      phone: "+94 77 123 4567"
    },
    guide: {
      name: "Rajitha Fernando",
      email: "rajitha.fernando@ceylontours.lk",
      phone: "+94 77 123 4567",
      profileImage: guideImages.rajitha,
      rating: 4.9,
      totalReviews: 247,
      specialties: ["Cultural Heritage", "UNESCO Sites", "Ancient History", "Temple Architecture"],
      experience: "12 Years",
      languages: ["English (Fluent)", "Sinhala (Native)", "Tamil (Fluent)", "French (Conversational)"],
      hourlyRate: 25,
      dailyRate: 80,
      category: "cultural",
      bio: "Expert in Sri Lankan ancient civilizations with Masters in Archaeology",
      certifications: [
        "Government Licensed Tourist Guide (Grade 1)",
        "Archaeological Society of Sri Lanka Member",
        "UNESCO Certified Cultural Guide"
      ],
      tourSpecialties: [
        "Sigiriya Rock Fortress",
        "Ancient city of Polonnaruwa",
        "Sacred city of Kandy",
        "Dambulla Cave Temple"
      ],
      contactInfo: {
        email: "rajitha.fernando@ceylontours.lk",
        phone: "+94 77 123 4567"
      },
      availability: "Available for bookings 7 days a week",
      responseTime: "Usually responds within 1 hour"
    }
  },
  {
    user: {
      name: "Kamal Silva",
      email: "kamal.silva@ceylontours.lk",
      password: "Guide@123",
      role: "guide",
      phone: "+94 77 234 5678"
    },
    guide: {
      name: "Kamal Silva",
      email: "kamal.silva@ceylontours.lk",
      phone: "+94 77 234 5678",
      profileImage: guideImages.kamal,
      rating: 4.8,
      totalReviews: 189,
      specialties: ["Wildlife", "Bird Watching", "Safari", "Photography", "Conservation"],
      experience: "8 Years",
      languages: ["English (Fluent)", "Sinhala (Native)"],
      hourlyRate: 20,
      dailyRate: 70,
      category: "wildlife",
      bio: "Former wildlife researcher turned guide, specialist in leopards and elephants",
      certifications: [
        "Wildlife Guide License",
        "First Aid Certified",
        "Jeep Safari Training"
      ],
      tourSpecialties: [
        "Yala National Park",
        "Udawalawe National Park",
        "Bird watching tours",
        "Leopard tracking"
      ],
      contactInfo: {
        email: "kamal.silva@ceylontours.lk",
        phone: "+94 77 234 5678"
      },
      availability: "Available for bookings 7 days a week",
      responseTime: "Usually responds within 2 hours"
    }
  },
  {
    user: {
      name: "Nimaltha Perera",
      email: "nimal.perera@ceylontours.lk",
      password: "Guide@123",
      role: "guide",
      phone: "+94 77 345 6789"
    },
    guide: {
      name: "Nimaltha Perera",
      email: "nimal.perera@ceylontours.lk",
      phone: "+94 77 345 6789",
      profileImage: guideImages.nimal,
      rating: 4.7,
      totalReviews: 156,
      specialties: ["Adventure", "Hiking", "Camping", "Mountain Biking", "Rock Climbing"],
      experience: "6 Years",
      languages: ["English (Fluent)", "Sinhala (Native)", "Tamil (Basic)"],
      hourlyRate: 18,
      dailyRate: 65,
      category: "adventure",
      bio: "Certified mountain guide with extensive experience in Sri Lanka's hill country",
      certifications: [
        "Mountain Guide License",
        "Wilderness First Responder",
        "Rock Climbing Instructor"
      ],
      tourSpecialties: [
        "Adam's Peak",
        "Knuckles Mountain Range",
        "Ella Rock",
        "Camping expeditions"
      ],
      contactInfo: {
        email: "nimal.perera@ceylontours.lk",
        phone: "+94 77 345 6789"
      },
      availability: "Available for bookings 6 days a week",
      responseTime: "Usually responds within 3 hours"
    }
  },
  {
    user: {
      name: "Sanduni Perera",
      email: "sanduni.perera@ceylontours.lk",
      password: "Guide@123",
      role: "guide",
      phone: "+94 77 456 7890"
    },
    guide: {
      name: "Sanduni Perera",
      email: "sanduni.perera@ceylontours.lk",
      phone: "+94 77 456 7890",
      profileImage: guideImages.sanduni,
      rating: 4.9,
      totalReviews: 203,
      specialties: ["Temple Tours", "History", "Archaeology", "Art", "Traditional Crafts"],
      experience: "10 Years",
      languages: ["English (Fluent)", "Sinhala (Native)", "Japanese (Conversational)"],
      hourlyRate: 22,
      dailyRate: 75,
      category: "cultural",
      bio: "Specializes in Buddhist heritage and traditional Sri Lankan arts",
      certifications: [
        "Cultural Heritage Guide",
        "Art History Diploma",
        "Traditional Crafts Certification"
      ],
      tourSpecialties: [
        "Temple of the Tooth",
        "Ancient cave temples",
        "Traditional art workshops",
        "Cultural performances"
      ],
      contactInfo: {
        email: "sanduni.perera@ceylontours.lk",
        phone: "+94 77 456 7890"
      },
      availability: "Available for bookings 7 days a week",
      responseTime: "Usually responds within 1 hour"
    }
  },
  {
    user: {
      name: "Chaminda Wickramasinghe",
      email: "chaminda.w@ceylontours.lk",
      password: "Guide@123",
      role: "guide",
      phone: "+94 77 567 8901"
    },
    guide: {
      name: "Chaminda Wickramasinghe",
      email: "chaminda.w@ceylontours.lk",
      phone: "+94 77 567 8901",
      profileImage: guideImages.chaminda,
      rating: 4.8,
      totalReviews: 178,
      specialties: ["Beach Tours", "Snorkeling", "Diving", "Whale Watching", "Surfing"],
      experience: "7 Years",
      languages: ["English (Fluent)", "Sinhala (Native)", "German (Basic)"],
      hourlyRate: 19,
      dailyRate: 68,
      category: "beach",
      bio: "PADI certified diving instructor with expertise in marine life",
      certifications: [
        "PADI Dive Master",
        "Marine Guide License",
        "First Aid & CPR"
      ],
      tourSpecialties: [
        "Whale watching in Mirissa",
        "Snorkeling in Hikkaduwa",
        "Surfing in Weligama",
        "Diving expeditions"
      ],
      contactInfo: {
        email: "chaminda.w@ceylontours.lk",
        phone: "+94 77 567 8901"
      },
      availability: "Available for bookings 7 days a week",
      responseTime: "Usually responds within 2 hours"
    }
  },
  {
    user: {
      name: "Priya Jayawardena",
      email: "priya.j@ceylontours.lk",
      password: "Guide@123",
      role: "guide",
      phone: "+94 77 678 9012"
    },
    guide: {
      name: "Priya Jayawardena",
      email: "priya.j@ceylontours.lk",
      phone: "+94 77 678 9012",
      profileImage: guideImages.priya,
      rating: 4.9,
      totalReviews: 167,
      specialties: ["Photography", "Wildlife", "Landscape", "Cultural Events", "Sunrise Spots"],
      experience: "9 Years",
      languages: ["English (Fluent)", "Sinhala (Native)", "French (Conversational)"],
      hourlyRate: 24,
      dailyRate: 82,
      category: "photography",
      bio: "Professional photographer who knows the best spots for amazing shots",
      certifications: [
        "Professional Photography Diploma",
        "Wildlife Photography Specialist",
        "Drone Pilot License"
      ],
      tourSpecialties: [
        "Photography tours",
        "Sunrise at Sigiriya",
        "Wildlife photography",
        "Cultural event coverage"
      ],
      contactInfo: {
        email: "priya.j@ceylontours.lk",
        phone: "+94 77 678 9012"
      },
      availability: "Available for bookings 7 days a week",
      responseTime: "Usually responds within 1 hour"
    }
  }
];

const seedGuides = async () => {
  try {
    console.log(' Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(' Connected to MongoDB');

    // Clear existing guides
    await Guide.deleteMany({});
    console.log(' Cleared existing guides');

    for (const account of guideAccounts) {
      // Check if user already exists
      let user = await User.findOne({ email: account.user.email });
      
      if (!user) {
        // Create user account
        user = await User.create(account.user);
        console.log(` Created user account for: ${account.user.name}`);
      } else {
        console.log(`⏭ User already exists: ${account.user.name}`);
      }

      // Check if guide already exists
      const existingGuide = await Guide.findOne({ email: account.guide.email });
      
      if (!existingGuide) {
        // Create guide profile with reference to user
        await Guide.create({
          ...account.guide,
          userId: user._id,
          password: account.user.password // Add password for guide model
        });
        console.log(` Created guide profile for: ${account.guide.name}`);
      } else {
        console.log(`⏭ Guide profile already exists: ${account.guide.name}`);
      }
    }

    console.log('\n All guide accounts processed successfully!');
    console.log('\n Guide Login Credentials:');
    guideAccounts.forEach(account => {
      console.log(`📧 ${account.user.email}`);
    });
    console.log(' Password for all: Guide@123');

    // Verify counts
    const guideCount = await Guide.countDocuments();
    const userCount = await User.countDocuments({ role: 'guide' });
    console.log(`\n Statistics:`);
    console.log(`   - Guides in database: ${guideCount}`);
    console.log(`   - Guide user accounts: ${userCount}`);

    process.exit(0);
  } catch (error) {
    console.error(' Error:', error);
    process.exit(1);
  }
};

seedGuides();