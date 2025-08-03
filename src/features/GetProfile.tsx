import { useState } from 'react';
import FailedAlert from '../components/alerts/FailedAlert';
import CancelButton from '../components/buttons/CancelButton';
import ConfirmButton from '../components/buttons/ConfirmButton';
import DefaultModal from '../components/modals/DefaultModal';
import { useSession } from '../contexts/sessions/SessionContext';
import EditProfileFeature from './EditProfile';

interface GetProfileFeatureProps {
  username: string;
}

export default function GetProfileFeature({
  username,
}: GetProfileFeatureProps) {
  const { sessionUser } = useSession();

  const [isOpenProfileModal, setIsOpenProfileModal] = useState<boolean>(false);
  const [isOpenEditProfileModal, setIsOpenEditProfileModal] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  return (
    <>
      <button
        onClick={() => setIsOpenProfileModal(true)}
        className="font-medium hover:text-black transition-colors"
      >
        {username}
      </button>

      {isOpenProfileModal && sessionUser && (
        <DefaultModal
          title="User Profile"
          onClose={() => setIsOpenProfileModal(false)}
        >
          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            <div className="text-right font-medium text-gray-600">
              Username:
            </div>
            <div className="text-left">{sessionUser.username}</div>

            <div className="text-right font-medium text-gray-600">
              Displayname:
            </div>
            <div className="text-left">{sessionUser.displayName}</div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <CancelButton onClick={() => setIsOpenProfileModal(false)}>
              Close
            </CancelButton>
            <ConfirmButton
              onClick={() => {
                setIsOpenProfileModal(false);
                setIsOpenEditProfileModal(true);
              }}
            >
              Edit
            </ConfirmButton>
          </div>
        </DefaultModal>
      )}

      {isOpenEditProfileModal && sessionUser && (
        <EditProfileFeature
          data={sessionUser}
          isOpen={isOpenEditProfileModal}
          onClose={() => setIsOpenEditProfileModal(false)}
        />
      )}

      {errorMessage && (
        <FailedAlert
          message={errorMessage}
          onClose={() => setErrorMessage('')}
        />
      )}
    </>
  );
}
