export default function HowItWorks() {
  return (
    <section className="how-section">
      <h2>How It Works</h2>

      <div className="steps">

        <div className="cube-card">
          <div className="cube">
            <div className="cube-face cube-front">
              <div className="step-icon">1</div>
              <h3>Create Account</h3>
            </div>
            <div className="cube-face cube-bottom">
              <p>Sign up and join our competitive bidding platform in seconds.</p>
            </div>
          </div>
        </div>

        <div className="cube-card">
          <div className="cube">
            <div className="cube-face cube-front">
              <div className="step-icon">2</div>
              <h3>Place Your Bid</h3>
            </div>
            <div className="cube-face cube-bottom">
              <p>Bid in real-time on exclusive products and compete with others.</p>
            </div>
          </div>
        </div>

        <div className="cube-card">
          <div className="cube">
            <div className="cube-face cube-front">
              <div className="step-icon">3</div>
              <h3>Win & Checkout</h3>
            </div>
            <div className="cube-face cube-bottom">
              <p>Win the auction and complete your secure payment instantly.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
