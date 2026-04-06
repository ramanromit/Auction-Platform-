import DecryptedText from "./DecryptedText";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      num: 1,
      title: "Create Account",
      desc: "Sign up and join our competitive bidding platform in seconds.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
    },
    {
      num: 2,
      title: "Browse Auctions",
      desc: "Explore live auctions across categories and find items you love.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      num: 3,
      title: "Place Your Bid",
      desc: "Bid in real-time on exclusive products and compete with others.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      num: 4,
      title: "Highest Bid Wins",
      desc: "Outbid everyone to claim victory. The highest bid at the closing time secures the item automatically.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 15.5l2-2m-4.5 4.5l5.5-5.5a2.121 2.121 0 013 3l-5.5 5.5-3-3zM18 7l3 3m-3-3l-3-3m3 3l-7.5 7.5a2.121 2.121 0 01-3 0l-3-3a2.121 2.121 0 010-3L11 4.5 18 7z" />
        </svg>
      ),
    },
    {
      num: 5,
      title: "Wallet Settlement",
      desc: "No manual checkout needed. Funds are instantly debited from the winner and credited to the seller's wallet.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="min-h-screen flex flex-col justify-center px-10 relative overflow-hidden py-20">

      <div className="relative z-10 w-full">

        {/* Section Header */}
        <div className="text-left mb-16">
          <h2 className="text-4xl md:text-4xl font-bold text-white mb-4">
            <DecryptedText
              text="How It Works"
              speed={50}
              maxIterations={8}
              animateOn="view"
              sequential
            />
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-lg max-w-2xl"
          >
           Your complete auction journey in five simple steps.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Connecting line behind the cards */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[2px] -translate-y-1/2 z-0">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-red-600/30 to-transparent rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                className="group relative z-10"
              >
                {/* Glow effect on hover */}
                <div className="absolute -inset-[1px] bg-gradient-to-b from-red-600/0 via-red-600/0 to-red-600/0 group-hover:from-red-600/40 group-hover:via-red-500/20 group-hover:to-transparent rounded-2xl transition-all duration-500 blur-sm" />

                <div className="relative bg-[#111827]/80 backdrop-blur-md border border-gray-700/50 group-hover:border-red-500/40 rounded-2xl p-6 h-full flex flex-col items-center text-center transition-all duration-500 group-hover:bg-[#111827]/95 group-hover:shadow-2xl group-hover:shadow-red-900/10 group-hover:-translate-y-2">
                  
                  {/* Step number badge — top corner */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-red-600/30 group-hover:scale-110 transition-transform">
                    {step.num}
                  </div>

                  {/* Icon container */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600/20 to-red-900/10 border border-red-500/20 flex items-center justify-center mb-5 text-red-400 group-hover:text-red-300 group-hover:border-red-500/40 group-hover:from-red-600/30 group-hover:to-red-900/20 transition-all duration-500">
                    {step.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-white font-semibold text-lg mb-3 group-hover:text-red-100 transition-colors">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                    {step.desc}
                  </p>

                  {/* Arrow connector (between cards, not after the last one) */}
                  {i < steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 text-red-600/40">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>

    </section>
  );
}
