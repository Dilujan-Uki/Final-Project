const path = require('path');
const mongoose = require('mongoose');
const Tour = require('../model/Tour');
const TourDetail = require('../model/TourDetail');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const seedRemainingTourDetails = async () => {
  try {
    console.log(' Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(' Connected to MongoDB\n');

    // Get all tours
    const tours = await Tour.find();
    console.log(` Found ${tours.length} tours\n`);

    // Check which tours already have details
    const existingDetails = await TourDetail.find().distinct('tourId');
    const existingIds = existingDetails.map(id => id.toString());
    
    console.log('Tours with details already:', existingIds);

    // Filter tours that need details
    const toursNeedingDetails = tours.filter(tour => 
      !existingIds.includes(tour._id.toString())
    );

    console.log(`\n Need to create details for ${toursNeedingDetails.length} tours\n`);

    // Details for remaining tours
    const remainingDetails = [
      {
        // Coastal Paradise Tour
        overview: "Discover Sri Lanka's stunning southern coastline on this 4-day coastal paradise tour. Explore historic Galle Fort, relax on pristine beaches, and enjoy exciting water sports in the warm waters of the Indian Ocean. This tour perfectly combines colonial history with tropical relaxation.",
        highlights: [
          "Explore UNESCO-listed Galle Fort",
          "Relax on Unawatuna and Mirissa beaches",
          "Whale watching in Mirissa (seasonal)",
          "Learn surfing at Weligama",
          "Visit traditional fishing villages",
          "Sunset dinner by the beach"
        ],
        itinerary: [
          {
            day: 1,
            title: "Arrival in Galle",
            description: "Drive to Galle and settle into your beachfront hotel. Evening exploration of Galle Fort.",
            activities: [
              "Scenic drive along southern coast",
              "Check into beachfront hotel",
              "Sunset walk on Galle Fort ramparts",
              "Welcome dinner at fort restaurant",
              "Night photography of lighthouse"
            ],
            meals: ["Dinner"],
            accommodation: "Amari Galle - 5* Beach Resort",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
          },
          {
            day: 2,
            title: "Galle Fort Exploration",
            description: "Full day exploring the historic Galle Fort, a UNESCO World Heritage site.",
            activities: [
              "Guided walking tour of Galle Fort",
              "Visit Dutch Reformed Church",
              "Explore National Maritime Museum",
              "Lunch at historic fort restaurant",
              "Shopping for souvenirs and gems",
              "Sunset at lighthouse"
            ],
            meals: ["Breakfast", "Lunch", "Dinner"],
            accommodation: "Amari Galle - 5* Beach Resort",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
          },
          {
            day: 3,
            title: "Beach Day & Water Sports",
            description: "Enjoy the beautiful beaches of Unawatuna and try exciting water sports.",
            activities: [
              "Visit Unawatuna Beach",
              "Snorkeling in clear waters",
              "Optional scuba diving",
              "Beachfront lunch",
              "Relaxation time",
              "Sunset catamaran cruise"
            ],
            meals: ["Breakfast", "Lunch", "Dinner"],
            accommodation: "Amari Galle - 5* Beach Resort",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
          },
          {
            day: 4,
            title: "Whale Watching & Departure",
            description: "Early morning whale watching experience (seasonal) before departure.",
            activities: [
              "Early morning whale watching",
              "See blue whales and dolphins",
              "Breakfast on boat",
              "Return to Colombo",
              "Evening departure"
            ],
            meals: ["Breakfast", "Lunch"],
            accommodation: "Not included",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
          }
        ],
        inclusions: [
          {
            category: "Accommodation",
            items: ["3 nights in 5* beach resort", "Daily breakfast", "All taxes"]
          },
          {
            category: "Activities",
            items: ["Galle Fort guided tour", "Snorkeling equipment", "Whale watching tour (seasonal)"]
          },
          {
            category: "Meals",
            items: ["3 breakfasts", "3 lunches", "3 dinners", "Welcome drink"]
          },
          {
            category: "Transport",
            items: ["Private vehicle", "Airport transfers", "All sightseeing transport"]
          }
        ],
        exclusions: [
          {
            category: "Optional Activities",
            items: ["Scuba diving", "Surfing lessons", "Personal shopping"]
          },
          {
            category: "Other",
            items: ["Alcoholic beverages", "Tips", "Travel insurance"]
          }
        ],
        practicalInfo: {
          bestTimeToVisit: "November to April",
          difficulty: "Easy",
          groupSize: "2-10 people",
          minimumAge: 3,
          pickupInfo: "Pickup from Colombo hotels or airport",
          whatToBring: [
            "Swimwear",
            "Sunscreen",
            "Hat and sunglasses",
            "Beach towel",
            "Underwater camera",
            "Light clothing"
          ]
        },
        faqs: [
          {
            question: "Is whale watching guaranteed?",
            answer: "While we have a 90% success rate, whale sightings cannot be guaranteed as it's nature. Best season is November to April."
          },
          {
            question: "Are water sports suitable for beginners?",
            answer: "Yes, instructors are available for beginners. Snorkeling and basic surfing lessons are included."
          }
        ]
      },
      {
        // Tea Country Journey
        overview: "Immerse yourself in the lush tea estates of Sri Lanka's hill country. This 3-day journey takes you through emerald tea plantations, historic colonial towns, and offers authentic tea tasting experiences. Learn about Ceylon tea production from plantation to cup.",
        highlights: [
          "Visit working tea plantations",
          "Tea factory tour and tasting",
          "Explore colonial Nuwara Eliya",
          "Scenic mountain views",
          "Learn tea plucking techniques",
          "Shop for fresh Ceylon tea"
        ],
        itinerary: [
          {
            day: 1,
            title: "Journey to Tea Country",
            description: "Scenic drive to Nuwara Eliya through winding roads and tea plantations.",
            activities: [
              "Depart from Colombo",
              "Scenic drive through hills",
              "Stop at Ramboda Falls",
              "Visit tea plantation en route",
              "Arrive in Nuwara Eliya",
              "Evening at leisure"
            ],
            meals: ["Lunch", "Dinner"],
            accommodation: "The Grand Hotel - 4* Colonial Heritage",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
          },
          {
            day: 2,
            title: "Tea Plantation Experience",
            description: "Full day experiencing tea culture, from plucking to tasting.",
            activities: [
              "Morning tea plucking with workers",
              "Visit tea factory",
              "Learn tea processing",
              "Professional tea tasting session",
              "Lunch at tea estate",
              "Visit Pedro Tea Estate",
              "Sunset at Lake Gregory"
            ],
            meals: ["Breakfast", "Lunch", "Dinner"],
            accommodation: "The Grand Hotel - 4* Colonial Heritage",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
          },
          {
            day: 3,
            title: "Colonial Heritage & Return",
            description: "Explore Nuwara Eliya's colonial charm before returning to Colombo.",
            activities: [
              "Visit Victoria Park",
              "Explore colonial buildings",
              "Golf at Nuwara Eliya Golf Club",
              "Lunch at Hill Club",
              "Scenic return journey"
            ],
            meals: ["Breakfast", "Lunch"],
            accommodation: "Not included",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
          }
        ],
        inclusions: [
          {
            category: "Tea Experiences",
            items: ["Tea plantation tour", "Factory visit", "Tea tasting session", "Tea plucking experience"]
          },
          {
            category: "Accommodation",
            items: ["2 nights colonial hotel", "Daily breakfast", "All taxes"]
          },
          {
            category: "Meals",
            items: ["2 breakfasts", "3 lunches", "2 dinners", "Tea and snacks"]
          }
        ],
        exclusions: [
          {
            category: "Personal",
            items: ["Tea purchases", "Golf fees", "Alcoholic drinks"]
          }
        ],
        practicalInfo: {
          bestTimeToVisit: "December to May",
          difficulty: "Easy",
          groupSize: "2-15 people",
          minimumAge: 5,
          pickupInfo: "Pickup from Colombo hotels",
          whatToBring: [
            "Warm clothing (it gets cool)",
            "Comfortable walking shoes",
            "Camera",
            "Rain jacket",
            "Sunscreen"
          ]
        }
      },
      {
        // Complete Sri Lanka Experience
        overview: "The ultimate Sri Lankan adventure! This 12-day comprehensive tour covers everything the island has to offer - from ancient cultural sites and wildlife safaris to misty hill country and pristine beaches. Experience the complete diversity of Sri Lanka in one unforgettable journey.",
        highlights: [
          "All 8 UNESCO World Heritage Sites",
          "Multiple wildlife safaris",
          "Scenic train journeys",
          "Tea plantation experiences",
          "Beach relaxation",
          "Cultural performances",
          "Authentic local cuisine"
        ],
        itinerary: [
          {
            day: 1,
            title: "Arrival in Colombo",
            description: "Welcome to Sri Lanka! Meet your guide and transfer to your hotel.",
            activities: [
              "Airport pickup",
              "Welcome briefing",
              "City orientation",
              "Welcome dinner"
            ],
            meals: ["Dinner"],
            accommodation: "Cinnamon Grand Colombo - 5*",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
          },
          {
            day: 2,
            title: "Cultural Triangle: Sigiriya",
            description: "Drive to Sigiriya and climb the iconic rock fortress.",
            activities: [
              "Drive to Sigiriya",
              "Climb Sigiriya Rock Fortress",
              "Visit frescoes",
              "Explore royal gardens",
              "Sunset photography"
            ],
            meals: ["Breakfast", "Lunch", "Dinner"],
            accommodation: "Heritance Kandalama - 5*",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
          },
          {
            day: 3,
            title: "Ancient Cities: Polonnaruwa",
            description: "Explore the ancient capital of Polonnaruwa.",
            activities: [
              "Visit Royal Palace",
              "Explore Gal Vihara",
              "Ancient stupas",
              "Lunch at local restaurant",
              "Evening village tour"
            ],
            meals: ["Breakfast", "Lunch", "Dinner"],
            accommodation: "Heritance Kandalama - 5*",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
          },
          {
            day: 4,
            title: "Dambulla & Kandy",
            description: "Visit Dambulla Cave Temple and travel to Kandy.",
            activities: [
              "Dambulla Cave Temple",
              "Traditional lunch",
              "Drive to Kandy",
              "Temple of the Tooth",
              "Cultural dance show"
            ],
            meals: ["Breakfast", "Lunch", "Dinner"],
            accommodation: "Earl's Regent Hotel - 4*",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
          },
          {
            day: 5,
            title: "Kandy Exploration",
            description: "Discover the cultural capital of Sri Lanka.",
            activities: [
              "Royal Botanical Gardens",
              "Gem museum",
              "Batik workshop",
              "Kandy Lake walk",
              "Evening temple visit"
            ],
            meals: ["Breakfast", "Lunch", "Dinner"],
            accommodation: "Earl's Regent Hotel - 4*",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
          },
          {
            day: 6,
            title: "Hill Country: Nuwara Eliya",
            description: "Scenic drive to Nuwara Eliya through tea plantations.",
            activities: [
              "Tea plantation visit",
              "Tea factory tour",
              "Tea tasting",
              "Scenic train ride",
              "Arrive in Nuwara Eliya"
            ],
            meals: ["Breakfast", "Lunch", "Dinner"],
            accommodation: "The Grand Hotel - 4*",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
          },
          {
            day: 7,
            title: "Nuwara Eliya & Ella",
            description: "Explore Nuwara Eliya and travel to Ella.",
            activities: [
              "Colonial city tour",
              "Visit tea estates",
              "Drive to Ella",
              "Nine Arch Bridge",
              "Sunset at Ella Rock"
            ],
            meals: ["Breakfast", "Lunch", "Dinner"],
            accommodation: "98 Acres Resort - 4*",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
          },
          {
            day: 8,
            title: "Ella Adventure",
            description: "Full day exploring Ella's attractions.",
            activities: [
              "Little Adam's Peak hike",
              "Ravana Falls",
              "Ella Gap viewpoint",
              "Local cooking class",
              "Evening relaxation"
            ],
            meals: ["Breakfast", "Lunch", "Dinner"],
            accommodation: "98 Acres Resort - 4*",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
          },
          {
            day: 9,
            title: "Wildlife Safari: Yala",
            description: "Drive to Yala for wildlife safari experience.",
            activities: [
              "Drive to Yala",
              "Evening safari",
              "Wildlife spotting",
              "Leopard tracking",
              "Jungle lodge stay"
            ],
            meals: ["Breakfast", "Lunch", "Dinner"],
            accommodation: "Cinnamon Wild Yala",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
          },
          {
            day: 10,
            title: "Yala Safari & Beach",
            description: "Morning safari and transfer to beach.",
            activities: [
              "Early morning safari",
              "Breakfast at lodge",
              "Drive to beach",
              "Beach relaxation",
              "Sunset swim"
            ],
            meals: ["Breakfast", "Lunch", "Dinner"],
            accommodation: "Cape Weligama - 5*",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
          },
          {
            day: 11,
            title: "Galle & Beach Day",
            description: "Explore Galle Fort and enjoy beach activities.",
            activities: [
              "Galle Fort tour",
              "Beach time",
              "Water sports",
              "Farewell dinner",
              "Sunset cocktails"
            ],
            meals: ["Breakfast", "Lunch", "Dinner"],
            accommodation: "Cape Weligama - 5*",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
          },
          {
            day: 12,
            title: "Departure",
            description: "Final day with souvenir shopping before departure.",
            activities: [
              "Souvenir shopping",
              "Last minute photos",
              "Airport transfer",
              "Departure"
            ],
            meals: ["Breakfast"],
            accommodation: "Not included",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306"
          }
        ],
        inclusions: [
          {
            category: "Complete Package",
            items: [
              "11 nights accommodation",
              "All meals as per itinerary",
              "Private vehicle throughout",
              "English-speaking guide",
              "All entrance fees",
              "All safari jeeps",
              "Scenic train tickets",
              "Cultural shows"
            ]
          },
          {
            category: "Experiences",
            items: [
              "Tea tasting",
              "Cooking class",
              "Wildlife safaris",
              "Cultural performances",
              "Village tours"
            ]
          }
        ],
        exclusions: [
          {
            category: "Extras",
            items: ["International flights", "Visa", "Travel insurance", "Personal expenses"]
          }
        ],
        practicalInfo: {
          bestTimeToVisit: "December to April",
          difficulty: "Moderate",
          groupSize: "2-30 people",
          minimumAge: 5,
          pickupInfo: "Complimentary airport pickup",
          whatToBring: [
            "All climate clothing",
            "Comfortable walking shoes",
            "Swimwear",
            "Camera",
            "Binoculars",
            "Adapter",
            "Sunscreen"
          ]
        },
        faqs: [
          {
            question: "Is this tour too rushed?",
            answer: "No, it's designed to give you a comprehensive experience while allowing time to relax and enjoy each location."
          },
          {
            question: "Can I customize the itinerary?",
            answer: "Yes! We can adjust based on your interests and time constraints."
          }
        ]
      }
    ];

    // Match remaining details with tours
    for (let i = 0; i < toursNeedingDetails.length && i < remainingDetails.length; i++) {
      const tour = toursNeedingDetails[i];
      const details = {
        tourId: tour._id,
        ...remainingDetails[i],
        mapCoordinates: {
          lat: 6.9271 + (i * 0.2),
          lng: 79.8612 + (i * 0.2)
        }
      };

      await TourDetail.create(details);
      console.log(` Created details for: ${tour.name}`);
    }

    console.log('\n All remaining tour details seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(' Error seeding tour details:', error);
    process.exit(1);
  }
};

seedRemainingTourDetails();