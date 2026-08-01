"use client";

export default function BeritaPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full p-4 md:p-8">
      <div className="w-full max-w-4xl text-center">
        <div className="text-8xl mb-6">📰</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-clayBlue drop-shadow-sm mb-4">
          Berita Desa
        </h1>
        <p className="text-gray-500 font-medium text-lg md:text-xl max-w-2xl mx-auto">
          Portal informasi resmi desa. Fitur ini sedang dalam tahap pengembangan dan akan segera hadir dengan pembaruan terkini.
        </p>
        
        <div className="mt-12 bg-white/50 backdrop-blur-sm p-8 rounded-[2rem] shadow-clay border border-gray-100 max-w-md mx-auto">
          <div className="animate-pulse flex flex-col gap-4">
            <div className="h-32 bg-gray-200 rounded-xl w-full"></div>
            <div className="h-6 bg-gray-200 rounded-full w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded-full w-full"></div>
            <div className="h-4 bg-gray-200 rounded-full w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
