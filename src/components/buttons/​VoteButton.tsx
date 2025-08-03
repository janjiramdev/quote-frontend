import { Heart } from 'lucide-react';

interface IVoteButtonProps {
  isVoted: boolean;
  onClick: () => void;
}

export default function VoteButton({ isVoted, onClick }: IVoteButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-md transition ${
        isVoted
          ? 'bg-red-100 hover:bg-red-200'
          : 'bg-gray-100 hover:bg-gray-200'
      }`}
      title={isVoted ? 'Unvote' : 'Vote'}
    >
      <Heart
        size={16}
        className={isVoted ? 'text-red-500' : 'text-gray-400'}
        fill={isVoted ? 'currentColor' : 'none'}
      />
    </button>
  );
}
