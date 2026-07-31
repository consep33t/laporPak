import LaporanList from "../components/LaporanList";

const adminPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-clayBg py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl mx-auto shadow-clay rounded-[2.5rem] bg-clayPrimary p-8 md:p-12 transition-all duration-300 relative">
        <a href="/" className="absolute top-8 left-8 shadow-clay-btn active:shadow-clay-btn-active bg-white hover:bg-gray-50 text-gray-700 font-bold py-2 px-6 rounded-full transition-all duration-200">
          ⬅ Dashboard
        </a>
        <div className="mt-12">
          <LaporanList />
        </div>
      </div>
    </div>
  );
};
export default adminPage;
