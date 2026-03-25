import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Guide from '../model/Guide.js';
import GuideDetail from '../model/GuideDetail.js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const seedGuideDetails = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing guide details
    await GuideDetail.deleteMany({});
    console.log('🗑️  Cleared existing guide details');

    // Get all guides from DB
    const guides = await Guide.find({});
    console.log(`📋 Found ${guides.length} guides\n`);

    if (guides.length === 0) {
      console.log('⚠️  No guides found. Please run seedGuides.js first.');
      process.exit(1);
    }

    // Map guide names to their detailed data
    const guideDetailsMap = {
      'Rajitha Fernando': {
        title: 'Senior Heritage & Archaeological Guide',
        fullBio:
          'Born and raised in Kandy, Rajitha developed a deep passion for Sri Lankan history from childhood visits to the sacred Temple of the Tooth with his grandmother. He pursued a Masters in Archaeology from the University of Peradeniya and has since guided thousands of visitors through the island\'s most treasured UNESCO World Heritage Sites. Rajitha has been recognised by the Sri Lanka Tourism Development Authority for excellence in cultural tourism three years in a row.',
        description:
          'Rajitha is a certified cultural heritage guide with over 12 years of experience specialising in Sri Lanka\'s ancient civilizations. His academic background in archaeology gives him a uniquely deep understanding of every site he visits.',
        tourSpecialties: [
          'Sigiriya Rock Fortress',
          'Ancient city of Polonnaruwa',
          'Sacred city of Kandy & Temple of the Tooth',
          'Dambulla Cave Temple Complex',
          'Anuradhapura archaeological sites',
          'Mihintale Sacred Mountain'
        ],
        certifications: [
          'Government Licensed Tourist Guide (Grade 1)',
          'Archaeological Society of Sri Lanka – Full Member',
          'UNESCO Certified Cultural Heritage Guide',
          'First Aid & Emergency Response Certified',
          'Masters in Archaeology – University of Peradeniya'
        ],
        highlights: [
          { icon: '🏛️', label: 'Specialisation', value: 'Cultural & Heritage' },
          { icon: '🎓', label: 'Education', value: "Masters in Archaeology" },
          { icon: '🌍', label: 'Tours Led', value: '1,400+' },
          { icon: '🏆', label: 'Award', value: 'SLTDA Excellence 3×' }
        ],
        reviews: [
          {
            name: 'Michael Anderson',
            date: 'January 2025',
            rating: 5,
            comment: 'Rajitha made ancient history come alive! His knowledge of Sigiriya was absolutely incredible — he knew every detail of every fresco.',
            tour: 'Cultural Triangle Explorer'
          },
          {
            name: 'Sarah Williams',
            date: 'December 2024',
            rating: 5,
            comment: 'Best guide we have ever had across 20 countries. Patient, deeply knowledgeable, and genuinely passionate about Sri Lankan culture.',
            tour: 'Complete Sri Lanka Experience'
          },
          {
            name: 'David Chen',
            date: 'November 2024',
            rating: 5,
            comment: "Rajitha's insights into temple architecture were fascinating. He pointed out details we would have walked past a hundred times.",
            tour: 'Cultural Triangle Explorer'
          }
        ],
        contactInfo: { email: 'rajitha.fernando@ceylontours.lk', phone: '+94 77 123 4567' },
        availability: 'Available for bookings 7 days a week',
        responseTime: 'Usually responds within 1 hour'
      },

      'Kamal Silva': {
        title: 'Wildlife & Safari Specialist',
        fullBio:
          'Kamal spent five years as a field researcher with the Wildlife Conservation Society of Sri Lanka before transitioning to guiding. That scientific background means he reads the jungle like a map — spotting leopards, elephants, and rare birds before his guests even lift their binoculars. He is passionate about conservation and weaves environmental education naturally into every safari experience.',
        description:
          'A former wildlife researcher turned guide, Kamal is Sri Lanka\'s go-to specialist for big-game safaris, bird-watching expeditions, and marine conservation encounters. His expertise with leopards at Yala is unmatched.',
        tourSpecialties: [
          'Yala National Park – Leopard Safari',
          'Udawalawe Elephant Sanctuary',
          'Sinharaja Rainforest Bird-Watching',
          'Mirissa Whale & Dolphin Watching',
          'Wilpattu National Park',
          'Minneriya Elephant Gathering'
        ],
        certifications: [
          'Government Wildlife Guide License',
          'Wildlife Conservation Society – Field Researcher (5 yrs)',
          'PADI Open Water Dive Certified',
          'Wilderness First Responder',
          'Jeep Safari Advanced Training'
        ],
        highlights: [
          { icon: '🦁', label: 'Specialisation', value: 'Wildlife & Safari' },
          { icon: '🔭', label: 'Research Exp.', value: '5 Years Field Research' },
          { icon: '🌿', label: 'Tours Led', value: '900+' },
          { icon: '🐆', label: 'Known For', value: 'Leopard Tracking' }
        ],
        reviews: [
          {
            name: 'Emma Thompson',
            date: 'February 2025',
            rating: 5,
            comment: 'We spotted four leopards in one morning at Yala! Kamal knew exactly where to look. An absolutely unforgettable experience.',
            tour: 'Wildlife Safari Adventure'
          },
          {
            name: 'James Patel',
            date: 'January 2025',
            rating: 5,
            comment: 'Kamal\'s knowledge of bird species is extraordinary. He identified over 60 birds by song alone during our Sinharaja walk.',
            tour: 'Rainforest & Wildlife Tour'
          },
          {
            name: 'Sophie Laurent',
            date: 'December 2024',
            rating: 5,
            comment: 'Warm, funny, brilliant. Kamal turned a simple jeep ride into a genuine wildlife documentary. Worth every penny.',
            tour: 'Wildlife Safari Adventure'
          }
        ],
        contactInfo: { email: 'kamal.silva@ceylontours.lk', phone: '+94 77 234 5678' },
        availability: 'Available 6 days a week (closed Fridays)',
        responseTime: 'Usually responds within 2 hours'
      },

      'Nimaltha Perera': {
        title: 'Adventure & Mountain Guide',
        fullBio:
          'Growing up in the shadow of Adam\'s Peak in Sri Lanka\'s hill country, Nimaltha was climbing mountains before he could drive. He became a certified rock-climbing instructor at 22 and has since led expeditions across the Knuckles Mountain Range, Horton Plains, and Sri Lanka\'s most remote jungle trails. He is equally comfortable planning a family-friendly scenic hike or a challenging multi-day mountain trek.',
        description:
          'A certified mountain guide with extensive experience across Sri Lanka\'s hill country, Nimaltha specialises in adventure treks, rock climbing, and camping expeditions that connect guests with the island\'s stunning highland landscapes.',
        tourSpecialties: [
          "Adam's Peak Sunrise Pilgrimage",
          'Knuckles Mountain Range Trek',
          'Horton Plains & World\'s End Walk',
          'Rock Climbing at Ella Rock',
          'Bambarakanda Waterfall Hike',
          'Overnight Jungle Camping – Sinharaja'
        ],
        certifications: [
          'Mountain Guide License – Sri Lanka Tourism',
          'Rock Climbing Instructor (Level 2)',
          'Wilderness First Responder',
          'Leave No Trace (LNT) Educator',
          'Mountain Bike Trail Leader Certificate'
        ],
        highlights: [
          { icon: '🏔️', label: 'Specialisation', value: 'Adventure & Trekking' },
          { icon: '🧗', label: 'Climbing Routes', value: '30+ Established' },
          { icon: '🌄', label: 'Tours Led', value: '700+' },
          { icon: '⛺', label: 'Known For', value: 'Overnight Expeditions' }
        ],
        reviews: [
          {
            name: 'Alex Morgan',
            date: 'March 2025',
            rating: 5,
            comment: "The Adam's Peak sunrise hike with Nimaltha was the highlight of our entire trip to Asia. He set the perfect pace and kept spirits high the whole way up.",
            tour: 'Hill Country Adventure'
          },
          {
            name: 'Lena Müller',
            date: 'February 2025',
            rating: 5,
            comment: 'Incredibly safety-conscious without taking any of the thrill away. The Knuckles Range camping night was magical.',
            tour: 'Knuckles Trek & Camp'
          },
          {
            name: 'Tom Richards',
            date: 'January 2025',
            rating: 4,
            comment: 'Great guide with detailed local knowledge. The rock climbing session was expertly led — we all felt safe but challenged.',
            tour: 'Adventure Highlands Tour'
          }
        ],
        contactInfo: { email: 'nimal.perera@ceylontours.lk', phone: '+94 77 345 6789' },
        availability: 'Available for bookings 7 days a week',
        responseTime: 'Usually responds within 3 hours'
      },

      'Sanduni Perera': {
        title: 'Buddhist Heritage & Arts Guide',
        fullBio:
          'Sanduni\'s fascination with Buddhist art began during her undergraduate studies in Art History at the University of Colombo. A decade of guiding has taken her to every major temple and museum on the island. She speaks Japanese conversationally — a skill that has made her the first-choice guide for groups from Japan exploring Sri Lanka\'s connections to Theravāda Buddhism. Her tours are unhurried, immersive, and deeply cultural.',
        description:
          'Specialising in Buddhist heritage, temple architecture, and traditional Sri Lankan arts, Sanduni offers a contemplative and richly detailed perspective on the island\'s spiritual and artistic heritage.',
        tourSpecialties: [
          'Temple of the Tooth – Kandy',
          'Dambulla Golden Cave Temple',
          'Kelaniya Raja Maha Vihara',
          'Traditional Kandyan Dance & Crafts',
          'National Museum Colombo',
          'Galle Dutch Fort Art Trail'
        ],
        certifications: [
          'Cultural Heritage Guide – Grade 1',
          'Art History Diploma – University of Colombo',
          'Traditional Crafts Certification – SLEDB',
          'Japanese Language Proficiency – JLPT N3',
          'Museum Educator Certificate'
        ],
        highlights: [
          { icon: '🪷', label: 'Specialisation', value: 'Buddhist & Arts Heritage' },
          { icon: '🎨', label: 'Art Expertise', value: 'Temple & Classical Arts' },
          { icon: '🌏', label: 'Tours Led', value: '1,100+' },
          { icon: '🇯🇵', label: 'Languages', value: 'Japanese Speaking' }
        ],
        reviews: [
          {
            name: 'Yuki Tanaka',
            date: 'March 2025',
            rating: 5,
            comment: 'It was wonderful to explore Sri Lankan Buddhism with a guide who could explain everything in both English and Japanese. Sanduni is exceptional.',
            tour: 'Sacred Sri Lanka Tour'
          },
          {
            name: 'Caroline Dupont',
            date: 'February 2025',
            rating: 5,
            comment: 'Sanduni\'s love for Buddhist art is completely infectious. She showed us details in the cave temples we would never have noticed on our own.',
            tour: 'Cultural Triangle Explorer'
          },
          {
            name: 'Robert Kim',
            date: 'January 2025',
            rating: 5,
            comment: 'A deeply enriching experience. Sanduni made the spiritual significance of each temple feel very real and personal.',
            tour: 'Sacred Sri Lanka Tour'
          }
        ],
        contactInfo: { email: 'sanduni.perera@ceylontours.lk', phone: '+94 77 456 7890' },
        availability: 'Available for bookings 7 days a week',
        responseTime: 'Usually responds within 1 hour'
      },

      'Chaminda Wickramasinghe': {
        title: 'Marine & Coastal Adventure Guide',
        fullBio:
          'Chaminda grew up on the southern coast near Mirissa and has been diving since he was 16. After completing his PADI Divemaster and later Instructor certifications, he launched his guiding career combining underwater adventures with beach excursions and coastal history. He has guided whale-watching trips for marine researchers from the University of Kelaniya and contributed sighting data to the Blue Whale research programme.',
        description:
          'A PADI-certified diving instructor with expert knowledge of Sri Lanka\'s southern and western coastlines, Chaminda specialises in snorkelling, scuba diving, whale watching, and coastal tours that showcase the island\'s extraordinary marine biodiversity.',
        tourSpecialties: [
          'Blue Whale Watching – Mirissa',
          'Scuba Diving – Hikkaduwa Reef',
          'Snorkelling – Pigeon Island',
          'Sea Turtle Conservation Beach Walk',
          'Surfing Introduction – Arugam Bay',
          'Galle Fort & Coastal History Tour'
        ],
        certifications: [
          'PADI Dive Instructor (Open Water)',
          'Government Licensed Marine Guide',
          'Sri Lanka Surf Lifesaving Association Member',
          'Marine Conservation Awareness Certified',
          'First Aid & Oxygen Administration Certified'
        ],
        highlights: [
          { icon: '🌊', label: 'Specialisation', value: 'Marine & Coastal' },
          { icon: '🤿', label: 'Dives Led', value: '2,000+ dives' },
          { icon: '🐋', label: 'Known For', value: 'Whale Watching' },
          { icon: '🏄', label: 'Bonus Skill', value: 'Surf Instruction' }
        ],
        reviews: [
          {
            name: 'Isabelle Fontaine',
            date: 'March 2025',
            rating: 5,
            comment: 'We saw a blue whale and three spinner dolphins on the same morning! Chaminda knew exactly when and where to go. A dream come true.',
            tour: 'Southern Coast Highlights'
          },
          {
            name: 'Ben Hartley',
            date: 'February 2025',
            rating: 5,
            comment: 'The Hikkaduwa dive was stunning and Chaminda made sure we were fully comfortable before entering the water. Professional and fun.',
            tour: 'Beach & Marine Discovery'
          },
          {
            name: 'Priya Nair',
            date: 'January 2025',
            rating: 5,
            comment: 'Chaminda\'s passion for marine life is clear in every word he says. The turtle conservation walk was genuinely moving.',
            tour: 'Coastal Sri Lanka Tour'
          }
        ],
        contactInfo: { email: 'chaminda.w@ceylontours.lk', phone: '+94 77 567 8901' },
        availability: 'Available for bookings 7 days a week',
        responseTime: 'Usually responds within 2 hours'
      },

      'Priya Jayawardena': {
        title: 'Photography & Landscape Specialist',
        fullBio:
          'Priya turned her passion for photography into a dual career as a professional photographer and tour guide. Her work has been featured in Lonely Planet, National Geographic Traveller, and the Sri Lanka Tourism Board\'s official campaigns. She knows every golden-hour vantage point, every misty-morning tea plantation overlook, and every candid cultural moment that makes Sri Lanka so photogenic. Whether guests are shooting on a smartphone or a professional DSLR, Priya ensures they leave with images that tell a story.',
        description:
          'A professional photographer with nine years of experience, Priya combines expert guiding with hands-on photography coaching, leading guests to Sri Lanka\'s most breathtaking viewpoints at exactly the right light.',
        tourSpecialties: [
          'Sunrise Photography – Sigiriya Rock',
          'Tea Plantation Golden Hour – Nuwara Eliya',
          'Wildlife Photography – Yala & Minneriya',
          'Street & Cultural Photography – Colombo Fort',
          'Seascape Long Exposure – Mirissa',
          'Train Photography – Ella & Kandy Route'
        ],
        certifications: [
          'Professional Photographers\' Association of Sri Lanka – Member',
          'Government Licensed Tourist Guide',
          'Adobe Lightroom Certified Educator',
          'Drone Pilot License – CAASL',
          'First Aid Certified'
        ],
        highlights: [
          { icon: '📸', label: 'Specialisation', value: 'Photography & Landscape' },
          { icon: '🖼️', label: 'Publications', value: 'NatGeo & Lonely Planet' },
          { icon: '🌅', label: 'Tours Led', value: '800+' },
          { icon: '🚁', label: 'Bonus Skill', value: 'Licensed Drone Pilot' }
        ],
        reviews: [
          {
            name: 'Nina Volkova',
            date: 'March 2025',
            rating: 5,
            comment: 'I am an amateur photographer and Priya had me shooting images I could not believe I took. She has an incredible eye and endless patience.',
            tour: 'Photography Highlights Tour'
          },
          {
            name: 'Mark Sullivan',
            date: 'February 2025',
            rating: 5,
            comment: 'The Ella train shoot was perfectly timed — Priya knew exactly where to stand and when. Pure magic.',
            tour: 'Hill Country Photo Safari'
          },
          {
            name: 'Anna Kvist',
            date: 'January 2025',
            rating: 5,
            comment: 'Priya\'s knowledge of light and landscape is phenomenal. The golden-hour tea estate session produced my best travel photos ever.',
            tour: 'Photography Highlights Tour'
          }
        ],
        contactInfo: { email: 'priya.j@ceylontours.lk', phone: '+94 77 678 9012' },
        availability: 'Available for bookings 7 days a week',
        responseTime: 'Usually responds within 1 hour'
      }
    };

    let seeded = 0;
    for (const guide of guides) {
      const detailData = guideDetailsMap[guide.name];
      if (!detailData) {
        console.log(`  No detail data found for: ${guide.name} — skipping`);
        continue;
      }

      await GuideDetail.create({
        guideId: guide._id,
        ...detailData
      });
      console.log(` Created details for: ${guide.name}`);
      seeded++;
    }

    console.log(`\n Successfully seeded ${seeded} guide detail records`);
    process.exit(0);
  } catch (error) {
    console.error(' Error seeding guide details:', error);
    process.exit(1);
  }
};

seedGuideDetails();