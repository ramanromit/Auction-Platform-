import watch from "../assets/images/image1.png";
import shoes from "../assets/images/image2.png";
import guitar from "../assets/images/image3.png";

export default function FeaturedAuctions() {

  const items = [
    {
      title: "Luxury Watch",
      bid: "₹45,000",
      image: watch
    },
    {
      title: "Premium Sneakers",
      bid: "₹18,500",
      image: shoes
    },
    {
      title: "Electric Guitar",
      bid: "₹72,000",
      image: guitar
    }
  ];

  return (
    <section className="min-h-screen bg-[#1a0505] flex flex-col items-center justify-center px-20">

      <h2 className="text-4xl font-bold mb-20 text-white">
        Featured Auctions
      </h2>

      <div className="grid grid-cols-3 gap-16">

        {items.map((item, i) => (
          <div
            key={i}
            className="bg-[#1F2937] rounded-2xl p-8 w-80 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-red-600/30 hover:shadow-2xl"
          >

            {/* Image */}
            <div className="h-56 flex items-center justify-center mb-6">
              <img
                src={item.image}
                alt={item.title}
                className="h-full object-contain"
              />
            </div>

            <h3 className="text-xl font-semibold mb-3 text-white">
              {item.title}
            </h3>

            <p className="text-gray-400 mb-6">
              Current Bid: <span className="text-red-500 font-semibold">{item.bid}</span>
            </p>

            <button className="bg-red-600 hover:bg-red-700 w-full py-3 rounded-lg font-semibold transition">
              Place Bid
            </button>

          </div>
        ))}

      </div>

    </section>
  );
}
