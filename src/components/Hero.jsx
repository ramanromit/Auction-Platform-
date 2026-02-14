import RotatingItems from "./RotatingItems";

export default function Hero() {
  return (
    <section className="min-h-screen bg-[#1a0505] flex items-center px-20">
      
      <div className="flex w-full items-center justify-between">

        {/* LEFT SIDE */}
        <div className="w-1/2 space-y-6">
          <h1 className="text-5xl font-bold leading-tight text-white">
            Win Rare Items.{" "}
            <span className="text-red-600">Outbid Everyone.</span>
          </h1>

          <p className="text-gray-300 text-lg max-w-md">
            BidNest is a competitive online auction platform where buyers compete in real-time.
          </p>

          <div className="flex gap-4 pt-4">
            <button className="bg-red-600 px-6 py-3 rounded-lg font-semibold">
              Start Bidding
            </button>

            <button className="border border-red-600 text-red-600 px-6 py-3 rounded-lg font-semibold">
              Sell an Item
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-1/2 flex justify-center items-center relative">
          <RotatingItems />
        </div>

      </div>
    </section>
  );
}
