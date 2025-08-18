import { FixedSizeList as List } from "react-window";
import TrackingItem from "./TrackingItem";

export default function TrackingList({ items }) {
  const Row = ({ index, style }) => (
    <div  style={style}>
      <TrackingItem item={items[index]} />
    </div>
  );

  return (
    <List
      height={540}
      itemCount={items.length}
      itemSize={180}
      width="100%"
    >
      {Row}
    </List>
  );
}
