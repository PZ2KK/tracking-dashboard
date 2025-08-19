import { useRef } from "react";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import TrackingItem from "./TrackingItem";

export default function TrackingList({ items, hasMore, loadMoreItems, isLoading }) {
  const itemCount = hasMore ? items.length + 1 : items.length;

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
        <div style={style} className="flex items-center justify-center text-gray-500">
          Loading...
        </div>
      );
    }
    return (
      <div style={style}>
        <TrackingItem item={items[index]} />
      </div>
    );
  };

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={gatedLoadMore}
      threshold={0}
      minimumBatchSize={1}
    >
      {({ onItemsRendered, ref }) => (
        <List
          height={540} 
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
      )}
    </InfiniteLoader>
  );
}
