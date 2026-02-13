import { useState, useEffect } from "react";
import image1 from "../assets/images/image1.png";
import image2 from "../assets/images/image2.png";
import image3 from "../assets/images/image3.png";


export default function RotatingItems() {
  const items = [image1,image2,image3
];


  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getClass = (index) => {
    if (index === activeIndex) return "carousel-item active";
    if (index === (activeIndex + 1) % items.length)
      return "carousel-item right";
    if (index === (activeIndex - 1 + items.length) % items.length)
      return "carousel-item left";
    return "carousel-item hidden";
  };

return (
  <div className="carousel-container">
    {items.map((item, index) => (
      <img
        key={index}
        src={item}
        alt="Auction Item"
        className={getClass(index)}
      />
    ))}
  </div>
);

}
