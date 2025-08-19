import { useEffect, useState, useCallback, useRef } from "react";
import trackingApi from "../api/trackingApi";
import TrackingList from "../components/TrackingList";
import Header from "../components/Header";

export default function Dashboard() {
  const [trackings, setTrackings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    q: '',
    status: '',
    _sort: 'id',
    _order: 'asc',
    _limit: 5
  });
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1); // kept in case it's used elsewhere, but offset-based loading will be primary
  const [totalCount, setTotalCount] = useState(0);
  const reqIdRef = useRef(0);

  const fetchTrackings = useCallback(async (params, isReset) => {
    const currentReqId = ++reqIdRef.current;
    setLoading(true);
    try {
      const res = await trackingApi.getAll(params);
      const incoming = Array.isArray(res.data) ? res.data : [];
      if (currentReqId !== reqIdRef.current) return; // stale

      setTrackings(prev => {
        if (isReset) {
          // when resetting, replace entirely
          // prefer API-provided total when available
          if (typeof res.total === 'number') setTotalCount(res.total);
          setHasMore((typeof res.total === 'number')
            ? (incoming.length + 0) < res.total
            : (incoming.length === params._limit)
          );
          return incoming;
        }
        // build a set of existing ids to avoid duplicates
        const existingIds = new Set(prev.map(it => String(it.id)));
        const uniqueAdds = incoming.filter(it => !existingIds.has(String(it.id)));
        // update hasMore: only true if we actually got new unique items and page seems full
        setHasMore(uniqueAdds.length > 0 && incoming.length === params._limit);
        return [...prev, ...uniqueAdds];
      });
      setError(null);
    } catch (err) {
      console.error("Error fetching trackings:", err);
      setError("Failed to load trackings. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [searchParams._limit]);

  useEffect(() => {
    pageRef.current = 1;
    const params = { ...searchParams, _page: 1, _start: 0 };
    const myReqId = ++reqIdRef.current;
    fetchTrackings(params, true);
    // Fetch total count for current filters
    (async () => {
      try {
        const total = await trackingApi.count({ q: params.q, status: params.status, _sort: params._sort, _order: params._order });
        if (myReqId === reqIdRef.current) setTotalCount(total);
      } catch (e) {
        // ignore count errors for now
      }
    })();
  }, [fetchTrackings, searchParams.q, searchParams.status, searchParams._sort, searchParams._order]);

  const handleSearch = (searchTerm) => {
    setSearchParams(prev => ({ ...prev, q: searchTerm }));
  };

  const handleFilter = (status) => {
    setSearchParams(prev => ({ ...prev, status }));
  };

  const handleSort = (sortBy, sortOrder) => {
    setSearchParams(prev => ({ ...prev, _sort: sortBy, _order: sortOrder }));
  };

  const loadMoreItems = useCallback(async () => {
    if (loading || !hasMore) return Promise.resolve();
    const offset = trackings.length; // use current count as _start
    const newParams = { ...searchParams, _start: offset, _limit: searchParams._limit };
    return fetchTrackings(newParams, false);
  }, [loading, hasMore, fetchTrackings, searchParams, trackings.length]);

  return (
    <div className="min-h-screen  bg-gray-100">
      <Header onSearch={handleSearch} onFilter={handleFilter} onSort={handleSort} />
      <div className="max-w-7xl mx-auto">
        

        <div className="mb-2 text-sm text-gray-600">Showing {trackings.length} of {totalCount} items</div>

        {error && <div className="p-4 text-red-500">{error}</div>}

        <TrackingList 
          items={trackings}
          hasMore={hasMore}
          loadMoreItems={loadMoreItems}
          isLoading={loading}
        />

        {loading && trackings.length > 0 && (
            <div className="p-8 text-center text-gray-500">Loading more...</div>
        )}

        {!loading && trackings.length === 0 && !error && (
          <div className="p-8 text-center text-gray-500">No tracking items found.</div>
        )}
      </div>
    </div>
  );
}
