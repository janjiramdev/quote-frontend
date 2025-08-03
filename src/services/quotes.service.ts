import type {
  ICreateQuoteRequestBody,
  IQuoteResponseData,
} from '../interfaces/services.interface';
import client from './client.service';

export const searchAllQuotes = async () => {
  try {
    const response = await client.get<IQuoteResponseData[]>('/quotes/search');
    return response.data;
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message ?? JSON.stringify(err));
  }
};

export const searchUserQuotes = async () => {
  try {
    const response = await client.get<IQuoteResponseData[]>(
      '/quotes/search-user-quotes',
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message ?? JSON.stringify(err));
  }
};

export const createQuote = async (body: ICreateQuoteRequestBody) => {
  try {
    const response = await client.post<IQuoteResponseData>('/quotes', body);
    return response.data;
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message ?? JSON.stringify(err));
  }
};

export const deleteQuote = async (id: string) => {
  try {
    const response = await client.delete<IQuoteResponseData>(`/quotes/${id}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message ?? JSON.stringify(err));
  }
};
