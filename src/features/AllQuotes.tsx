import { useCallback, useEffect, useState } from 'react';
import FailedAlert from '../components/alerts/FailedAlert';
import VoteButton from '../components/buttons/​VoteButton';
import Table from '../components/Table';
import type { IQuote } from '../interfaces/features.interface';
import type {
  IPaginatedResponse,
  IQuoteResponseData,
  IVoteResponseData,
} from '../interfaces/services.interface';
import { searchAllQuotes } from '../services/quotes.service';
import { getUserVote, voteQuote } from '../services/vote.service';

const columns = [
  { key: 'content', label: 'Content' },
  { key: 'totalVotes', label: 'Total Votes', width: '100px' },
  { key: 'actions', label: 'ACTIONS', width: '150px' },
] as const;

export default function AllQuotes() {
  const [quotes, setQuotes] = useState<IQuote[]>([]);
  const [limit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userVoteQuoteId, setUserVoteQuoteId] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleVoteQuote = async (quoteId: string) => {
    try {
      await voteQuote({ quoteId });
      fetchAllQuotes();
      fetchUserVote();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Vote Quote Failed',
      );
    }
  };

  const fetchAllQuotes = useCallback(async () => {
    try {
      const response: IPaginatedResponse<IQuoteResponseData> =
        await searchAllQuotes({ page, limit });
      setQuotes(response.items);
      setTotalPages(response.totalPages);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Search All Quote Failed',
      );
    }
  }, [limit, page]);

  const fetchUserVote = async () => {
    try {
      const response: IVoteResponseData = await getUserVote();
      if (response?.quoteId?._id) setUserVoteQuoteId(response?.quoteId?._id);
      else setUserVoteQuoteId('');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Search User Vote Failed',
      );
    }
  };

  useEffect(() => {
    fetchAllQuotes();
    fetchUserVote();
  }, [fetchAllQuotes, page]);

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
                isVoted={userVoteQuoteId === row._id}
                onClick={() => handleVoteQuote(row._id)}
              />
            </div>
          );
        }}
        isPaginate={true}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
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
