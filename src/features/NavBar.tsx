import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CancelButton from '../components/buttons/CancelButton';
import ConfirmButton from '../components/buttons/ConfirmButton';
import DefaultModal from '../components/modals/DefaultModal';
import { useSession } from '../contexts/sessions/SessionContext';
import GetProfileFeature from './GetProfile';

export default function NavBar() {
  const navigate = useNavigate();

  const { sessionUser, removeTokens } = useSession();

  const [isOpenSignOutModal, setIsOpenSignOutModal] = useState<boolean>(false);

  const handleSignOut = () => {
    setIsOpenSignOutModal(false);
    removeTokens();
    navigate('/signin');
  };

  return (
    <>
      <header className="flex items-center justify-between bg-blue-500 text-white px-6 py-4 shadow-md">
        <div className="text-xl font-bold tracking-wide">QUOTE</div>

        <div className="flex items-center gap-4">
          <GetProfileFeature username={sessionUser?.displayName ?? 'Guest'} />
          <button
            onClick={() => setIsOpenSignOutModal(true)}
            className="rounded-lg bg-gray-500 px-4 py-2 text-sm font-semibold hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {isOpenSignOutModal && (
        <DefaultModal
          title="Confirm Sign Out"
          onClose={() => setIsOpenSignOutModal(false)}
        >
          <p>Are you sure you want to sign out?</p>
          <div className="flex justify-end gap-2 mt-4">
            <CancelButton onClick={() => setIsOpenSignOutModal(false)}>
              Cancel
            </CancelButton>
            <ConfirmButton onClick={handleSignOut}>Confirm</ConfirmButton>
          </div>
        </DefaultModal>
      )}
    </>
  );
}
