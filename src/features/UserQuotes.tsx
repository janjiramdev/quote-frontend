import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import FailedAlert from '../components/alerts/FailedAlert';
import CancelButton from '../components/buttons/CancelButton';
import ConfirmButton from '../components/buttons/ConfirmButton';
import DeleteButton from '../components/buttons/DeleteButton';
import TextField from '../components/inputs/TextField';
import DefaultModal from '../components/modals/DefaultModal';
import Table from '../components/Table';
import type {
  ICreateModalProps,
  IQuote,
} from '../interfaces/features.interface';
import type {
  ICreateQuoteRequestBody,
  IPaginatedResponse,
  IQuoteResponseData,
} from '../interfaces/services.interface';
import {
  createQuote,
  deleteQuote,
  searchUserQuotes,
} from '../services/quotes.service';

const columns = [
  { key: 'content', label: 'Content' },
  { key: 'totalVotes', label: 'Total Votes', width: '100px' },
  { key: 'actions', label: 'ACTIONS', width: '150px' },
] as const;

export default function UserQuotes({ isOpen, onClose }: ICreateModalProps) {
  const [userQuotes, setUserQuotes] = useState<IQuote[]>([]);
  const [limit] = useState(1);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newQuote, setNewQuote] = useState<ICreateQuoteRequestBody>({
    content: '',
  });
  const [deleteQuoteId, setDeleteQuoteId] = useState<string | undefined>(
    undefined,
  );
  const [isOpenConfirmCreate, setIsOpenConfirmCreate] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const fetchUserQuotes = useCallback(async () => {
    try {
      const response: IPaginatedResponse<IQuoteResponseData> =
        await searchUserQuotes({ page, limit });
      setUserQuotes(response.items);
      setTotalPages(response.totalPages);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Search Quotes Failed',
      );
    }
  }, [limit, page]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewQuote((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateQuote = async () => {
    const content = newQuote.content.trim();

    if (!content) {
      setErrorMessage('please enter a valid content');
      return;
    }

    try {
      const payload: {
        content: string;
      } = { content };

      await createQuote(payload);
      fetchUserQuotes();

      setNewQuote({ content: '' });
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Create Quote Failed',
      );
    }
  };

  const handleConfirmCreate = async () => {
    setIsOpenConfirmCreate(false);
    await handleCreateQuote();
    fetchUserQuotes();
  };

  const handleCancelConfirmCreate = () => {
    setIsOpenConfirmCreate(false);
  };

  const handleDeleteQuote = async (id: string) => {
    try {
      await deleteQuote(id);
      fetchUserQuotes();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Delete Quote Failed',
      );
    }
  };

  useEffect(() => {
    fetchUserQuotes();
  }, [fetchUserQuotes, page]);

  return (
    <div>
      {isOpen && (
        <DefaultModal title="Create New Quote" onClose={onClose}>
          <div className="grid gap-2 mb-4">
            {errorMessage && (
              <FailedAlert
                message={errorMessage}
                onClose={() => setErrorMessage('')}
              />
            )}

            <label className="text-sm">Content</label>
            <TextField
              name="content"
              type="text"
              placeholder="Content"
              value={newQuote.content}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-2">
            <CancelButton onClick={onClose}>Cancel</CancelButton>
            <ConfirmButton onClick={() => setIsOpenConfirmCreate(true)}>
              Create
            </ConfirmButton>
          </div>
        </DefaultModal>
      )}

      <Table
        columns={columns}
        rows={userQuotes}
        rowKey="_id"
        renderActions={(row) => (
          <div className="flex justify-center gap-2">
            <DeleteButton onClick={() => setDeleteQuoteId(row._id)} />
          </div>
        )}
        isPaginate={true}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />

      {isOpenConfirmCreate && (
        <DefaultModal
          title="Confirm Create Quote"
          onClose={handleCancelConfirmCreate}
        >
          <p>Are you sure you want to create this quote?</p>
          <div className="flex justify-end gap-2 mt-4">
            <CancelButton onClick={handleCancelConfirmCreate}>
              Cancel
            </CancelButton>
            <ConfirmButton onClick={handleConfirmCreate}>Confirm</ConfirmButton>
          </div>
        </DefaultModal>
      )}

      {deleteQuoteId !== undefined && (
        <DefaultModal
          title="Delete Quote"
          onClose={() => setDeleteQuoteId(undefined)}
        >
          <p className="mb-4">
            Do you want to delete this quote{' '}
            <strong>
              {userQuotes.find((p) => p._id === deleteQuoteId)?.content}
            </strong>
            ?{' '}
          </p>

          <div className="flex justify-end gap-2">
            <CancelButton onClick={() => setDeleteQuoteId(undefined)}>
              Cancel
            </CancelButton>

            <ConfirmButton
              onClick={() => {
                handleDeleteQuote(deleteQuoteId);
                setDeleteQuoteId(undefined);
              }}
            >
              Confirm
            </ConfirmButton>
          </div>
        </DefaultModal>
      )}
    </div>
  );
}
