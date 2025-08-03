import type { IUserVote } from '../interfaces/features.interface';
import type {
  IVoteQuoteRequestBody,
  IVoteResponseData,
} from '../interfaces/services.interface';
import client from './client.service';

export const getUserVote = async (): Promise<IVoteResponseData> => {
  try {
    const response = await client.get<IVoteResponseData>('votes/user-vote');
    return response.data;
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message ?? JSON.stringify(err));
  }
};

export const voteQuote = async (
  body: IVoteQuoteRequestBody,
): Promise<IUserVote> => {
  try {
    const response = await client.post<IVoteResponseData>('/votes', body);
    return response.data;
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message ?? JSON.stringify(err));
  }
};
