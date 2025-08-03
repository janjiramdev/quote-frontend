import type { IQuote, IUserVote } from './features.interface';

export interface ISignInServiceRequestBody {
  username: string;
  password: string;
}

export interface ISignInServiceResponseData {
  accessToken: string;
}

export interface ISignUpRequestBody {
  username: string;
  displayName: string;
  password: string;
}

export interface IUpdateUserRequestBody {
  displayName?: string;
  password?: string;
}

export interface ICreateQuoteRequestBody {
  content: string;
}

export interface IQuoteResponseData extends IQuote {
  createdAt: string;
  updatedAt: string;
}

export interface IVoteResponseData extends IUserVote {
  createdAt: string;
}

export interface IVoteQuoteRequestBody {
  quoteId: string;
}
