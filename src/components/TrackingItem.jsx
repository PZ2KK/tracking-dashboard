import { useEffect, useMemo, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import trackingApi from "../api/trackingApi";

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
  const { user } = useAuth();
  const storageKey = useMemo(() => (user ? `voted:${user.id}:${item.id}` : null), [user, item.id]);
  const [hasVoted, setHasVoted] = useState(false);
  const [votesCount, setVotesCount] = useState(Number(item.votes || 0));
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setVotesCount(Number(item.votes || 0));
  }, [item.votes]);

  useEffect(() => {
    if (!storageKey) return;
    try {
      const v = localStorage.getItem(storageKey);
      setHasVoted(!!v);
    } catch {}
  }, [storageKey]);

  // allow interaction if user is logged in and not currently submitting
  const canInteract = !!user && !submitting;

  const handleVote = async () => {
    if (!user || submitting) return; // optionally prompt login
    setSubmitting(true);
    const prevCount = votesCount;
    const isUnvote = hasVoted;
    const nextCount = Math.max(0, isUnvote ? prevCount - 1 : prevCount + 1);
    try {
      // optimistic update
      setVotesCount(nextCount);
      await trackingApi.patchTracking(item.id, { votes: nextCount });
      if (storageKey) {
        if (isUnvote) localStorage.removeItem(storageKey);
        else localStorage.setItem(storageKey, "1");
      }
      setHasVoted(!isUnvote);
    } catch (e) {
      // revert
      setVotesCount(prevCount);
      console.error("Failed to toggle vote", e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex bg-white shadow rounded-lg p-4 mr-2">
      {/* Left Box */}
      <div className="flex-1">
        <p className="font-semibold">ID: {item.id}</p>
        <p className="text-lg font-medium">Name: {item.name}</p>
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
        
        <span className={`${statusColor} text-xs font-medium px-2.5 py-1 rounded-full mb-2`}>
        ● {item.status}
        </span>
        <div className="flex flex-col items-end space-y-2">
          <button
            type="button"
            onClick={handleVote}
            disabled={!canInteract}
            aria-pressed={hasVoted}
            className={`flex items-center space-x-2 rounded-full px-2 py-1 transition-colors ${
              canInteract
                ? hasVoted
                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                  : "bg-gray-100 hover:bg-gray-200 cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
            title={user ? (hasVoted ? "Remove vote" : "Upvote") : "Login to vote"}
          >
            <FaArrowUp className={hasVoted ? "text-emerald-600" : ""} />
            <span className="text-sm font-semibold text-gray-800">{votesCount} votes</span>
          </button>
        </div>
      </div>
    </div>
  );
}