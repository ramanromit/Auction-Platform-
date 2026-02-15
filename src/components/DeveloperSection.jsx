import { motion } from "framer-motion";
import DecryptedText from "./DecryptedText";

import dev1 from "../assets/images/developer.png";
import dev2 from "../assets/images/developer.png";

export default function DeveloperSection() {
  const developers = [
    {
      name: "Romit Raman",
      role: "24BIT0558",
      email: "romit.raman2024@vitstudent.ac.in",
      image: dev1,
    },
    {
      name: "Aniket Agrawal",
      role: "24BIT0533",
      email: "aniket.agrawal2024@vitsudent.ac.in",
      image: dev2,
    },
  ];

  return (
    <section id="contact" className="min-h-screen flex flex-col items-center justify-center px-20 relative overflow-hidden">

      <div className="relative z-10">

        <h2 className="text-4xl font-bold mb-20 text-white">
          <DecryptedText
            text="Meet The Developers"
            speed={50}
            maxIterations={8}
            animateOn="view"
            sequential
          />
        </h2>

        <div className="flex gap-20">

          {developers.map((dev, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="bg-[#1F2937] rounded-3xl p-10 w-96 text-center shadow-2xl hover:scale-105 hover:shadow-red-600/30 hover:shadow-2xl transition-all duration-300"
            >

              {/* Profile Image */}
              <div className="flex justify-center mb-6">
                <img
                  src={dev.image}
                  alt={dev.name}
                  className="w-40 h-40 rounded-full object-cover border-4 border-red-600 shadow-lg"
                />
              </div>

              <h3 className="text-2xl font-semibold text-white mb-2">
                {dev.name}
              </h3>

              <p className="text-red-600 font-medium mb-3">
                {dev.role}
              </p>

              <p className="text-gray-400 text-sm">
                {dev.email}
              </p>

            </motion.div>
          ))}

        </div>

      </div>

    </section>
  );
}
