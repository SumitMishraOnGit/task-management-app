const FloatingActionButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-rose-600 hover:bg-rose-700 text-white w-14 h-14 rounded-full flex items-center justify-center text-4xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-neutral-900 z-50"
      aria-label="Add New Task"
    >
      +
    </button>
  );
};

export default FloatingActionButton;