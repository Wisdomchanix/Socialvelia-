import React from "react";
import { motion } from "framer-motion";

// ✅ Import images directly from your local folder
// Example folder: src/assets/logos/
import vertex from "/images/Brandfive.png";
import squarestone from "/images/Brandfour.jpg";
import martino from "/images/Brandthree.jpg";
import waverio from "/images/Brandsix.jpg";

const brands = [
  { name: "Vertex", logo: vertex },
  { name: "SquareStone", logo: squarestone },
  { name: "Martino", logo: martino },
  { name: "Waverio", logo: waverio },
  { name: "Vertex", logo: vertex },
  { name: "SquareStone", logo: squarestone },
  { name: "Martino", logo: martino },
  { name: "Waverio", logo: waverio },
];

const Brands: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-white dark:bg-[#1a1029] overflow-hidden transition-colors duration-500">
      <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        {/* Header Text */}
        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg font-medium mb-6 md:mb-8 transition-colors duration-300">
          1000+ Big brands trust us
        </p>

        {/* Animated Logo Row */}
        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex space-x-8 sm:space-x-12 md:space-x-16"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 5,
            }}
          >
            {brands.map((brand, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-center min-w-[100px] sm:min-w-[120px] md:min-w-[150px] opacity-80 hover:opacity-100 transition-transform duration-300"
                whileHover={{ y: -6 }}
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-10 sm:h-8 md:h-10 w-auto object-contain dark:brightness-200 brightness-90 transition duration-300"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Brands;
