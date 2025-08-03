import { useEffect, useState } from 'react';
import FailedAlert from '../components/alerts/FailedAlert';
import VoteButton from '../components/buttons/​VoteButton';
import Table from '../components/Table';
import type { IQuote } from '../interfaces/features.interface';
import type { IVoteResponseData } from '../interfaces/services.interface';
import { searchAllQuotes } from '../services/quotes.service';
import { getUserVote, voteQuote } from '../services/vote.service';

const columns = [
  { key: 'content', label: 'Content' },
  { key: 'totalVotes', label: 'Total Votes', width: '100px' },
  { key: 'actions', label: 'ACTIONS', width: '150px' },
] as const;

export default function AllQuotes() {
  const [quotes, setQuotes] = useState<IQuote[]>([]);
  const [userVotedQuoteId, setUserVotedQuoteId] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleVoteQuote = async (quoteId: string) => {
    try {
      await voteQuote({ quoteId });
      fetchAllQuotes();
      fetchUserVoted();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Vote Quote Failed',
      );
    }
  };

  const fetchAllQuotes = async () => {
    try {
      setQuotes(await searchAllQuotes());
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Search All Quote Failed',
      );
    }
  };

  const fetchUserVoted = async () => {
    try {
      const response: IVoteResponseData = await getUserVote();
      if (response?.quoteId?._id) setUserVotedQuoteId(response?.quoteId?._id);
      else setUserVotedQuoteId('');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Search User Voted Failed',
      );
    }
  };

  useEffect(() => {
    fetchAllQuotes();
    fetchUserVoted();
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
                isVoted={userVotedQuoteId === row._id}
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
