import { Link } from "react-router-dom";
import RotatingItems from "./RotatingItems";
import TextType from "./TextType";


export default function Hero() {
  return (
    <section className="min-h-screen flex items-center px-20 relative overflow-hidden">

      <div className="flex w-full items-center justify-between relative z-10">

        {/* LEFT SIDE */}
        <div className="w-1/2 space-y-6">
          <div className="h-24 flex items-center mb-16">
            <TextType
              text={["Win Rare Items. Outbid Everyone."]}
              typingSpeed={50}
              pauseDuration={9999999}
              showCursor={false}
              cursorCharacter="_"
              deletingSpeed={0}
              variableSpeedEnabled={false}
              className="text-6xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-red-400 drop-shadow-lg"
            />
          </div>

          <p className="text-gray-200 text-lg max-w-md font-medium tracking-wide">
            BidNest is a competitive online auction platform where buyers compete in real-time.
          </p>

          <div className="flex gap-4 pt-4">
            <Link to="/dashboard">
              <button style={{ backgroundColor: '#B40D24' }} className="px-6 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition">
                Start Bidding
              </button>
            </Link>

            <Link to="/sell">
              <button className="border border-red-600 text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-600/10 transition">
                Sell an Item
              </button>
            </Link>
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
