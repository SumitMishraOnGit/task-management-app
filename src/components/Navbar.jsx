function Navbar() {
  return (
   <nav className="bg-neutral-900/60 backdrop-blur-lg border border-white/20 rounded-b-lg sticky top-0 z-50 shadow-md flex justify-between items-baseline w-full">
      <span className="py-2 pl-4 text-white" style={{ fontFamily: '"Jersey 15", cursive', fontSize: "35px" }}>
        AlTogether
      </span>
      <ul className="flex items-center justify-end px-3 gap-8 text-white">
        <li className="cursor-pointer">Home</li>
        <li className="cursor-pointer">Features</li>
        <li className="cursor-pointer">About</li>
        <li className="mr-4 cursor-pointer">Contact Us</li>
        <a href="#" className="bg-rose-600 p-2 px-5 rounded-md cursor-pointer hover:bg-rose-700">Get Started</a>
      </ul>
      
    </nav>
  );
}

export default Navbar;