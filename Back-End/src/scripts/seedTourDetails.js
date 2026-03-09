const path = require('path');
const mongoose = require('mongoose');
const Tour = require('../model/Tour');
const TourDetail = require('../model/TourDetail');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });


const seedTourDetails = async () => {
  try {
    console.log(' Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(' Connected to MongoDB\n');

    // Clear existing tour details
    await TourDetail.deleteMany({});
    console.log(' Cleared existing tour details');

    // Get all tours
    const tours = await Tour.find();
    console.log(` Found ${tours.length} tours\n`);

    // Create detailed itineraries for each tour
    const tourDetails = [
      {
        // Cultural Triangle Explorer (ID will be matched later)
        overview: "Embark on a journey through Sri Lanka's ancient kingdoms. This 3-day cultural odyssey takes you to the heart of the island's rich heritage, exploring magnificent rock fortresses, ancient temples, and UNESCO World Heritage sites that tell the story of a glorious civilization spanning over 2000 years.",
        highlights: [
          "Climb the iconic Sigiriya Rock Fortress at sunrise",
          "Explore the ancient cities of Anuradhapura and Polonnaruwa",
          "Visit sacred temples including the Temple of the Tooth",
          "Witness traditional cultural performances",
          "Discover ancient irrigation systems and stupas"
        ],
        itinerary: [
          {
            day: 1,
            title: "Arrival & Sigiriya Exploration",
            description: "Begin your cultural journey with a visit to the magnificent Sigiriya Rock Fortress. Climb to the top for panoramic views and explore the ancient palace ruins.",
            activities: [
              "Arrival at Sigiriya",
              "Climb Sigiriya Rock Fortress",
              "Visit the Mirror Wall and frescoes",
              "Explore the royal gardens",
              "Sunset photography session"
            ],
            meals: ["Lunch", "Dinner"],
            accommodation: "Heritance Kandalama - 5* Luxury Resort",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
          },
          {
            day: 2,
            title: "Ancient City of Polonnaruwa",
            description: "Explore the medieval capital of Polonnaruwa, home to well-preserved ancient temples, palaces, and statues.",
            activities: [
              "Visit the Royal Palace complex",
              "Explore Gal Vihara rock temples",
              "See the Rankot Vihara Stupa",
              "Lunch at local restaurant",
              "Evening village tour"
            ],
            meals: ["Breakfast", "Lunch", "Dinner"],
            accommodation: "Heritance Kandalama - 5* Luxury Resort",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
          },
          {
            day: 3,
            title: "Dambulla Cave Temple & Departure",
            description: "Visit the famous Dambulla Cave Temple, a UNESCO World Heritage site with magnificent Buddha statues and colorful murals.",
            activities: [
              "Visit Dambulla Cave Temple",
              "Explore 5 cave temples",
              "See ancient Buddhist murals",
              "Local market visit",
              "Departure transfer"
            ],
            meals: ["Breakfast"],
            accommodation: "Not included",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
          }
        ],
        inclusions: [
          {
            category: "Accommodation",
            items: ["2 nights in 5* heritage hotels", "Daily breakfast", "All taxes included"]
          },
          {
            category: "Transport",
            items: ["Private air-conditioned vehicle", "Airport transfers", "Professional driver"]
          },
          {
            category: "Meals",
            items: ["2 breakfasts", "2 lunches", "2 dinners", "Bottled water during tours"]
          },
          {
            category: "Activities",
            items: ["All entrance fees", "Guided tours", "Cultural show"]
          }
        ],
        exclusions: [
          {
            category: "Personal Expenses",
            items: ["Alcoholic beverages", "Shopping", "Laundry services"]
          },
          {
            category: "Optional",
            items: ["Travel insurance", "Visa fees", "Tips and gratuities"]
          }
        ],
        practicalInfo: {
          bestTimeToVisit: "January to March, September to October",
          difficulty: "Moderate",
          groupSize: "2-13 people",
          minimumAge: 5,
          pickupInfo: "Pickup from any hotel in Colombo or airport",
          whatToBring: [
            "Comfortable walking shoes",
            "Hat and sunscreen",
            "Camera",
            "Light jacket for mornings",
            "Modest clothing for temples",
            "Water bottle"
          ]
        },
        faqs: [
          {
            question: "Is the Sigiriya climb difficult?",
            answer: "The climb involves about 1,200 steps and takes 30-45 minutes. It's moderate but manageable for most fitness levels."
          },
          {
            question: "What should I wear for temple visits?",
            answer: "Modest clothing covering shoulders and knees is required. Sarongs are available for rent at temple entrances."
          },
          {
            question: "Are meals included in the package?",
            answer: "Yes, all meals are included as specified in the itinerary. We can accommodate dietary requirements."
          }
        ],
        mapCoordinates: {
          lat: 7.9569,
          lng: 80.7600
        }
      },
      {
        // Hill Country Adventure
        overview: "Experience the breathtaking beauty of Sri Lanka's hill country. This 4-day journey takes you through misty mountains, emerald tea plantations, and charming colonial towns. Ride the famous scenic train, visit tea factories, and immerse yourself in the cool climate of the central highlands.",
        highlights: [
          "Scenic train ride through tea plantations",
          "Visit working tea factories and tea tasting",
          "Explore Ella's Nine Arch Bridge",
          "Hike Little Adam's Peak",
          "Visit colonial-era Nuwara Eliya"
        ],
        itinerary: [
          {
            day: 1,
            title: "Journey to the Hills",
            description: "Depart from Colombo and drive to Kandy, visiting the Pinnawala Elephant Orphanage en route.",
            activities: [
              "Visit Pinnawala Elephant Orphanage",
              "See elephants bathing in the river",
              "Lunch at local restaurant",
              "Arrive in Kandy",
              "Evening temple visit"
            ],
            meals: ["Lunch", "Dinner"],
            accommodation: "Earl's Regent Hotel - 4* Heritage Hotel",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
          },
          {
            day: 2,
            title: "Tea Country Experience",
            description: "Drive to Nuwara Eliya, visiting tea plantations and factories along the way.",
            activities: [
              "Visit tea plantation",
              "Tea factory tour",
              "Tea tasting session",
              "Lunch at tea estate",
              "Explore Nuwara Eliya town"
            ],
            meals: ["Breakfast", "Lunch", "Dinner"],
            accommodation: "The Grand Hotel - 4* Colonial Hotel",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
          },
          {
            day: 3,
            title: "Ella Adventure",
            description: "Take the famous scenic train from Nuwara Eliya to Ella, then explore the area's attractions.",
            activities: [
              "Scenic train journey",
              "Visit Nine Arch Bridge",
              "Hike Little Adam's Peak",
              "Lunch with a view",
              "Explore Ella town"
            ],
            meals: ["Breakfast", "Lunch", "Dinner"],
            accommodation: "98 Acres Resort - 4* Luxury Resort",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
          },
          {
            day: 4,
            title: "Return Journey",
            description: "Drive back to Colombo with scenic stops along the way.",
            activities: [
              "Morning nature walk",
              "Visit Ravana Falls",
              "Lunch en route",
              "Evening arrival in Colombo"
            ],
            meals: ["Breakfast", "Lunch"],
            accommodation: "Not included",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
          }
        ],
        inclusions: [
          {
            category: "Accommodation",
            items: ["3 nights in 4* heritage hotels", "Daily breakfast", "All taxes"]
          },
          {
            category: "Transport",
            items: ["Private vehicle", "Scenic train tickets", "Airport transfers"]
          },
          {
            category: "Meals",
            items: ["3 breakfasts", "4 lunches", "3 dinners", "Tea tasting"]
          }
        ],
        exclusions: [
          {
            category: "Personal",
            items: ["Alcoholic drinks", "Shopping", "Camera fees"]
          }
        ],
        practicalInfo: {
          bestTimeToVisit: "December to May",
          difficulty: "Easy",
          groupSize: "2-12 people",
          minimumAge: 3,
          pickupInfo: "Pickup from Colombo hotels or airport",
          whatToBring: [
            "Warm clothing (it gets cool in evenings)",
            "Comfortable walking shoes",
            "Camera",
            "Rain jacket",
            "Sunscreen"
          ]
        }
      },
      {
        // Wildlife Safari Experience
        overview: "Get up close with Sri Lanka's incredible wildlife on this 3-day safari adventure. Visit Yala and Udawalawe National Parks, home to leopards, elephants, sloth bears, and hundreds of bird species. Experience thrilling jeep safaris with expert naturalist guides.",
        highlights: [
          "Leopard spotting in Yala National Park",
          "Elephant herds in Udawalawe",
          "Bird watching with over 200 species",
          "Safari jeep adventures",
          "Nature walks with naturalists"
        ],
        itinerary: [
          {
            day: 1,
            title: "Arrival in Yala",
            description: "Drive to Yala National Park and settle into your jungle lodge. Enjoy an introductory nature walk around the property.",
            activities: [
              "Drive to Yala",
              "Check into jungle lodge",
              "Nature walk",
              "Introduction to wildlife",
              "Sunset photography"
            ],
            meals: ["Lunch", "Dinner"],
            accommodation: "Cinnamon Wild Yala - Jungle Lodge",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
          },
          {
            day: 2,
            title: "Full Day Yala Safari",
            description: "Early morning and afternoon jeep safaris in Yala National Park, famous for its leopard population.",
            activities: [
              "5:30 AM morning safari",
              "Leopard tracking",
              "Elephant sightings",
              "Picnic breakfast in park",
              "Afternoon safari",
              "Bird watching"
            ],
            meals: ["Breakfast", "Lunch", "Dinner"],
            accommodation: "Cinnamon Wild Yala - Jungle Lodge",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
          },
          {
            day: 3,
            title: "Udawalawe Safari",
            description: "Visit Udawalawe National Park, known for its large elephant population. Afternoon return to Colombo.",
            activities: [
              "Transfer to Udawalawe",
              "Morning safari",
              "Elephant watching",
              "Lunch at park",
              "Return to Colombo"
            ],
            meals: ["Breakfast", "Lunch"],
            accommodation: "Not included",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
          }
        ],
        inclusions: [
          {
            category: "Safaris",
            items: ["3 jeep safaris", "National Park entrance fees", "Naturalist guide"]
          },
          {
            category: "Accommodation",
            items: ["2 nights jungle lodge", "All meals included"]
          }
        ],
        exclusions: [
          {
            category: "Optional",
            items: ["Additional safaris", "Camera fees", "Tips"]
          }
        ],
        practicalInfo: {
          bestTimeToVisit: "February to September",
          difficulty: "Easy",
          groupSize: "2-8 people",
          minimumAge: 5,
          pickupInfo: "Pickup from any hotel in Colombo or airport",
          whatToBring: [
            "Neutral colored clothing",
            "Binoculars",
            "Camera with zoom lens",
            "Hat and sunscreen",
            "Insect repellent",
            "Light jacket"
          ]
        }
      }
    ];

    // Match tour details with actual tours
    for (let i = 0; i < tours.length && i < tourDetails.length; i++) {
      const tour = tours[i];
      const details = {
        tourId: tour._id,
        ...tourDetails[i],
        // Add some variety to the details based on tour name
        mapCoordinates: {
          lat: 7.8731 + (i * 0.1),
          lng: 80.7718 + (i * 0.1)
        }
      };

      await TourDetail.create(details);
      console.log(` Created details for: ${tour.name}`);
    }

    console.log('\n All tour details seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(' Error seeding tour details:', error);
    process.exit(1);
  }
};

seedTourDetails();