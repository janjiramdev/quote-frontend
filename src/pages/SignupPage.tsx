import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import FailedAlert from '../components/alerts/FailedAlert';
import SuccessAlert from '../components/alerts/SuccessAlert';
import ConfirmButton from '../components/buttons/ConfirmButton';
import ShowPasswordToggleButton from '../components/buttons/PasswordToggleButton';
import TextField from '../components/inputs/TextField';
import type { ISignUpRequestBody } from '../interfaces/services.interface';
import { signUp } from '../services/auth.service';

export default function SignUpPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ISignUpRequestBody>({
    username: '',
    displayName: '',
    password: '',
  });
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showFailed, setShowFailed] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowSuccess(false);
    setShowFailed(false);
    setErrorMessage('');

    try {
      await signUp({
        username: formData.username,
        displayName: formData.displayName,
        password: formData.password,
      });

      setShowSuccess(true);
      navigate('/signin');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Signup Failed');
      setShowFailed(true);
    } finally {
      setIsLoading(false);
    }
  };

  const onCloseFailed = () => {
    setErrorMessage('');
    setShowFailed(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl relative">
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30">
            <SuccessAlert message="Account created successfully!" />
          </div>
        )}

        {showFailed && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30">
            <FailedAlert message={errorMessage} onClose={onCloseFailed} />
          </div>
        )}

        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Create your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Username
            </label>
            <TextField
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Displayname
            </label>
            <TextField
              name="displayName"
              type="text"
              value={formData.displayName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <TextField
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              />
              <ShowPasswordToggleButton
                isShow={showPassword}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>

          <ConfirmButton type="submit" isLoading={isLoading}>
            Create Account
          </ConfirmButton>
        </form>
      </div>
    </div>
  );
}
