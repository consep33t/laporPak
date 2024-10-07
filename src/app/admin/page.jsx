import LaporanList from "../components/LaporanList";

const adminPage = () => {
  return (
    <div className="p-10">
      <a href="/" className="text-blue-500 font-semibold">
        Dashboard
      </a>
      <LaporanList />
    </div>
  );
};
export default adminPage;
