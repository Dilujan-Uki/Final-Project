import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TourGuideDetailPage.css';
import { getGuideImage, guideImageById } from '../../../utils/guideImageMapping';

const staticGuides = {
  1: {
    id: 1, name: 'Rajitha Fernando', title: 'Senior Heritage & Archaeological Guide',
    rating: 4.9, totalReviews: 247, experience: '12 Years', dailyRate: 80, category: 'cultural',
    languages: ['English (Fluent)', 'Sinhala (Native)', 'Tamil (Fluent)', 'French (Conversational)'],
    specialties: ['Cultural Heritage', 'UNESCO Sites', 'Ancient History', 'Temple Architecture'],
    fullBio: "Born and raised in Kandy, Rajitha developed a deep passion for Sri Lankan history from childhood visits to the sacred Temple of the Tooth. He pursued a Masters in Archaeology from the University of Peradeniya and has since guided thousands of visitors through the island's most treasured UNESCO World Heritage Sites. Rajitha has been recognised by the Sri Lanka Tourism Development Authority for excellence in cultural tourism three years in a row.",
    description: "Rajitha is a certified cultural heritage guide with over 12 years of experience specialising in Sri Lanka's ancient civilizations. His academic background in archaeology gives him a uniquely deep understanding of every site he visits.",
    tourSpecialties: ['Sigiriya Rock Fortress', 'Ancient city of Polonnaruwa', 'Sacred city of Kandy & Temple of the Tooth', 'Dambulla Cave Temple Complex', 'Anuradhapura archaeological sites', 'Mihintale Sacred Mountain'],
    certifications: ['Government Licensed Tourist Guide (Grade 1)', 'Archaeological Society of Sri Lanka – Full Member', 'UNESCO Certified Cultural Heritage Guide', 'First Aid & Emergency Response Certified', 'Masters in Archaeology – University of Peradeniya'],
    highlights: [{icon:'🏛️',label:'Specialisation',value:'Cultural & Heritage'},{icon:'🎓',label:'Education',value:'Masters in Archaeology'},{icon:'🌍',label:'Tours Led',value:'1,400+'},{icon:'🏆',label:'Award',value:'SLTDA Excellence 3×'}],
    availability: 'Available for bookings 7 days a week', responseTime: 'Usually responds within 1 hour',
    contactInfo: { email: 'rajitha.fernando@ceylontours.lk', phone: '+94 77 123 4567' },
    reviews: [{id:1,name:'Michael Anderson',date:'January 2025',rating:5,comment:"Rajitha made ancient history come alive! His knowledge of Sigiriya was absolutely incredible — he knew every detail of every fresco.",tour:'Cultural Triangle Explorer'},{id:2,name:'Sarah Williams',date:'December 2024',rating:5,comment:"Best guide we've ever had across 20 countries. Patient, deeply knowledgeable, and genuinely passionate about Sri Lankan culture.",tour:'Complete Sri Lanka Experience'},{id:3,name:'David Chen',date:'November 2024',rating:5,comment:"Rajitha's insights into temple architecture were fascinating. He pointed out details we would have walked past a hundred times.",tour:'Cultural Triangle Explorer'}]
  },
  2: {
    id: 2, name: 'Kamal Silva', title: 'Wildlife & Safari Specialist',
    rating: 4.8, totalReviews: 189, experience: '8 Years', dailyRate: 70, category: 'wildlife',
    languages: ['English (Fluent)', 'Sinhala (Native)'],
    specialties: ['Wildlife', 'Bird Watching', 'Safari', 'Photography', 'Conservation'],
    fullBio: "Kamal spent five years as a field researcher with the Wildlife Conservation Society of Sri Lanka before transitioning to guiding. That scientific background means he reads the jungle like a map — spotting leopards, elephants, and rare birds before his guests even lift their binoculars. He is passionate about conservation and weaves environmental education naturally into every safari experience.",
    description: "A former wildlife researcher turned guide, Kamal is Sri Lanka's go-to specialist for big-game safaris, bird-watching expeditions, and marine conservation encounters. His expertise with leopards at Yala is unmatched.",
    tourSpecialties: ['Yala National Park – Leopard Safari', 'Udawalawe Elephant Sanctuary', 'Sinharaja Rainforest Bird-Watching', 'Mirissa Whale & Dolphin Watching', 'Wilpattu National Park', 'Minneriya Elephant Gathering'],
    certifications: ['Government Wildlife Guide License', 'Wildlife Conservation Society – Field Researcher (5 yrs)', 'PADI Open Water Dive Certified', 'Wilderness First Responder', 'Jeep Safari Advanced Training'],
    highlights: [{icon:'🦁',label:'Specialisation',value:'Wildlife & Safari'},{icon:'🔭',label:'Research Exp.',value:'5 Years Field Research'},{icon:'🌿',label:'Tours Led',value:'900+'},{icon:'🐆',label:'Known For',value:'Leopard Tracking'}],
    availability: 'Available 6 days a week (closed Fridays)', responseTime: 'Usually responds within 2 hours',
    contactInfo: { email: 'kamal.silva@ceylontours.lk', phone: '+94 77 234 5678' },
    reviews: [{id:1,name:'Emma Thompson',date:'February 2025',rating:5,comment:"We spotted four leopards in one morning at Yala! Kamal knew exactly where to look. An absolutely unforgettable experience.",tour:'Wildlife Safari Adventure'},{id:2,name:'James Patel',date:'January 2025',rating:5,comment:"Kamal's knowledge of bird species is extraordinary. He identified over 60 birds by song alone during our Sinharaja walk.",tour:'Rainforest & Wildlife Tour'},{id:3,name:'Sophie Laurent',date:'December 2024',rating:5,comment:"Warm, funny, brilliant. Kamal turned a simple jeep ride into a genuine wildlife documentary.",tour:'Wildlife Safari Adventure'}]
  },
  3: {
    id: 3, name: 'Nimaltha Perera', title: 'Adventure & Mountain Guide',
    rating: 4.7, totalReviews: 156, experience: '6 Years', dailyRate: 65, category: 'adventure',
    languages: ['English (Fluent)', 'Sinhala (Native)', 'Tamil (Basic)'],
    specialties: ['Adventure', 'Hiking', 'Camping', 'Mountain Biking', 'Rock Climbing'],
    fullBio: "Growing up in the shadow of Adam's Peak in Sri Lanka's hill country, Nimaltha was climbing mountains before he could drive. He became a certified rock-climbing instructor at 22 and has since led expeditions across the Knuckles Mountain Range, Horton Plains, and Sri Lanka's most remote jungle trails. He is equally comfortable planning a family-friendly scenic hike or a challenging multi-day mountain trek.",
    description: "A certified mountain guide with extensive experience across Sri Lanka's hill country, Nimaltha specialises in adventure treks, rock climbing, and camping expeditions that connect guests with the island's stunning highland landscapes.",
    tourSpecialties: ["Adam's Peak Sunrise Pilgrimage", 'Knuckles Mountain Range Trek', "Horton Plains & World's End Walk", 'Rock Climbing at Ella Rock', 'Bambarakanda Waterfall Hike', 'Overnight Jungle Camping – Sinharaja'],
    certifications: ['Mountain Guide License – Sri Lanka Tourism', 'Rock Climbing Instructor (Level 2)', 'Wilderness First Responder', 'Leave No Trace (LNT) Educator', 'Mountain Bike Trail Leader Certificate'],
    highlights: [{icon:'🏔️',label:'Specialisation',value:'Adventure & Trekking'},{icon:'🧗',label:'Climbing Routes',value:'30+ Established'},{icon:'🌄',label:'Tours Led',value:'700+'},{icon:'⛺',label:'Known For',value:'Overnight Expeditions'}],
    availability: 'Available for bookings 7 days a week', responseTime: 'Usually responds within 3 hours',
    contactInfo: { email: 'nimal.perera@ceylontours.lk', phone: '+94 77 345 6789' },
    reviews: [{id:1,name:'Alex Morgan',date:'March 2025',rating:5,comment:"The Adam's Peak sunrise hike with Nimaltha was the highlight of our entire trip to Asia. He set the perfect pace and kept spirits high the whole way up.",tour:"Hill Country Adventure"},{id:2,name:'Lena Müller',date:'February 2025',rating:5,comment:"Incredibly safety-conscious without taking any of the thrill away. The Knuckles Range camping night was magical.",tour:'Knuckles Trek & Camp'},{id:3,name:'Tom Richards',date:'January 2025',rating:4,comment:"Great guide with detailed local knowledge. The rock climbing session was expertly led.",tour:'Adventure Highlands Tour'}]
  },
  4: {
    id: 4, name: 'Sanduni Perera', title: 'Buddhist Heritage & Arts Guide',
    rating: 4.9, totalReviews: 203, experience: '10 Years', dailyRate: 75, category: 'cultural',
    languages: ['English (Fluent)', 'Sinhala (Native)', 'Japanese (Conversational)'],
    specialties: ['Temple Tours', 'History', 'Archaeology', 'Art', 'Traditional Crafts'],
    fullBio: "Sanduni's fascination with Buddhist art began during her undergraduate studies in Art History at the University of Colombo. A decade of guiding has taken her to every major temple and museum on the island. She speaks Japanese conversationally — a skill that has made her the first-choice guide for groups from Japan exploring Sri Lanka's connections to Theravāda Buddhism. Her tours are unhurried, immersive, and deeply cultural.",
    description: "Specialising in Buddhist heritage, temple architecture, and traditional Sri Lankan arts, Sanduni offers a contemplative and richly detailed perspective on the island's spiritual and artistic heritage.",
    tourSpecialties: ['Temple of the Tooth – Kandy', 'Dambulla Golden Cave Temple', 'Kelaniya Raja Maha Vihara', 'Traditional Kandyan Dance & Crafts', 'National Museum Colombo', 'Galle Dutch Fort Art Trail'],
    certifications: ['Cultural Heritage Guide – Grade 1', 'Art History Diploma – University of Colombo', 'Traditional Crafts Certification – SLEDB', 'Japanese Language Proficiency – JLPT N3', 'Museum Educator Certificate'],
    highlights: [{icon:'🪷',label:'Specialisation',value:'Buddhist & Arts Heritage'},{icon:'🎨',label:'Art Expertise',value:'Temple & Classical Arts'},{icon:'🌏',label:'Tours Led',value:'1,100+'},{icon:'🇯🇵',label:'Languages',value:'Japanese Speaking'}],
    availability: 'Available for bookings 7 days a week', responseTime: 'Usually responds within 1 hour',
    contactInfo: { email: 'sanduni.perera@ceylontours.lk', phone: '+94 77 456 7890' },
    reviews: [{id:1,name:'Yuki Tanaka',date:'March 2025',rating:5,comment:"It was wonderful to explore Sri Lankan Buddhism with a guide who could explain everything in both English and Japanese. Sanduni is exceptional.",tour:'Sacred Sri Lanka Tour'},{id:2,name:'Caroline Dupont',date:'February 2025',rating:5,comment:"Sanduni's love for Buddhist art is completely infectious. She showed us details in the cave temples we would never have noticed.",tour:'Cultural Triangle Explorer'},{id:3,name:'Robert Kim',date:'January 2025',rating:5,comment:"A deeply enriching experience. Sanduni made the spiritual significance of each temple feel very real and personal.",tour:'Sacred Sri Lanka Tour'}]
  },
  5: {
    id: 5, name: 'Chaminda Wickramasinghe', title: 'Marine & Coastal Adventure Guide',
    rating: 4.8, totalReviews: 178, experience: '7 Years', dailyRate: 68, category: 'beach',
    languages: ['English (Fluent)', 'Sinhala (Native)', 'German (Conversational)'],
    specialties: ['Beach Tours', 'Snorkeling', 'Diving', 'Whale Watching', 'Surfing'],
    fullBio: "Chaminda grew up on the southern coast near Mirissa and has been diving since he was 16. After completing his PADI Divemaster and later Instructor certifications, he launched his guiding career combining underwater adventures with beach excursions and coastal history. He has guided whale-watching trips for marine researchers and contributed sighting data to the Blue Whale research programme.",
    description: "A PADI-certified diving instructor with expert knowledge of Sri Lanka's southern and western coastlines, Chaminda specialises in snorkelling, scuba diving, whale watching, and coastal tours.",
    tourSpecialties: ['Blue Whale Watching – Mirissa', 'Scuba Diving – Hikkaduwa Reef', 'Snorkelling – Pigeon Island', 'Sea Turtle Conservation Beach Walk', 'Surfing Introduction – Arugam Bay', 'Galle Fort & Coastal History Tour'],
    certifications: ['PADI Dive Instructor (Open Water)', 'Government Licensed Marine Guide', 'Sri Lanka Surf Lifesaving Association Member', 'Marine Conservation Awareness Certified', 'First Aid & Oxygen Administration Certified'],
    highlights: [{icon:'🌊',label:'Specialisation',value:'Marine & Coastal'},{icon:'🤿',label:'Dives Led',value:'2,000+ dives'},{icon:'🐋',label:'Known For',value:'Whale Watching'},{icon:'🏄',label:'Bonus Skill',value:'Surf Instruction'}],
    availability: 'Available for bookings 7 days a week', responseTime: 'Usually responds within 2 hours',
    contactInfo: { email: 'chaminda.w@ceylontours.lk', phone: '+94 77 567 8901' },
    reviews: [{id:1,name:'Isabelle Fontaine',date:'March 2025',rating:5,comment:"We saw a blue whale and three spinner dolphins on the same morning! Chaminda knew exactly when and where to go.",tour:'Southern Coast Highlights'},{id:2,name:'Ben Hartley',date:'February 2025',rating:5,comment:"The Hikkaduwa dive was stunning and Chaminda made sure we were fully comfortable before entering the water.",tour:'Beach & Marine Discovery'},{id:3,name:'Priya Nair',date:'January 2025',rating:5,comment:"Chaminda's passion for marine life is clear in every word he says. The turtle conservation walk was genuinely moving.",tour:'Coastal Sri Lanka Tour'}]
  },
  6: {
    id: 6, name: 'Priya Jayawardena', title: 'Photography & Landscape Specialist',
    rating: 4.9, totalReviews: 167, experience: '9 Years', dailyRate: 82, category: 'photography',
    languages: ['English (Fluent)', 'Sinhala (Native)', 'French (Conversational)'],
    specialties: ['Photography', 'Wildlife', 'Landscape', 'Cultural Events', 'Sunrise Spots'],
    fullBio: "Priya turned her passion for photography into a dual career as a professional photographer and tour guide. Her work has been featured in Lonely Planet, National Geographic Traveller, and the Sri Lanka Tourism Board's official campaigns. She knows every golden-hour vantage point, every misty-morning tea plantation overlook, and every candid cultural moment that makes Sri Lanka so photogenic.",
    description: "A professional photographer with nine years of experience, Priya combines expert guiding with hands-on photography coaching, leading guests to Sri Lanka's most breathtaking viewpoints at exactly the right light.",
    tourSpecialties: ['Sunrise Photography – Sigiriya Rock', 'Tea Plantation Golden Hour – Nuwara Eliya', 'Wildlife Photography – Yala & Minneriya', 'Street & Cultural Photography – Colombo Fort', 'Seascape Long Exposure – Mirissa', 'Train Photography – Ella & Kandy Route'],
    certifications: ["Professional Photographers' Association of Sri Lanka – Member", 'Government Licensed Tourist Guide', 'Adobe Lightroom Certified Educator', 'Drone Pilot License – CAASL', 'First Aid Certified'],
    highlights: [{icon:'📸',label:'Specialisation',value:'Photography & Landscape'},{icon:'🖼️',label:'Publications',value:'NatGeo & Lonely Planet'},{icon:'🌅',label:'Tours Led',value:'800+'},{icon:'🚁',label:'Bonus Skill',value:'Licensed Drone Pilot'}],
    availability: 'Available for bookings 7 days a week', responseTime: 'Usually responds within 1 hour',
    contactInfo: { email: 'priya.j@ceylontours.lk', phone: '+94 77 678 9012' },
    reviews: [{id:1,name:'Nina Volkova',date:'March 2025',rating:5,comment:"I am an amateur photographer and Priya had me shooting images I could not believe I took. She has an incredible eye and endless patience.",tour:'Photography Highlights Tour'},{id:2,name:'Mark Sullivan',date:'February 2025',rating:5,comment:"The Ella train shoot was perfectly timed — Priya knew exactly where to stand and when. Pure magic.",tour:'Hill Country Photo Safari'},{id:3,name:'Anna Kvist',date:'January 2025',rating:5,comment:"Priya's knowledge of light and landscape is phenomenal. The golden-hour tea estate session produced my best travel photos ever.",tour:'Photography Highlights Tour'}]
  }
};

