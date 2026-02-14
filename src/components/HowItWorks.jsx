export default function HowItWorks() {
  const steps = [
    {
      num: 1,
      title: "Create Account",
      desc: "Sign up and join our competitive bidding platform in seconds.",
    },
    {
      num: 2,
      title: "Place Your Bid",
      desc: "Bid in real-time on exclusive products and compete with others.",
    },
    {
      num: 3,
      title: "Win & Checkout",
      desc: "Win the auction and complete your secure payment instantly.",
    },
  ];

  return (
    <section className="min-h-screen bg-[#0f172a] flex flex-col justify-center items-center px-16">

      <h2 className="text-4xl font-bold mb-20 text-white">How It Works</h2>

      <div className="flex gap-16">

        {steps.map((step, i) => (
          <div key={i} className="cube-card w-64 h-48 perspective relative">

            <div className="cube relative w-full h-full">

              {/* FRONT */}
              <div className="cube-face cube-front flex flex-col items-center justify-center text-white shadow-xl">

                <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center mb-4 font-bold">
                  {step.num}
                </div>

                <h3 className="font-semibold">{step.title}</h3>

              </div>

              {/* BOTTOM */}
              <div className="cube-face cube-bottom flex items-center justify-center text-white text-center px-6 shadow-xl">

                <p>{step.desc}</p>

              </div>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}
