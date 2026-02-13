import image1 from "../assets/images/image1.png";
import image2 from "../assets/images/image2.png";
import image3 from "../assets/images/image3.png";

export default function FeaturedAuctions() {
  const auctions = [
    {
      id: 1,
      title: "Luxury Watch",
      image: image1,
      bid: "₹12,500",
      time: "02h 15m"
    },
    {
      id: 2,
      title: "Premium Sneakers",
      image: image2,
      bid: "₹8,300",
      time: "01h 40m"
    },
    {
      id: 3,
      title: "Electric Guitar",
      image: image3,
      bid: "₹18,900",
      time: "03h 05m"
    }
  ];

  return (
    <section className="featured-section">
      <h2 className="section-title">Featured Auctions</h2>

      <div className="auction-grid">
        {auctions.map((item) => (
          <div key={item.id} className="auction-card">
            <img src={item.image} alt={item.title} />
            <h3>{item.title}</h3>

            <div className="auction-info">
              <p>
                Current Bid: <span>{item.bid}</span>
              </p>
              <p className="time">Ends In: {item.time}</p>
            </div>

            <button className="primary-btn">Place Bid</button>
          </div>
        ))}
      </div>
    </section>
  );
}