const categoryColors = {
  cultural:    { bg: '#fff7e6', accent: '#d4840a', label: '🏛️ Cultural' },
  wildlife:    { bg: '#e8f5e9', accent: '#2e7d32', label: '🦁 Wildlife' },
  adventure:   { bg: '#e3f2fd', accent: '#1565c0', label: '🏔️ Adventure' },
  beach:       { bg: '#e0f7fa', accent: '#00838f', label: '🏖️ Beach & Marine' },
  photography: { bg: '#f3e5f5', accent: '#6a1b9a', label: '📸 Photography' },
};

const StarRating = ({ rating }) => (
  <span className="gdp-stars">
    {[1,2,3,4,5].map(s => (
      <span key={s} className={s <= Math.round(rating) ? 'gdp-star filled' : 'gdp-star'}>★</span>
    ))}
  </span>
);

const TourGuideDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dbGuide, setDbGuide]   = useState(null);
  const [details, setDetails]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [dbGuideId, setDbGuideId] = useState(null);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const staticGuide = staticGuides[parseInt(id)];

      try {
        const profilesRes = await fetch('http://localhost:5000/api/guides/profiles');
        const profilesData = await profilesRes.json();
        if (profilesData.status === 'success') {
          const matched = profilesData.data.find(g => g.name === staticGuide?.name);
          if (matched) {
            setDbGuide(matched);
            setDbGuideId(matched._id);

            // Now fetch guide details
            try {
              const detailRes = await fetch(`http://localhost:5000/api/guide-details/${matched._id}`);
              const detailData = await detailRes.json();
              if (detailData.status === 'success' && detailData.data) {
                setDetails(detailData.data);
              }
            } catch (_) {}
          }
        }
      } catch (_) {}

      setLoading(false);
    };
    load();
  }, [id]);

  const handleBookGuide = () => {
    const selectedTour = localStorage.getItem('selectedTour');
    const g = merged;
    if (selectedTour) {
      const tourData = JSON.parse(selectedTour);
      navigate(`/booking?tour=${tourData.id}&name=${encodeURIComponent(tourData.name)}&duration=${tourData.duration}&pricePerDay=${tourData.pricePerDay}&guide=${g.id || id}&guideName=${encodeURIComponent(g.name)}&guideDailyRate=${g.dailyRate}&guideDbId=${dbGuideId || ''}`);
    } else {
      alert('Please select a tour first');
      navigate('/tours');
    }
  };

  if (loading) {
    return (
      <div className="gdp-loading">
        <div className="gdp-spinner"></div>
        <p>Loading guide profile…</p>
      </div>
    );
  }

  const base = staticGuides[parseInt(id)] || staticGuides[1];
  const merged = {
    ...base,
    ...(dbGuide ? {
      rating: dbGuide.rating || base.rating,
      totalReviews: dbGuide.totalReviews || base.totalReviews,
      dailyRate: dbGuide.dailyRate || base.dailyRate,
      experience: dbGuide.experience || base.experience,
      languages: dbGuide.languages?.length ? dbGuide.languages : base.languages,
      specialties: dbGuide.specialties?.length ? dbGuide.specialties : base.specialties,
    } : {}),
    ...(details ? {
      title: details.title || base.title,
      fullBio: details.fullBio || base.fullBio,
      description: details.description || base.description,
      tourSpecialties: details.tourSpecialties?.length ? details.tourSpecialties : base.tourSpecialties,
      certifications: details.certifications?.length ? details.certifications : base.certifications,
      highlights: details.highlights?.length ? details.highlights : base.highlights,
      availability: details.availability || base.availability,
      responseTime: details.responseTime || base.responseTime,
      contactInfo: details.contactInfo || base.contactInfo,
      reviews: details.reviews?.length ? details.reviews : base.reviews,
    } : {}),
  };

  const guideImage = guideImageById[parseInt(id)] || getGuideImage(merged);
  const cat = categoryColors[merged.category] || categoryColors.cultural;
  const reviews = merged.reviews || [];
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : merged.rating;

  return (
    <div className="gdp-page">

      {/* HERO */}
      <section className="gdp-hero">
        <div className="gdp-hero-glow"></div>
        <div className="gdp-container">
          <button className="gdp-back-btn" onClick={() => navigate(-1)}>
            ← Back to Guides
          </button>

          <div className="gdp-hero-card">
            <div className="gdp-hero-image-col">
              <div className="gdp-avatar-wrap">
                <img src={guideImage} alt={merged.name} className="gdp-avatar" />
                <div className="gdp-avatar-glow-ring"></div>
              </div>
              <span className="gdp-cat-badge" style={{ background: cat.bg, color: cat.accent, borderColor: cat.accent }}>
                {cat.label}
              </span>
              <div className="gdp-rating-pill">
                <span className="gdp-rating-star">★</span>
                <span className="gdp-rating-num">{merged.rating}</span>
                <span className="gdp-rating-slash">·</span>
                <span className="gdp-rating-rev">{merged.totalReviews} reviews</span>
              </div>
            </div>

            <div className="gdp-hero-info">
              <h1 className="gdp-guide-name">{merged.name}</h1>
              <p className="gdp-guide-title">{merged.title}</p>

              <div className="gdp-highlights-grid">
                {merged.highlights.map((h, i) => (
                  <div key={i} className="gdp-highlight-chip">
                    <span className="gdp-hl-icon">{h.icon}</span>
                    <div>
                      <p className="gdp-hl-label">{h.label}</p>
                      <p className="gdp-hl-value">{h.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="gdp-hero-bottom">
                <div className="gdp-price-tag">
                  <span className="gdp-price-amount">${merged.dailyRate}</span>
                  <span className="gdp-price-unit">/day</span>
                </div>
                <button className="gdp-btn-book" onClick={handleBookGuide}>
                  📅 Book This Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TABS */}
      <div className="gdp-tabs-bar">
        <div className="gdp-container">
          {['about','specialties','reviews'].map(tab => (
            <button
              key={tab}
              className={`gdp-tab ${activeTab === tab ? 'gdp-tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'about'       && '👤 About'}
              {tab === 'specialties' && '🗺️ Specialties'}
              {tab === 'reviews'     && `⭐ Reviews (${reviews.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* BODY */}
      <div className="gdp-body">
        <div className="gdp-container gdp-body-grid">

          {/* MAIN */}
          <div className="gdp-main">

            {activeTab === 'about' && (
              <>
                <div className="gdp-card">
                  <h3 className="gdp-card-title">
                    <span className="gdp-title-bar" style={{ background: cat.accent }}></span>
                    About {merged.name.split(' ')[0]}
                  </h3>
                  <p className="gdp-bio-full">{merged.fullBio}</p>
                  <p className="gdp-bio-desc">{merged.description}</p>
                </div>

                <div className="gdp-card">
                  <h3 className="gdp-card-title">
                    <span className="gdp-title-bar" style={{ background: cat.accent }}></span>
                    Languages
                  </h3>
                  <div className="gdp-lang-grid">
                    {merged.languages.map((lang, i) => (
                      <div key={i} className="gdp-lang-chip" style={{ borderColor: cat.accent + '44' }}>
                        <span>🗣</span>{lang}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="gdp-card">
                  <h3 className="gdp-card-title">
                    <span className="gdp-title-bar" style={{ background: cat.accent }}></span>
                    Certifications & Qualifications
                  </h3>
                  <ul className="gdp-cert-list">
                    {merged.certifications.map((c, i) => (
                      <li key={i} className="gdp-cert-item">
                        <span className="gdp-cert-check" style={{ color: cat.accent }}>✓</span>{c}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {activeTab === 'specialties' && (
              <>
                <div className="gdp-card">
                  <h3 className="gdp-card-title">
                    <span className="gdp-title-bar" style={{ background: cat.accent }}></span>
                    Areas of Expertise
                  </h3>
                  <div className="gdp-spec-tags">
                    {merged.specialties.map((s, i) => (
                      <span key={i} className="gdp-spec-tag" style={{ borderColor: cat.accent, color: cat.accent, background: cat.bg }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="gdp-card">
                  <h3 className="gdp-card-title">
                    <span className="gdp-title-bar" style={{ background: cat.accent }}></span>
                    Signature Tour Destinations
                  </h3>
                  <div className="gdp-tour-spec-list">
                    {merged.tourSpecialties.map((t, i) => (
                      <div key={i} className="gdp-tour-spec-item">
                        <span className="gdp-pin" style={{ color: cat.accent }}>📍</span>
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'reviews' && (
              <div className="gdp-card">
                <h3 className="gdp-card-title">
                  <span className="gdp-title-bar" style={{ background: cat.accent }}></span>
                  Guest Reviews
                </h3>

                <div className="gdp-reviews-summary">
                  <div className="gdp-score-circle" style={{ borderColor: cat.accent }}>
                    <span className="gdp-score-num">{avgRating}</span>
                    <span className="gdp-score-max">/5</span>
                  </div>
                  <div>
                    <StarRating rating={parseFloat(avgRating)} />
                    <p className="gdp-rev-count">{reviews.length} verified reviews</p>
                  </div>
                </div>

                <div className="gdp-reviews-list">
                  {reviews.length === 0 && <p className="gdp-no-reviews">No reviews yet.</p>}
                  {reviews.map((rev, i) => (
                    <div key={rev.id || i} className="gdp-review-card">
                      <div className="gdp-rev-avatar" style={{ background: cat.accent }}>
                        {rev.name.charAt(0)}
                      </div>
                      <div className="gdp-rev-body">
                        <div className="gdp-rev-header">
                          <span className="gdp-rev-name">{rev.name}</span>
                          <span className="gdp-rev-date">{rev.date}</span>
                        </div>
                        <StarRating rating={rev.rating} />
                        <p className="gdp-rev-tour">🗺️ {rev.tour}</p>
                        <p className="gdp-rev-comment">"{rev.comment}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="gdp-sidebar">

            <div className="gdp-sidebar-card">
              <h4 className="gdp-sidebar-title">Quick Info</h4>
              {[
                { icon: '🕰', label: 'Experience', value: merged.experience },
                { icon: '💰', label: 'Daily Rate', value: `$${merged.dailyRate} / day` },
                { icon: '📅', label: 'Availability', value: merged.availability },
                { icon: '⚡', label: 'Response Time', value: merged.responseTime },
              ].map((row, i) => (
                <div key={i} className="gdp-info-row">
                  <span className="gdp-info-icon">{row.icon}</span>
                  <div>
                    <p className="gdp-info-label">{row.label}</p>
                    <p className="gdp-info-value">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="gdp-sidebar-card">
              <h4 className="gdp-sidebar-title">Contact</h4>
              <a className="gdp-contact-link" href={`mailto:${merged.contactInfo?.email}`}>
                <span>✉️</span>{merged.contactInfo?.email}
              </a>
              <a className="gdp-contact-link" href={`tel:${merged.contactInfo?.phone}`}>
                <span>📞</span>{merged.contactInfo?.phone}
              </a>
            </div>

            <div className="gdp-sidebar-card gdp-cta-card" style={{ borderTop: `4px solid ${cat.accent}` }}>
              <h4 className="gdp-cta-heading">Ready to explore?</h4>
              <p className="gdp-cta-text">Book {merged.name.split(' ')[0]} and start an unforgettable Sri Lankan adventure.</p>
              <button className="gdp-btn-book gdp-btn-book--wide" onClick={handleBookGuide}>
                📅 Book {merged.name.split(' ')[0]} Now
              </button>
              <button className="gdp-btn-outline" onClick={() => navigate('/tour-guides')}>
                View All Guides
              </button>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
};

export default TourGuideDetailPage;