import type { IUserVote } from '../interfaces/features.interface';
import type { IVoteQuoteRequestBody } from '../interfaces/services.interface';
import client from './client.service';

export const getUserVote = async () => {
  try {
    const response = await client.get<IUserVote>('votes/user-vote');
    return response.data;
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message ?? JSON.stringify(err));
  }
};

export const voteQuote = async (body: IVoteQuoteRequestBody) => {
  try {
    const response = await client.post('/votes', body);
    return response.data;
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message ?? JSON.stringify(err));
  }
};
