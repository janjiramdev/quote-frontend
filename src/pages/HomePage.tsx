import { useState } from 'react';
import ConfirmButton from '../components/buttons/ConfirmButton';
import TableViewButton from '../components/buttons/TableViewButton';
import AllQuotes from '../features/AllQuotes';
import YourQuotes from '../features/UserQuotes';
import YourVoted from '../features/UserVoted';

export default function HomePage() {
  const [tableView, setTableView] = useState<string>('All Quotes');
  const [isOpenUserQuotesModal, setIsOpenUserQuotesModal] =
    useState<boolean>(false);

  const openCreateModal = () => {
    if (tableView === 'Your Quotes') setIsOpenUserQuotesModal(true);
  };
  const closeCreateModal = () => {
    if (tableView === 'Your Quotes') setIsOpenUserQuotesModal(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div className="mb-6 flex gap-4">
          {['All Quotes', 'Your Quotes', 'Your Voted'].map((view) => (
            <TableViewButton
              key={view}
              nextView={view}
              currentView={tableView}
              onClick={setTableView}
            />
          ))}
        </div>

        {tableView === 'Your Quotes' && (
          <div>
            <ConfirmButton onClick={openCreateModal}>
              Create Quote
            </ConfirmButton>
          </div>
        )}
      </div>

      {tableView === 'All Quotes' && <AllQuotes />}

      {tableView === 'Your Quotes' && (
        <YourQuotes isOpen={isOpenUserQuotesModal} onClose={closeCreateModal} />
      )}

      {tableView === 'Your Voted' && <YourVoted />}
    </div>
  );
}
