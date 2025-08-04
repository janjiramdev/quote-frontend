import { useState } from 'react';
import type { IUpdateUserRequestBody } from '../../interfaces/services.interface';
import CancelButton from '../buttons/CancelButton';
import ConfirmButton from '../buttons/ConfirmButton';
import ShowPasswordToggleButton from '../buttons/PasswordToggleButton';
import TextField from '../inputs/TextField';
import DefaultModal from './DefaultModal';

interface IEditProfileModalProps {
  isOpen: boolean;
  data: IUpdateUserRequestBody;
  onChange: (value: IUpdateUserRequestBody) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export default function EditProfileModal({
  isOpen,
  data,
  onChange,
  onSubmit,
  onClose,
}: IEditProfileModalProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <>
      {isOpen ? (
        <DefaultModal title="Edit Profile" onClose={onClose}>
          <div className="grid gap-2 mb-4 text-black">
            <label className="text-sm">Displayname</label>
            <TextField
              value={data.displayName}
              onChange={(e) =>
                onChange({ ...data, displayName: e.target.value })
              }
            />
          </div>
          <label className="text-sm">Password</label>
          <div className="relative">
            <TextField
              type={showPassword ? 'text' : 'password'}
              value={data.password}
              onChange={(e) => onChange({ ...data, password: e.target.value })}
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            />

            <ShowPasswordToggleButton
              isShow={showPassword}
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <CancelButton onClick={onClose}>Cancel</CancelButton>
            <ConfirmButton onClick={onSubmit}>Confirm</ConfirmButton>
          </div>
        </DefaultModal>
      ) : undefined}
    </>
  );
}
