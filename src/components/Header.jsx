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

  const triggerSearch = () => {
    onSearch?.(query || "");
  };

  return (
    <header ref={containerRef} className="bg-white shadow px-4 py-3 mb-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl"><BsFillBoxFill /></span>
          <h2 className="text-lg font-semibold">Tracking Dashboard</h2>
        </div>

        {/* Search bar */}
        <div className="relative flex-1 max-w-xl">
          <input
            type="text"
            placeholder="Search by name or ID..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowFilters(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                triggerSearch();
              }
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
          <button
            onClick={triggerSearch}
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md cursor-pointer"
          >
            Search
          </button>

          {showFilters && (
            <div className="absolute z-20 mt-2 w-full bg-white rounded-md shadow-lg p-3 border  border-gray-300">
              <SearchAndFilter embedded onSearch={onSearch} onFilter={onFilter} onSort={onSort} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">Signed in as <span className="font-medium">{username}</span></span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded-md cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
