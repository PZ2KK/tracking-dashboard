const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'delayed':
      return 'bg-yellow-100 text-yellow-800';
    case 'canceled':
      return 'bg-red-100 text-red-800';
    case 'intransit':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function TrackingItem({ item }) {
  const statusColor = getStatusColor(item.status);

  return (
    <div className="flex bg-white shadow rounded-lg p-4 mr-2">
      {/* Left Box */}
      <div className="flex-1">
        <p className="font-semibold">ID: {item.id}</p>
        <p className="text-lg font-medium">Item: {item.name}</p>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Start:</span> {item.startDate || "-"}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">End:</span> {item.endDate || "-"}
          </p>
          <p className="text-blue-600 font-bold">
            <span className="font-medium text-gray-600">Cost:</span> ${item.cost}
          </p>
        </div>
      </div>

      {/* Right Box */}
      <div className="flex flex-col items-end justify-between pl-4 ">
        <span className={`${statusColor} text-xs font-medium px-2.5 py-0.5 rounded-full mb-2`}>
          {item.status}
        </span>
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">{item.votes} votes</span>
          </div>
        </div>
      </div>
    </div>
  );
}