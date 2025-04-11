import { motion } from "framer-motion";

const TodayRent = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <section className="relative rounded-xl p-4 backdrop-blur-sm bg-white/10 border border-[#efefef]/20 shadow-sm overflow-hidden">
        {/* Animated floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-[#749C73]/20"
              initial={{ 
                x: Math.random() * 100, 
                y: Math.random() * 100,
                opacity: 0.3 + Math.random() * 0.4
              }}
              animate={{ 
                x: [
                  Math.random() * 100, 
                  Math.random() * 100, 
                  Math.random() * 100
                ],
                y: [
                  Math.random() * 100, 
                  Math.random() * 100, 
                  Math.random() * 100
                ]
              }}
              transition={{ 
                duration: 8 + Math.random() * 10, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}
        </div>

        {/* Pulsing circle behind text */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-[#B7F6B5]/10"
          animate={{ 
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="relative z-10 text-center">
          <div className="flex justify-center mb-2">
            <motion.div 
              className="relative"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
            >
              {/* Calendar icon with animated elements */}
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="40" 
                height="40" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-[#749C73]"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
                
                {/* Animated checkmark */}
                <motion.path 
                  d="M9 16l2 2 4-4" 
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="text-[#B7F6B5]"
                />
              </motion.svg>
              
              {/* Animated notification dot */}
              <motion.div 
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#749C73]"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.4, delay: 1.1 }}
              />
            </motion.div>
          </div>

          <motion.h3 
            className="text-lg font-medium text-[#749C73]"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Tidak ada peminjaman ruangan hari ini
          </motion.h3>
          
          <motion.p
            className="mt-1 text-sm text-gray-600"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Saat ini semua ruangan sedang kosong.
            <motion.span 
              className="block text-[#749C73] font-medium"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Silakan lakukan Peminjaman.
            </motion.span>
          </motion.p>
          
          {/* Animated action button */}
          <motion.div
            className="mt-3 flex justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1 }}
          >
            <motion.button
              className="flex items-center space-x-1 px-3 py-1 rounded-full bg-[#749C73]/10 text-[#749C73] text-xs font-medium"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(116, 156, 115, 0.2)" }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
              >
                <path d="M12 5v14M5 12h14" />
              </motion.svg>
              <span>Buat Peminjaman</span>
            </motion.button>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default TodayRent;