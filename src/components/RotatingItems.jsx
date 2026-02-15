import { useEffect, useState } from "react";
import watch from "../assets/images/image1.png";
import shoe from "../assets/images/image2.png";
import guitar from "../assets/images/image3.png";
import "./RotatingItems.css";

export default function RotatingItems() {
  const images = [watch, shoe, guitar];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getClass = (i) => {
    if (i === index) return "carousel-item active";
    if (i === (index - 1 + images.length) % images.length)
      return "carousel-item left";
    return "carousel-item right";
  };

  return (
    <div className="relative inline-block">
      <div className="carousel-container">
        {images.map((img, i) => (
          <img key={i} src={img} className={getClass(i)} alt="item" />
        ))}
      </div>
      {/* Dynamic shadow beneath the rotating object */}
      <div className="carousel-shadow"></div>
    </div>
  );
}
