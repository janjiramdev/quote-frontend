import type { IUser } from '../interfaces/features.interface';
import type {
  ISignUpRequestBody,
  ISignInServiceRequestBody,
  ISignInServiceResponseData,
} from '../interfaces/services.interface';
import client from './client.service';

export const signIn = async (
  body: ISignInServiceRequestBody,
): Promise<ISignInServiceResponseData> => {
  try {
    const response = await client.post<ISignInServiceResponseData>(
      '/auth/signin',
      body,
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message ?? JSON.stringify(err));
  }
};

export const signUp = async (body: ISignUpRequestBody) => {
  try {
    const response = await client.post<IUser>('/auth/signup', body);
    return response.data;
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message ?? JSON.stringify(err));
  }
};
