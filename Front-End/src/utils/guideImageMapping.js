import Rajitha from '../components/work/assets/Rajitha.png';
import Kamal from '../components/work/assets/Kamal.png';
import Nimal from '../components/work/assets/Nimal.png';
import Sanduni from '../components/work/assets/Sanduni.png';
import Chaminda from '../components/work/assets/Chaminda.png';
import Priya from '../components/work/assets/Priya.png';

// Map by guide name (matches DB name field)
export const guideImageMap = {
  'Rajitha Fernando': Rajitha,
  'Kamal Silva': Kamal,
  'Nimaltha Perera': Nimal,
  'Sanduni Perera': Sanduni,
  'Chaminda Wickramasinghe': Chaminda,
  'Priya Jayawardena': Priya,
};

// Map by static guide id (1-6) used in TourGuidesPage
export const guideImageById = {
  1: Rajitha,
  2: Kamal,
  3: Nimal,
  4: Sanduni,
  5: Chaminda,
  6: Priya,
};

export const getGuideImage = (guide) => {
  if (!guide) return Rajitha;
  // Try by name
  if (guide.name && guideImageMap[guide.name]) return guideImageMap[guide.name];
  // Try by static id
  if (guide.id && guideImageById[guide.id]) return guideImageById[guide.id];
  // Fallback
  return Rajitha;
};

export const guideImages = { Rajitha, Kamal, Nimal, Sanduni, Chaminda, Priya };