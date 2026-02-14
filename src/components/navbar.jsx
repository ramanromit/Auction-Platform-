export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-20 py-6 bg-[#111827] text-white">
      
      <div className="text-2xl font-bold">
        Bid<span className="text-[#DC2626]">Nest</span>
      </div>

      <div className="flex gap-8 items-center text-gray-300">
        <a href="#" className="hover:text-white transition">About</a>
        <a href="#" className="hover:text-white transition">Explore</a>
        <a href="#" className="hover:text-white transition">Contact</a>

        <button className="bg-[#DC2626] px-4 py-2 rounded-md hover:bg-red-600 transition">
          Login
        </button>
      </div>

    </nav>
  );
}
