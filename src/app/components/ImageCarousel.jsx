"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function ImageCarousel({ images, altText = "Laporan Image" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!images || images.length === 0) return null;

  const isMulti = images.length > 1;

  const nextImage = (e) => {
    if (e) e.stopPropagation();
    if (!isMulti) return;
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setZoomLevel(1);
  };

  const prevImage = (e) => {
    if (e) e.stopPropagation();
    if (!isMulti) return;
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setZoomLevel(1);
  };

  const toggleFullscreen = (e) => {
    if (e) e.stopPropagation();
    setIsFullscreen(!isFullscreen);
    setZoomLevel(1);
  };

  const handleZoom = (e, direction) => {
    e.stopPropagation();
    if (direction === 'in') setZoomLevel(prev => Math.min(prev + 1, 4));
    if (direction === 'out') setZoomLevel(prev => Math.max(prev - 1, 1));
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <>
      {/* INLINE CAROUSEL */}
      <div 
        className="relative w-full h-64 sm:h-80 rounded-[2rem] overflow-hidden shadow-clay group bg-gray-200 cursor-pointer"
        onClick={toggleFullscreen}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={currentIndex}
            initial={isMulti ? { opacity: 0, x: 50 } : { opacity: 1 }}
            animate={{ opacity: 1, x: 0 }}
            exit={isMulti ? { opacity: 0, x: -50 } : { opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
            drag={isMulti ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, { offset, velocity }) => {
              if (!isMulti) return;
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                nextImage();
              } else if (swipe > swipeConfidenceThreshold) {
                prevImage();
              }
            }}
          >
            <Image
              src={images[currentIndex]}
              alt={`${altText} - Slide ${currentIndex + 1}`}
              fill
              className="object-cover pointer-events-none group-hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
        </AnimatePresence>

        {/* Hover Overlay Icon to Indicate Clickable */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity duration-300 pointer-events-none z-10">
           <div className="bg-white/80 p-3 rounded-full backdrop-blur-sm shadow-lg">
             <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
           </div>
        </div>

        {isMulti && (
          <>
            {/* Navigation Arrows */}
            <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={(e) => { e.stopPropagation(); prevImage(e); }}
                className="bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur-md shadow-lg transform hover:scale-110 transition-all z-20"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); nextImage(e); }}
                className="bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur-md shadow-lg transform hover:scale-110 transition-all z-20"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>

            {/* Image Counter Indicator */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-bold shadow-md z-20">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
              {images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'}`} 
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* FULLSCREEN LIGHTBOX */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center backdrop-blur-md"
            onClick={toggleFullscreen}
          >
            {/* Top Toolbar */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50 bg-gradient-to-b from-black/60 to-transparent">
              <div className="text-white font-bold text-lg">
                {isMulti ? `${currentIndex + 1} / ${images.length}` : 'Pratinjau Bukti'}
              </div>
              <div className="flex gap-4">
                <button onClick={(e) => handleZoom(e, 'out')} className="text-white hover:text-gray-300 p-2 bg-white/10 rounded-full backdrop-blur-md">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"></path></svg>
                </button>
                <button onClick={(e) => handleZoom(e, 'in')} className="text-white hover:text-gray-300 p-2 bg-white/10 rounded-full backdrop-blur-md">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                </button>
                <button onClick={toggleFullscreen} className="text-white hover:text-red-400 p-2 bg-white/10 rounded-full backdrop-blur-md ml-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            </div>

            {/* Main Image Area */}
            <div 
              className="relative w-full h-full flex items-center justify-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence initial={false}>
                <motion.div
                  key={currentIndex}
                  initial={isMulti ? { opacity: 0, x: 100 } : { opacity: 1 }}
                  animate={{ opacity: 1, x: 0, scale: zoomLevel }}
                  exit={isMulti ? { opacity: 0, x: -100 } : { opacity: 1 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="relative w-[90vw] h-[80vh] md:w-[80vw] md:h-[85vh] cursor-grab active:cursor-grabbing"
                  drag={zoomLevel > 1 ? true : (isMulti ? "x" : false)}
                  dragConstraints={zoomLevel > 1 ? undefined : { left: 0, right: 0 }}
                  onDragEnd={(e, { offset, velocity }) => {
                    if (zoomLevel > 1) return; // If zoomed in, drag is just panning, not swiping
                    if (!isMulti) return;
                    const swipe = swipePower(offset.x, velocity.x);
                    if (swipe < -swipeConfidenceThreshold) {
                      nextImage();
                    } else if (swipe > swipeConfidenceThreshold) {
                      prevImage();
                    }
                  }}
                >
                  <Image
                    src={images[currentIndex]}
                    alt={`${altText} - Fullscreen ${currentIndex + 1}`}
                    fill
                    className="object-contain pointer-events-none"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Left/Right Fullscreen Navigation */}
            {isMulti && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); prevImage(e); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/80 text-white rounded-full p-4 backdrop-blur-md shadow-lg transform hover:scale-110 transition-all z-50"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextImage(e); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/80 text-white rounded-full p-4 backdrop-blur-md shadow-lg transform hover:scale-110 transition-all z-50"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
