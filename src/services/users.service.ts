import type { IUser } from '../interfaces/features.interface';
import type { IUpdateUserRequestBody } from '../interfaces/services.interface';
import client from './client.service';

export const updateProfile = async (body: IUpdateUserRequestBody) => {
  try {
    const response = await client.patch<IUser>(`/users/update-profile`, body);
    return response.data;
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message ?? JSON.stringify(err));
  }
};
