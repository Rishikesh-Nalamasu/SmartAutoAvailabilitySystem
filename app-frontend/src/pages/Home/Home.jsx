import "./Home.css";
import { getMapImage } from "../../assets/mapImgs";

function Home() {
  const mapImage = getMapImage();

  return (
    <div
      className="home-map"
      style={{ backgroundImage: `url(${mapImage})` }}
    >
      <h1 className="home-title">Welcome to Map</h1>
    </div>
  );
}

export default Home;
