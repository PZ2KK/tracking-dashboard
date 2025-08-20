import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BsFillBoxFill } from "react-icons/bs";
import SearchAndFilter from "./SearchAndFilter";

export default function Header({ onSearch, onFilter, onSort }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const containerRef = useRef(null);
  const [query, setQuery] = useState("");
  const firstRunRef = useRef(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  let username = user?.username || user?.name;
  if (!username) {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        username = parsed?.username || parsed?.name;
      }
    } catch {
      // ignore
    }
  }
  if (!username) username = "User";

  // Hide dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // Debounce search on query change
  useEffect(() => {
    if (firstRunRef.current) {
      firstRunRef.current = false;
      return;
    }
    const id = setTimeout(() => {
      onSearch?.(query || "");
    }, 400);
    return () => clearTimeout(id);
  }, [query]);

  return (
    <header ref={containerRef} className="bg-white shadow px-6 py-3 mb-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl"><BsFillBoxFill /></span>
          <h2 className="hidden md:block md:text-lg font-semibold">Tracking Dashboard</h2>
        </div>

        {/* Search bar */}
        <div className="relative flex-1 max-w-xl">
          <input
            type="text"
            placeholder="Search by name or ID..."
            className="w-full text-xs md:text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowFilters(true)}
            onKeyDown={(e) => {
              // Enter is not required since we debounce on change; prevent form submissions
              if (e.key === 'Enter') e.preventDefault();
            }}
            onBlur={() => {
              // Delay to allow clicks inside dropdown
              setTimeout(() => {
                if (!containerRef.current) return;
                if (!containerRef.current.contains(document.activeElement)) {
                  setShowFilters(false);
                }
              }, 0);
            }}
          />

          {showFilters && (
            <div className="absolute z-20 mt-2 w-full bg-white rounded-md shadow-lg p-3 border  border-gray-300">
              <SearchAndFilter embedded onSearch={onSearch} onFilter={onFilter} onSort={onSort} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700 hidden md:block">Signed in as <span className="font-bold text-gray-800">{username}</span></span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-3 py-1.5 rounded-md cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
