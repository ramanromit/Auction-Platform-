import { motion } from "framer-motion";
import DecryptedText from "./DecryptedText";

import dev1 from "../assets/images/romit1.jpeg";
import dev2 from "../assets/images/image.png";
import dev3 from "../assets/images/bgimg2.jpg";

export default function DeveloperSection() {
  const developers = [
    {
      name: "Romit Raman",
      role: "24BIT0558",
      email: "romit.raman2024@vitstudent.ac.in",
      image: dev1,
      headerImage: dev3,
      linkedin: "https://www.linkedin.com/in/romit-raman-03213022b/",
      github: "https://github.com/ramanromit",
    },
    {
      name: "Aniket Agrawal",
      role: "24BIT0533",
      email: "aniket.agrawal2024@vitstudent.ac.in",
      image: dev2,
      headerImage: dev3,
      linkedin: "https://www.linkedin.com/in/aniket-agrawal-817228378/",
      github: "https://github.com/AniketAgrawal-git",
    },
  ];

  return (
    <section id="contact" className="min-h-screen flex flex-col justify-center px-10 relative overflow-hidden">

      <div className="relative z-10 w-full max-w-6xl mx-auto">

        <h2 className="text-4xl font-bold mb-16 text-white text-left">
          <DecryptedText
            text="Meet The Developers"
            speed={50}
            maxIterations={8}
            animateOn="view"
            sequential
          />
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {developers.map((dev, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="relative group bg-[#0e121a] rounded-3xl overflow-hidden shadow-2xl border border-gray-800 hover:border-red-500/50 hover:shadow-red-900/40 transition-all duration-500 flex flex-row h-[350px] sm:h-[400px] xl:h-[420px]"
            >
              
              {/* Left Column - 60% Width (Rest Section) */}
              <div className="w-[60%] h-full flex flex-col relative z-20 bg-[#0e121a]">
                
                {/* Top Heading Photo - 35% Height */}
                <div className="h-[35%] w-full relative overflow-hidden border-b border-gray-800/50">
                  <img 
                    src={dev.headerImage} 
                    alt="Banner" 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e121a] to-transparent"></div>
                  {/* Glowing thin line directly separating top/bottom on left side */}
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-red-600/30 shadow-[0_0_8px_rgba(220,38,38,0.4)]"></div>
                </div>

                {/* Bottom Description Section - 65% Height */}
                <div className="h-[65%] w-full p-4 sm:p-6 lg:p-8 flex flex-col justify-center bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-red-900/10 via-[#0e121a] to-[#0e121a]">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 drop-shadow-md">
                    {dev.name}
                  </h3>

                  <p className="text-red-500 font-bold mb-3 drop-shadow-md text-xs sm:text-sm md:text-base tracking-widest uppercase">
                    {dev.role}
                  </p>

                  <div className="space-y-4 mb-3 sm:mb-5">
                    <div className="text-gray-400 text-xs sm:text-sm flex items-center gap-2 overflow-hidden w-[95%]">
                       <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                      <span className="truncate">{dev.email}</span>
                    </div>
                  </div>

                  {/* Divider inside details */}
                  <hr className="border-gray-800 mb-5 w-[80%]" />

                  {/* Social Icons */}
                  <div className="flex gap-4">
                    <a
                      href={dev.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-xl bg-gray-900/80 border border-gray-700/50 flex items-center justify-center hover:bg-red-900/30 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all duration-300 backdrop-blur-sm group/icon"
                    >
                      <svg className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                    
                    <a
                      href={dev.github}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-xl bg-gray-900/80 border border-gray-700/50 flex items-center justify-center hover:bg-red-900/30 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all duration-300 backdrop-blur-sm group/icon"
                    >
                      <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                  </div>
                </div>

              </div>

              {/* Vertical Divider separating Left/Right Columns */}
              <div className="w-[1px] h-full bg-red-600/30 shadow-[0_0_8px_rgba(220,38,38,0.4)] z-30 flex-shrink-0"></div>

              {/* Right Column - 40% Width (Photo Section) */}
              <div className="w-[40%] h-full relative overflow-hidden bg-gradient-to-b from-[#161b22] to-[#0e121a]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-600/10 to-transparent pointer-events-none transition-colors duration-500 group-hover:from-red-600/20"></div>
                <img
                  src={dev.image}
                  alt={dev.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-110"
                />
              </div>

            </motion.div>
          ))}

        </div>

      </div>

    </section>
  );
}
