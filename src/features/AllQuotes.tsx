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

const sortOptions: string[] = [
  'Created Date New - Old',
  'Created Date Old - New',
  'Content A - z',
  'Content Z - a',
  'Total Votes High - Low',
  'Total Votes Low - High',
];

const sortValue: [string, number][] = [
  ['createdAt', -1],
  ['createdAt', 1],
  ['content', 1],
  ['content', -1],
  ['totalVotes', -1],
  ['totalVotes', 1],
];

export default function AllQuotes() {
  const [quotes, setQuotes] = useState<IQuote[]>([]);
  const [searchBy, setSearchBy] = useState<string>();
  const [sortBy, setSortBy] = useState<string>(sortOptions[0]);
  const [limit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [userVoteQuoteId, setUserVoteQuoteId] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const fetchAllQuotes = useCallback(async () => {
    try {
      const response: IPaginatedResponse<IQuoteResponseData> =
        await searchAllQuotes({
          search: searchBy,
          sortBy: sortValue[sortOptions.indexOf(sortBy)][0],
          sortDirection: sortValue[sortOptions.indexOf(sortBy)][1],
          page,
          limit,
        });
      setQuotes(response.items);
      setTotalPages(response.totalPages);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Search All Quote Failed',
      );
    }
  }, [searchBy, sortBy, page, limit]);

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

  useEffect(() => {
    fetchAllQuotes();
    fetchUserVote();
  }, [fetchAllQuotes, page]);

  return (
    <>
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
        isSearchAndSort={true}
        searchBy={searchBy}
        setSearchBy={setSearchBy}
        sortOptions={sortOptions}
        sortBy={sortBy}
        setSortBy={setSortBy}
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
    </>
  );
}
