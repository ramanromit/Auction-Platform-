import { motion } from "framer-motion";

export default function AboutSection() {
  return (
   <section id="about" className="min-h-screen bg-[#0f172a] py-32 px-10">


      <div className="flex w-full items-center justify-between gap-16">

        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-1/2 space-y-6"
        >
          <h2 className="text-4xl font-bold text-white">
            About <span className="text-red-600">BidNest</span>
          </h2>

          <p className="text-gray-400 text-lg leading-relaxed">
            BidNest is a next-generation auction platform designed to create
            an exciting, transparent, and secure bidding experience. We combine
            technology with competition to bring energy back to online auctions.
          </p>

          <div className="grid grid-cols-2 gap-6 pt-6">

            <div className="bg-[#1F2937] p-6 rounded-xl shadow-lg">
              <h3 className="text-red-600 font-semibold mb-2">Secure</h3>
              <p className="text-gray-400 text-sm">
                Advanced security systems protect every transaction.
              </p>
            </div>

            <div className="bg-[#1F2937] p-6 rounded-xl shadow-lg">
              <h3 className="text-red-600 font-semibold mb-2">Live Bidding</h3>
              <p className="text-gray-400 text-sm">
                Real-time competitive bidding with instant updates.
              </p>
            </div>

          </div>
        </motion.div>

        {/* RIGHT SIDE — NEW DESIGN */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-1/2 flex justify-center relative"
        >
          {/* Glow */}
          <div className="absolute w-80 h-80 bg-red-600/20 blur-3xl rounded-full"></div>

          <div className="relative z-10 bg-[#1F2937] p-10 rounded-2xl shadow-2xl w-96 space-y-6">

            <h3 className="text-2xl font-semibold text-white">
              Platform Highlights
            </h3>

            <div className="flex justify-between text-gray-400">
              <span>Active Users</span>
              <span className="text-red-600 font-bold">10K+</span>
            </div>

            <div className="flex justify-between text-gray-400">
              <span>Auctions Hosted</span>
              <span className="text-red-600 font-bold">5K+</span>
            </div>

            <div className="flex justify-between text-gray-400">
              <span>Verified Sellers</span>
              <span className="text-red-600 font-bold">2K+</span>
            </div>

            {/* Pulse Indicator */}
            <div className="flex items-center gap-3 pt-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-400 text-sm">
                Live auctions happening now
              </span>
            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}
