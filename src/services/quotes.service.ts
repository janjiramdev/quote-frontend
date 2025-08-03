import type {
  IPaginatedResponse,
  ICreateQuoteRequestBody,
  IQuoteResponseData,
  ISearchQuotesRequestParams,
} from '../interfaces/services.interface';
import client from './client.service';

export const searchAllQuotes = async (
  params: ISearchQuotesRequestParams,
): Promise<IPaginatedResponse<IQuoteResponseData>> => {
  try {
    const { page, limit } = params;

    const response = await client.get<IPaginatedResponse<IQuoteResponseData>>(
      '/quotes/search',
      {
        params: {
          page,
          limit,
        },
      },
    );

    return response.data;
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message ?? JSON.stringify(err));
  }
};

export const searchUserQuotes = async (
  params: ISearchQuotesRequestParams,
): Promise<IPaginatedResponse<IQuoteResponseData>> => {
  try {
    const { page, limit } = params;

    const response = await client.get<IPaginatedResponse<IQuoteResponseData>>(
      '/quotes/search-user-quotes',
      {
        params: {
          page,
          limit,
        },
      },
    );

    return response.data;
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message ?? JSON.stringify(err));
  }
};

export const createQuote = async (
  body: ICreateQuoteRequestBody,
): Promise<IQuoteResponseData> => {
  try {
    const response = await client.post<IQuoteResponseData>('/quotes', body);
    return response.data;
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message ?? JSON.stringify(err));
  }
};

export const deleteQuote = async (id: string): Promise<IQuoteResponseData> => {
  try {
    const response = await client.delete<IQuoteResponseData>(`/quotes/${id}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message ?? JSON.stringify(err));
  }
};
