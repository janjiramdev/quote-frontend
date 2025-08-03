import { useEffect, useState } from 'react';
import FailedAlert from '../components/alerts/FailedAlert';
import CancelButton from '../components/buttons/CancelButton';
import ConfirmButton from '../components/buttons/ConfirmButton';
import DefaultModal from '../components/modals/DefaultModal';
import EditProfileModal from '../components/modals/EditProfileModal';
import { useSession } from '../contexts/sessions/SessionContext';
import type { IUser } from '../interfaces/features.interface';
import type { IUpdateUserRequestBody } from '../interfaces/services.interface';
import { updateProfile } from '../services/users.service';

interface IEditProfileFeatureProps {
  data: IUser;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileFeature({
  data,
  isOpen,
  onClose,
}: IEditProfileFeatureProps) {
  const { setSessionUser } = useSession();

  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false);
  const [currentFormData, setCurrentFormData] =
    useState<IUpdateUserRequestBody>({
      displayName: '',
      password: '',
    });
  const [formData, setFormData] = useState<IUpdateUserRequestBody>({
    displayName: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleSubmit = async () => {
    setIsOpenConfirmModal(false);

    try {
      const prepareData: IUpdateUserRequestBody = {
        displayName: formData?.displayName?.trim(),
        password: formData?.password?.trim(),
      };

      const updateProfileBody: Partial<IUpdateUserRequestBody> = {};
      if (
        prepareData.displayName !== '' &&
        prepareData.displayName !== currentFormData.displayName
      ) {
        updateProfileBody.displayName = prepareData.displayName;
      }
      if (
        prepareData.password !== '' &&
        prepareData.password !== currentFormData.password
      )
        updateProfileBody.password = prepareData.password;

      const response = await updateProfile(updateProfileBody);
      setSessionUser({
        _id: response._id,
        username: response.username,
        displayName: response.displayName,
      });
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Update profile Failed',
      );
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCurrentFormData({
        password: '',
        displayName: data.displayName,
      });
      setFormData({
        password: '',
        displayName: data.displayName,
      });
    }
  }, [data, isOpen]);

  return (
    <>
      <EditProfileModal
        isOpen={isOpen}
        data={formData}
        onChange={setFormData}
        onSubmit={() => setIsOpenConfirmModal(true)}
        onClose={onClose}
      />

      {isOpenConfirmModal && (
        <DefaultModal
          title="Confirm"
          onClose={() => setIsOpenConfirmModal(false)}
        >
          <p>Are you sure you want to save these changes?</p>
          <div className="flex justify-end gap-2 mt-4">
            <CancelButton onClick={() => setIsOpenConfirmModal(false)}>
              Cancel
            </CancelButton>
            <ConfirmButton onClick={handleSubmit}>Confirm</ConfirmButton>
          </div>
        </DefaultModal>
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
