import {motion } from "framer-motion";

const ElegantLoader = () => (
    <div className="flex justify-center items-center py-12">
      <motion.div
        animate={{
          rotate: 360,
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          },
        }}
        className="w-12 h-12 border-2 border-t-[#749C73] border-[#e5e7eb] rounded-full"
      ></motion.div>
    </div>
  );

  export default ElegantLoader
  