export interface IUser {
  _id: string;
  username: string;
  displayName: string;
}

export interface ICreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface IQuote {
  _id: string;
  content: string;
  totalVotes: number;
}

export interface IUserVote {
  _id: string;
  userId: string;
  quoteId: IQuote;
  createdAt: string;
  updatedAt: string;
}
