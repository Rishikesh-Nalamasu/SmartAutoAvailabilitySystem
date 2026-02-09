import laptopMap from "./map-for-laptop.png";
import mobileMap from "./map-for-mobile.png";

export const getMapImage = () => {
  if (window.innerWidth <= 768) {
    return mobileMap;
  }
  return laptopMap;
};
