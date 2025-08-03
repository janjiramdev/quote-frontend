import { useEffect, useState } from 'react';
import FailedAlert from '../components/alerts/FailedAlert';
import VoteButton from '../components/buttons/​VoteButton';
import Table from '../components/Table';
import type { IQuote } from '../interfaces/features.interface';
import type { IVoteResponseData } from '../interfaces/services.interface';
import { getUserVote, voteQuote } from '../services/vote.service';

const columns = [
  { key: 'content', label: 'Content' },
  { key: 'totalVotes', label: 'Total Votes', width: '200px' },
  { key: 'actions', label: 'ACTIONS', width: '150px' },
] as const;

export default function UserVote() {
  const [quotes, setQuotes] = useState<IQuote[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleVoteQuote = async (quoteId: string) => {
    try {
      await voteQuote({ quoteId });
      setQuotes([]);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Vote Quote Failed',
      );
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response: IVoteResponseData = await getUserVote();
        if (response?.quoteId) setQuotes([response.quoteId]);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Search User Vote Failed',
        );
      }
    };
    fetch();
  }, []);

  return (
    <div>
      <Table
        columns={columns}
        rows={quotes}
        rowKey="_id"
        renderActions={(row) => {
          return (
            <div className="flex justify-center">
              <VoteButton
                isVoted={quotes.length > 0}
                onClick={() => handleVoteQuote(row._id)}
              />
            </div>
          );
        }}
      />

      {errorMessage && (
        <FailedAlert
          message={errorMessage}
          onClose={() => setErrorMessage('')}
        />
      )}
    </div>
  );
}
