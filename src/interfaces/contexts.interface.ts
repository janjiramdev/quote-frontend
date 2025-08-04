export interface ISessionTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ISessionUser {
  _id: string;
  username: string;
  displayName: string;
}
