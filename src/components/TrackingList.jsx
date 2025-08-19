import { useEffect, useRef, useState } from "react";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import TrackingItem from "./TrackingItem";

export default function TrackingList({ items, hasMore, loadMoreItems, isLoading }) {
  const PLACEHOLDER_COUNT = 3;
  const showEndRow = !hasMore && items.length > 0;
  const itemCount = hasMore
    ? items.length + PLACEHOLDER_COUNT
    : (showEndRow ? items.length + 1 : items.length);

  const isItemLoaded = index => !hasMore || index < items.length;

  // Prevent auto-loading before user scrolls
  const hasUserScrolledRef = useRef(false);
  const handleScroll = ({ scrollOffset }) => {
    if (scrollOffset > 0 && !hasUserScrolledRef.current) {
      hasUserScrolledRef.current = true;
    }
  };

  const gatedLoadMore = (...args) => {
    if (!hasUserScrolledRef.current) {
      // Do not auto-fetch next page until user interacts
      return Promise.resolve();
    }
    return loadMoreItems(...args);
  };

  const Row = ({ index, style }) => {
    if (!isItemLoaded(index)) {
      return (
        <div style={style} className="pr-6">
          <div className="animate-pulse bg-white shadow rounded-lg p-4">
            <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
            <div className="h-5 bg-gray-200 rounded w-48 mb-4" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-40" />
              <div className="h-3 bg-gray-200 rounded w-36" />
              <div className="h-4 bg-gray-200 rounded w-28" />
            </div>
          </div>
        </div>
      );
    }
    if (!hasMore && showEndRow && index === items.length) {
      return (
        <div style={style} className="flex items-center justify-center text-gray-500">
          no more items
        </div>
      );
    }
    return (
      <div style={style}>
        <TrackingItem item={items[index]} />
      </div>
    );
  };

  // Make the list fill available viewport height
  const containerRef = useRef(null);
  const [listHeight, setListHeight] = useState(540);

  useEffect(() => {
    const recompute = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const available = window.innerHeight - rect.top - 16; // 16px bottom padding margin
      setListHeight(Math.max(200, Math.floor(available)));
    };
    recompute();
    window.addEventListener('resize', recompute);
    window.addEventListener('scroll', recompute, { passive: true });
    return () => {
      window.removeEventListener('resize', recompute);
      window.removeEventListener('scroll', recompute);
    };
  }, []);

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={gatedLoadMore}
      threshold={0}
      minimumBatchSize={1}
    >
      {({ onItemsRendered, ref }) => (
        <div ref={containerRef} style={{ overflowAnchor: 'none' }}>
          <List
            height={listHeight} 
            itemCount={itemCount}
            itemSize={180}
            width="100%"
            overscanCount={1}
            onScroll={handleScroll}
            onItemsRendered={onItemsRendered}
            ref={ref}
          >
            {Row}
          </List>
        </div>
      )}
    </InfiniteLoader>
  );
}
