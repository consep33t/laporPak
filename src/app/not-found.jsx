"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();

  const clayStyle = (baseColor, highlight, shadow) => ({
    backgroundColor: baseColor,
    boxShadow: `
      inset -8px -8px 16px ${shadow}, 
      inset 8px 8px 16px ${highlight}, 
      6px 12px 24px rgba(0,0,0,0.2)
    `,
  });

  const DynamicShadow = ({ delay }) => (
    <motion.div 
      animate={{ scale: [1, 0.7, 1], opacity: [0.3, 0.1, 0.3] }} 
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay }} 
      className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-[100%] blur-[10px] z-[-1]"
    />
  );

  const renderCar = (color, highlight, shadow) => (
    <div className="relative w-48 h-24 transform scale-75 md:scale-100">
      <div className="absolute w-24 h-14 rounded-t-3xl left-12 top-0 z-10" style={clayStyle(color, highlight, shadow)}>
          <div className="absolute w-8 h-8 bg-blue-100 rounded-tl-xl left-2 top-2 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.2)] border-2 border-white/50"></div>
          <div className="absolute w-8 h-8 bg-blue-100 rounded-tr-xl right-2 top-2 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.2)] border-2 border-white/50"></div>
      </div>
      <div className="absolute w-48 h-14 rounded-2xl left-0 top-8 z-20" style={clayStyle(color, highlight, shadow)}></div>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="absolute w-12 h-12 rounded-full bg-gray-800 left-4 bottom-[-10px] z-30 flex items-center justify-center border-4 border-gray-600 shadow-[inset_0_0_12px_black,0_5px_10px_rgba(0,0,0,0.3)]">
          <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
      </motion.div>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="absolute w-12 h-12 rounded-full bg-gray-800 right-4 bottom-[-10px] z-30 flex items-center justify-center border-4 border-gray-600 shadow-[inset_0_0_12px_black,0_5px_10px_rgba(0,0,0,0.3)]">
          <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
      </motion.div>
      <DynamicShadow delay={0} />
    </div>
  );

  return (
    <div className="min-h-screen bg-clayBg flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* 3D Giant 404 Text */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotateX: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="z-20 flex flex-col items-center"
      >
        <h1 className="text-[8rem] md:text-[12rem] font-black text-clayBlue mb-0 leading-none drop-shadow-[0_20px_20px_rgba(0,0,100,0.2)]" style={{ textShadow: "4px 4px 0 #93c5fd, 8px 8px 0 #60a5fa, 12px 12px 20px rgba(0,0,0,0.3)" }}>
          404
        </h1>
        <div className="bg-white/80 backdrop-blur-md px-8 py-4 rounded-3xl shadow-clay mt-4 text-center">
          <h2 className="text-2xl font-bold text-clayText">Waduh, Jalan Buntu!</h2>
          <p className="text-gray-500 font-medium">Halaman yang Anda cari tidak ada di peta.</p>
        </div>
        
        <Link href="/">
          <button className="mt-8 shadow-clay-btn active:shadow-clay-btn-active bg-clayBlue hover:opacity-90 text-white font-bold text-xl py-4 px-10 rounded-full transition-all duration-200">
            Kembali ke Beranda
          </button>
        </Link>
      </motion.div>

      {/* Orbiting Cars Environment */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
        className="absolute top-1/2 left-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] -mt-[150px] -ml-[150px] md:-mt-[300px] md:-ml-[300px] z-10 pointer-events-none"
      >
        {/* Car 1: Red */}
        <motion.div 
          className="absolute top-[-50px] left-1/2 -ml-[96px]"
          animate={{ y: [0, -20, 0], rotate: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          {renderCar('#ef4444', 'rgba(255,100,100,0.8)', 'rgba(120,0,0,0.6)')}
        </motion.div>

        {/* Car 2: Blue */}
        <motion.div 
          className="absolute bottom-[-50px] left-1/2 -ml-[96px] transform rotate-180"
          animate={{ y: [0, 20, 0], rotate: [175, 185, 175] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          {renderCar('#3b82f6', 'rgba(100,150,255,0.8)', 'rgba(0,0,120,0.6)')}
        </motion.div>

        {/* Car 3: Yellow */}
        <motion.div 
          className="absolute left-[-50px] top-1/2 -mt-[48px] transform -rotate-90"
          animate={{ x: [0, -20, 0], rotate: [-85, -95, -85] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        >
          {renderCar('#facc15', 'rgba(255,255,150,0.8)', 'rgba(150,100,0,0.6)')}
        </motion.div>
      </motion.div>

    </div>
  );
}
