// Import all images
import Cultural from '../components/work/assets/Cultural-Triangle.png';
import Hill from '../components/work/assets/Hill-Country.png';
import Safari from '../components/work/assets/Wild-Safari.png';
import Coastal from '../components/work/assets/Coastal-Paradise.png';
import Tea from '../components/work/assets/Tea-Plantation.png';
import Full from '../components/work/assets/Complete-Experience.png';
import Sigiriya from '../components/work/assets/Sigiriya-Rock.png';
import EllaTrain from '../components/work/assets/Ella-Train.png';
import TeaPlantation from '../components/work/assets/Tea-Plantation.png';

// Create a map object (named export)
export const tourImageMap = {
  "Cultural Triangle Explorer": Cultural,
  "Hill Country Adventure": Hill,
  "Wildlife Safari Experience": Safari,
  "Coastal Paradise Tour": Coastal,
  "Tea Country Journey": Tea,
  "Complete Sri Lanka Experience": Full,
  
  // For detail pages
  "sigiriya": Sigiriya,
  "ella": EllaTrain,
  "tea": TeaPlantation
};

// Helper function (named export)
export const getTourImage = (tour) => {
  if (!tour || !tour.name) return Cultural; // fallback
  
  // Try exact match first
  if (tourImageMap[tour.name]) {
    return tourImageMap[tour.name];
  }
  
  // Try partial matching
  const nameLower = tour.name.toLowerCase();
  if (nameLower.includes('cultural')) return Cultural;
  if (nameLower.includes('hill')) return Hill;
  if (nameLower.includes('safari') || nameLower.includes('wildlife')) return Safari;
  if (nameLower.includes('coastal') || nameLower.includes('beach')) return Coastal;
  if (nameLower.includes('tea')) return Tea;
  if (nameLower.includes('complete') || nameLower.includes('experience')) return Full;
  
  // Default fallback
  return Cultural;
};

// Also export as an object with both for convenience
export const tourImages = {
  Cultural,
  Hill,
  Safari,
  Coastal,
  Tea,
  Full,
  Sigiriya,
  EllaTrain,
  TeaPlantation
};