import { useEffect, useState, useCallback } from "react";
import trackingApi from "../api/trackingApi";
import TrackingList from "../components/TrackingList";
import SearchAndFilter from "../components/SearchAndFilter";

export default function Dashboard() {
  const [trackings, setTrackings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    q: '',
    status: '',
    _sort: 'id',
    _order: 'asc',
    _page: 1,
    _limit: 10
  });
  const [totalCount, setTotalCount] = useState(0);

  const fetchTrackings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await trackingApi.getAll(searchParams);
      
      const total = res.headers['x-total-count'] || res.data.length;
      setTotalCount(Number(total));
      
      setTrackings(Array.isArray(res.data) ? res.data : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching trackings:", err);
      setError("Failed to load trackings. Please try again later.");
      setTrackings([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchTrackings();
  }, [fetchTrackings]);

  const handleSearch = (searchTerm) => {
    setSearchParams(prev => ({
      ...prev,
      q: searchTerm,
      _page: 1
    }));
  };

  const handleFilter = (status) => {
    setSearchParams(prev => ({
      ...prev,
      status,
      _page: 1
    }));
  };

  const handleSort = (sortBy, sortOrder) => {
    setSearchParams(prev => ({
      ...prev,
      _sort: sortBy,
      _order: sortOrder
    }));
  };

  const handlePageChange = (newPage) => {
    setSearchParams(prev => ({
      ...prev,
      _page: newPage
    }));
  };

  const totalPages = Math.ceil(totalCount / searchParams._limit);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">📦 Tracking Dashboard</h1>
        
        <SearchAndFilter 
          onSearch={handleSearch}
          onFilter={handleFilter}
          onSort={handleSort}
        />

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : trackings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No tracking items found.</div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {trackings.length} of {totalCount} items
            </div>
            <TrackingList items={trackings} />
            
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-md ${
                      searchParams._page === pageNum
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
