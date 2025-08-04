import type { IQuote, IUserVote } from './features.interface';

export interface IPaginatedResponse<T> {
  items: T[];
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
}

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

export interface ISearchQuotesRequestParams {
  search?: string;
  sortBy: string;
  sortDirection: number;
  page: number;
  limit: number;
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
