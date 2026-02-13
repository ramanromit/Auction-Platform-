import RotatingItems from "./RotatingItems";

export default function Hero() {
  return (
    <section className="hero">

      <div className="hero-left">
        <h1>
          Win Rare Items. <span>Outbid Everyone.</span>
        </h1>

        <p>
          LiveLot is a competitive online auction platform where buyers
          compete in real-time to win exclusive items, and sellers get
          the highest value for their products.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn">Start Bidding</button>
          <button className="secondary-btn">Sell an Item</button>
        </div>
      </div>

      <div className="hero-right">
        <RotatingItems />
      </div>

    </section>
  );
}
