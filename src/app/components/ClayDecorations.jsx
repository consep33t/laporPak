"use client";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";

export default function ClayDecorations() {
  const { scrollYProgress } = useScroll();
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use Spring to eliminate flickering and harsh jumps during scrolling
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    mass: 0.5,
  });

  // Clamp the parallax values so they don't fly off screen on long pages
  // We use smaller offsets (e.g. max -80px) and wrap the whole thing in a fixed container
  const yUpSlow = useTransform(smoothProgress, [0, 1], [0, -80]);
  const yUpFast = useTransform(smoothProgress, [0, 1], [0, -150]);
  const yDownSlow = useTransform(smoothProgress, [0, 1], [0, 80]);
  const xRight = useTransform(smoothProgress, [0, 1], [0, 80]);
  const xLeft = useTransform(smoothProgress, [0, 1], [0, -100]);
  const rotateSway = useTransform(smoothProgress, [0, 1], [0, 90]);

  if (!isMounted) return null;

  // Helper styles for 3D Claymorphism
  const clayStyle = (baseColor, highlight, shadow) => ({
    backgroundColor: baseColor,
    boxShadow: `
      inset -8px -8px 16px ${shadow}, 
      inset 8px 8px 16px ${highlight}, 
      6px 12px 24px rgba(0,0,0,0.2)
    `,
  });

  // Dynamic ground shadow that scales inversely to height
  const DynamicShadow = ({ animationDelay = 0 }) => (
    <motion.div 
      animate={{ 
        scale: [1, 0.7, 1.2, 0.8, 1, 0.9, 1.1, 0.8, 1, 0.7], 
        opacity: [0.3, 0.1, 0.4, 0.2, 0.3, 0.2, 0.4, 0.1, 0.3, 0.1],
        x: [0, 10, -10, 5, -5, 15, -15, 0, 10, -5]
      }} 
      transition={{ repeat: Infinity, duration: 20, ease: "easeInOut", delay: animationDelay }} 
      className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-[100%] blur-[10px] z-[-1]"
    />
  );

  const renderFeedAssets = () => (
    <>
      {/* 3D Tree - Left */}
      <motion.div 
        style={{ y: yUpSlow, rotate: rotateSway, willChange: "transform" }}
        className="absolute top-[20vh] left-[5%] z-[-1]"
      >
        <motion.div
          animate={{ 
            rotate: [-2, 4, -1, 3, -3, 5, 0, -4, 2, -2], 
            skewX: [-1, 2, -2, 1, -1, 2, -1, 1, -2, 0],
            y: [0, -10, 5, -15, 0, -5, 10, -8, 2, 0]
          }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
        >
        <div className="relative w-40 h-48">
          <div className="absolute w-32 h-32 rounded-full left-4 top-0 z-10" style={clayStyle('#4ade80', 'rgba(255,255,255,0.6)', 'rgba(0,100,0,0.4)')}></div>
          <div className="absolute w-24 h-24 rounded-full left-16 top-10 z-20" style={clayStyle('#22c55e', 'rgba(255,255,255,0.5)', 'rgba(0,80,0,0.5)')}></div>
          <div className="absolute w-28 h-28 rounded-full left-[-10px] top-12 z-20" style={clayStyle('#16a34a', 'rgba(255,255,255,0.4)', 'rgba(0,60,0,0.6)')}></div>
          <div className="absolute w-8 h-24 rounded-2xl left-[40%] bottom-0 z-0" style={clayStyle('#9a3412', 'rgba(255,255,255,0.3)', 'rgba(50,10,0,0.8)')}></div>
          <DynamicShadow animationDelay={0} />
        </div>
        </motion.div>
      </motion.div>

      {/* 3D Cloud - Right Top */}
      <motion.div 
        style={{ y: yDownSlow, x: xLeft, willChange: "transform" }}
        className="absolute top-[10vh] right-[10%] z-[-1]"
      >
        <motion.div
          animate={{ 
            y: [0, -15, 10, -20, 5, -10, 15, -5, 0, -15], 
            x: [0, -30, -10, -40, -5, -25, -15, -35, 0, -20],
            scale: [1, 1.05, 0.95, 1.1, 0.9, 1.02, 0.98, 1.08, 0.96, 1]
          }}
          transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
        >
        <div className="relative w-64 h-32 opacity-95 drop-shadow-2xl">
          <div className="absolute w-24 h-24 rounded-full left-4 bottom-2 z-10" style={clayStyle('#ffffff', 'rgba(255,255,255,1)', 'rgba(150,180,220,0.5)')}></div>
          <div className="absolute w-32 h-32 rounded-full left-16 bottom-6 z-20" style={clayStyle('#ffffff', 'rgba(255,255,255,1)', 'rgba(150,180,220,0.6)')}></div>
          <div className="absolute w-28 h-28 rounded-full left-32 bottom-2 z-10" style={clayStyle('#f8fafc', 'rgba(255,255,255,1)', 'rgba(150,180,220,0.5)')}></div>
          <div className="absolute w-48 h-16 rounded-full left-8 bottom-2 z-30" style={clayStyle('#ffffff', 'rgba(255,255,255,1)', 'rgba(150,180,220,0.3)')}></div>
          <DynamicShadow animationDelay={2} />
        </div>
        </motion.div>
      </motion.div>

      {/* 3D Car - Right Bottom */}
      <motion.div 
        style={{ y: yUpFast, x: xLeft, willChange: "transform" }}
        className="absolute top-[70vh] right-[5%] z-[-1]"
      >
        <motion.div
          animate={{ 
            y: [0, -8, 2, -5, 6, -10, 4, -3, 8, 0], 
            rotate: [-1, 2, -2, 3, -1, -3, 2, -2, 1, -1] 
          }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
        <div className="relative w-48 h-24">
          <div className="absolute w-24 h-14 rounded-t-3xl left-12 top-0 z-10" style={clayStyle('#f87171', 'rgba(255,255,255,0.6)', 'rgba(120,0,0,0.6)')}>
             <div className="absolute w-8 h-8 bg-blue-100 rounded-tl-xl left-2 top-2 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.2)] border-[3px] border-red-400"></div>
             <div className="absolute w-8 h-8 bg-blue-100 rounded-tr-xl right-2 top-2 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.2)] border-[3px] border-red-400"></div>
          </div>
          <div className="absolute w-48 h-14 rounded-2xl left-0 top-8 z-20" style={clayStyle('#ef4444', 'rgba(255,255,255,0.5)', 'rgba(100,0,0,0.7)')}>
            <div className="absolute w-4 h-4 rounded-full bg-yellow-300 right-2 top-4 shadow-[0_0_15px_rgba(255,255,0,0.8)]"></div>
          </div>
          <motion.div animate={{ rotate: [0, 360, 720, 1080, 1440, 1800, 2160, 2520, 2880, 3240] }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} className="absolute w-12 h-12 rounded-full bg-gray-800 left-4 bottom-[-10px] z-30 flex items-center justify-center border-4 border-gray-600 shadow-[inset_0_0_12px_black,0_5px_10px_rgba(0,0,0,0.3)]">
             <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          </motion.div>
          <motion.div animate={{ rotate: [0, 360, 720, 1080, 1440, 1800, 2160, 2520, 2880, 3240] }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} className="absolute w-12 h-12 rounded-full bg-gray-800 right-4 bottom-[-10px] z-30 flex items-center justify-center border-4 border-gray-600 shadow-[inset_0_0_12px_black,0_5px_10px_rgba(0,0,0,0.3)]">
             <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          </motion.div>
          {/* Knalpot asap kompleks */}
          <motion.div 
            animate={{ 
              opacity: [0, 0.8, 0, 0.9, 0, 0.6, 0, 0.9, 0, 0.7], 
              x: [-10, -40, -20, -50, -15, -35, -25, -45, -10, -30], 
              y: [0, -30, -10, -40, -15, -25, -5, -35, -20, -10], 
              scale: [0.5, 2, 0.8, 2.5, 1, 1.8, 0.6, 2.2, 1.2, 1.5] 
            }} 
            transition={{ repeat: Infinity, duration: 5 }} 
            className="absolute w-6 h-6 rounded-full bg-gray-300 left-[-20px] bottom-2 opacity-50 blur-md z-0"
          ></motion.div>
          <DynamicShadow animationDelay={1} />
        </div>
        </motion.div>
      </motion.div>
    </>
  );

  const renderProfileAssets = () => (
    <>
      {/* 3D Coin/Medal */}
      <motion.div 
        style={{ y: yUpFast, rotate: yDownSlow, willChange: "transform" }}
        className="absolute top-[30vh] left-[10%] z-[-1]"
      >
        <motion.div
          animate={{ 
            y: [0, -30, 10, -40, 20, -20, 5, -35, 15, -10], 
            scale: [1, 1.1, 0.9, 1.15, 0.85, 1.05, 0.95, 1.12, 0.88, 1] 
          }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        >
        <div className="relative w-32 h-32">
          <div className="absolute w-full h-full rounded-full z-10 flex justify-center items-center font-black text-6xl text-yellow-600 shadow-[2px_10px_20px_rgba(0,0,0,0.2)]" style={clayStyle('#facc15', 'rgba(255,255,255,0.9)', 'rgba(150,100,0,0.7)')}>
            ★
          </div>
          <div className="absolute w-[80%] h-[80%] left-[10%] top-[10%] rounded-full z-20 shadow-[inset_4px_4px_12px_rgba(255,255,255,0.7),inset_-4px_-4px_12px_rgba(0,0,0,0.3)] border-2 border-yellow-300"></div>
          <DynamicShadow animationDelay={0.5} />
        </div>
        </motion.div>
      </motion.div>
      
      {/* 3D Trophy */}
      <motion.div 
        style={{ y: yUpSlow, x: xRight, willChange: "transform" }}
        className="absolute top-[50vh] right-[10%] z-[-1]"
      >
        <motion.div
          animate={{ 
            rotateZ: [-5, 8, -3, 6, -6, 4, -4, 7, -2, 5],
            y: [0, -15, 5, -20, 10, -10, 15, -5, 8, 0]
          }}
          transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
        >
         <div className="relative w-40 h-48 drop-shadow-2xl">
            <div className="absolute w-24 h-24 rounded-b-full left-8 top-0 z-20" style={clayStyle('#fbbf24', 'rgba(255,255,255,0.8)', 'rgba(150,100,0,0.6)')}></div>
            <div className="absolute w-32 h-4 rounded-full left-4 top-0 z-30" style={clayStyle('#f59e0b', 'rgba(255,255,255,0.9)', 'rgba(150,100,0,0.6)')}></div>
            <div className="absolute w-6 h-16 left-[42%] top-20 z-10" style={clayStyle('#d97706', 'rgba(255,255,255,0.5)', 'rgba(100,50,0,0.7)')}></div>
            <div className="absolute w-24 h-8 rounded-t-2xl left-8 bottom-0 z-0" style={clayStyle('#b45309', 'rgba(255,255,255,0.4)', 'rgba(80,30,0,0.9)')}></div>
            <DynamicShadow animationDelay={1.5} />
         </div>
         </motion.div>
      </motion.div>
    </>
  );

  const renderLaporanAssets = () => (
    <>
      {/* 3D Megaphone */}
      <motion.div 
        style={{ y: yUpFast, x: xLeft, willChange: "transform" }}
        className="absolute top-[20vh] right-[10%] z-[-1]"
      >
        <motion.div
          animate={{ 
            rotateZ: [0, -15, 5, 12, -8, 10, -5, 15, -10, 0], 
            scale: [1, 1.15, 0.95, 1.1, 0.9, 1.2, 0.85, 1.12, 0.98, 1] 
          }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        >
        <div className="relative w-40 h-40 drop-shadow-xl">
           <div className="absolute w-24 h-32 rounded-l-[4rem] left-0 top-4 z-20" style={clayStyle('#ef4444', 'rgba(255,255,255,0.7)', 'rgba(120,0,0,0.7)')}></div>
           <div className="absolute w-20 h-16 left-20 top-12 z-10" style={clayStyle('#f87171', 'rgba(255,255,255,0.6)', 'rgba(100,0,0,0.5)')}></div>
           <div className="absolute w-6 h-16 rounded-b-xl left-[4.5rem] top-[6.5rem] z-0" style={clayStyle('#374151', 'rgba(255,255,255,0.4)', 'rgba(0,0,0,0.9)')}></div>
           <motion.div 
             animate={{ opacity: [0, 1, 0.2, 0.8, 0, 1, 0.3, 0.9, 0, 1], x: [-10, -40, -15, -35, -5, -45, -20, -30, -10, -50], scale: [0.5, 2, 0.8, 1.5, 0.6, 2.2, 1, 1.8, 0.7, 2.5] }} 
             transition={{ repeat: Infinity, duration: 4 }} 
             className="absolute text-red-400 text-4xl left-[-40px] top-12 font-black z-30 drop-shadow-md"
           >))</motion.div>
           <DynamicShadow animationDelay={2} />
        </div>
        </motion.div>
      </motion.div>

      {/* 3D Map Pin */}
      <motion.div 
        style={{ y: yUpSlow, rotate: yDownSlow, willChange: "transform" }}
        className="absolute top-[60vh] left-[8%] z-[-1]"
      >
        <motion.div
          animate={{ 
            y: [0, -40, 10, -25, 15, -35, 5, -30, 20, -10],
            rotate: [-5, 5, -2, 4, -6, 3, -4, 6, -3, 2]
          }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        >
        <div className="relative w-32 h-40">
          <div className="absolute w-24 h-24 rounded-full left-4 top-0 z-20 flex justify-center items-center drop-shadow-lg" style={clayStyle('#3b82f6', 'rgba(255,255,255,0.8)', 'rgba(0,0,120,0.7)')}>
            <div className="w-8 h-8 bg-white rounded-full shadow-[inset_2px_2px_6px_rgba(0,0,0,0.3)]"></div>
          </div>
          <div className="absolute w-0 h-0 border-l-[30px] border-r-[30px] border-t-[50px] border-l-transparent border-r-transparent border-t-blue-500 left-9 top-20 z-10 drop-shadow-md"></div>
          <DynamicShadow animationDelay={0} />
        </div>
        </motion.div>
      </motion.div>
    </>
  );

  const renderHistoryAssets = () => (
    <>
      {/* 3D Clock */}
      <motion.div 
        style={{ y: yUpSlow, x: xRight, willChange: "transform" }}
        className="absolute top-[30vh] left-[5%] z-[-1]"
      >
        <motion.div
          animate={{ y: [0, -15, 10, -20, 5, -10, 15, -5, 8, 0] }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
        >
        <div className="relative w-40 h-40 drop-shadow-2xl">
          <div className="absolute w-32 h-32 rounded-full left-4 top-4 z-10 flex justify-center items-center" style={clayStyle('#f3f4f6', 'rgba(255,255,255,1)', 'rgba(150,150,150,0.6)')}>
             <div className="absolute w-24 h-24 rounded-full shadow-[inset_6px_6px_12px_rgba(0,0,0,0.15),inset_-6px_-6px_12px_rgba(255,255,255,1)] z-20 flex justify-center items-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full z-40 shadow-md"></div>
                <motion.div animate={{ rotate: [0, 360, 720, 1080, 1440, 1800, 2160, 2520, 2880, 3240] }} transition={{ repeat: Infinity, duration: 120, ease: "linear" }} className="absolute w-[4px] h-10 bg-blue-500 origin-bottom rounded-t-full bottom-1/2 z-30 shadow-sm"></motion.div>
                <motion.div animate={{ rotate: [0, 360, 720, 1080, 1440, 1800, 2160, 2520, 2880, 3240] }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} className="absolute w-[3px] h-12 bg-red-500 origin-bottom rounded-t-full bottom-1/2 z-30 shadow-sm"></motion.div>
             </div>
          </div>
          <div className="absolute w-36 h-36 rounded-full left-2 top-2 z-0" style={clayStyle('#3b82f6', 'rgba(255,255,255,0.6)', 'rgba(0,0,100,0.6)')}></div>
          <DynamicShadow animationDelay={1} />
        </div>
        </motion.div>
      </motion.div>
      
      {/* 3D Checklist/Paper */}
      <motion.div 
        style={{ y: yDownSlow, rotate: rotateSway, willChange: "transform" }}
        className="absolute top-[50vh] right-[8%] z-[-1]"
      >
        <motion.div
          animate={{ 
            y: [0, -25, 15, -15, 20, -10, 5, -20, 10, -5], 
            rotate: [-5, 8, -4, 7, -3, 6, -2, 5, -6, 4] 
          }}
          transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
        >
        <div className="relative w-32 h-40 drop-shadow-xl" style={clayStyle('#ffffff', 'rgba(255,255,255,1)', 'rgba(150,150,180,0.5)')}>
           <div className="absolute w-full h-8 bg-blue-500 rounded-t-md top-0 left-0 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)]"></div>
           <div className="absolute w-[70%] h-2 bg-gray-300 rounded-full top-12 left-4 shadow-inner"></div>
           <div className="absolute w-[80%] h-2 bg-gray-300 rounded-full top-16 left-4 shadow-inner"></div>
           <div className="absolute w-[50%] h-2 bg-gray-300 rounded-full top-20 left-4 shadow-inner"></div>
           <div className="absolute w-[70%] h-2 bg-gray-300 rounded-full top-28 left-4 shadow-inner"></div>
           <div className="absolute w-[40%] h-2 bg-gray-300 rounded-full top-32 left-4 shadow-inner"></div>
           
           <motion.div 
             animate={{ scale: [1.2, 0.9, 1.1, 0.95, 1, 1.05, 0.98, 1.02, 1, 1.1], opacity: [0, 1, 0.8, 1, 0.9, 1, 0.8, 1, 0.9, 1] }} 
             transition={{ repeat: Infinity, duration: 8 }} 
             className="absolute w-16 h-8 border-[3px] border-green-500 text-green-600 font-black text-xs flex justify-center items-center rounded-sm transform rotate-[-20deg] bottom-4 right-2 shadow-[2px_2px_4px_rgba(0,100,0,0.2)] bg-green-50"
           >
             SELESAI
           </motion.div>
           <DynamicShadow animationDelay={0.5} />
        </div>
        </motion.div>
      </motion.div>
    </>
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {pathname === "/" && renderFeedAssets()}
      {pathname === "/profile" && renderProfileAssets()}
      {pathname === "/laporan" && renderLaporanAssets()}
      {pathname === "/history" && renderHistoryAssets()}
      {/* If it's another page like /berita or /admin, we can show a mix or fallback */}
      {(!["/", "/profile", "/laporan", "/history"].includes(pathname)) && renderFeedAssets()}
    </div>
  );
}
