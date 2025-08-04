import { useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SessionContext } from './SessionContext';
import type {
  ISessionTokens,
  ISessionUser,
} from '../../interfaces/contexts.interface';
import { refreshToken as refreshTokenService } from '../../services/auth.service';
import { decodeJwt } from '../../utils/jwt.util';
import {
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '../../utils/cookie.util';

export default function SessionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const location = useLocation();

  const hasNavigatedToSignInRef = useRef(false);

  const [sessionAccessToken, setSessionAccessToken] = useState<
    string | undefined
  >(() => getAccessToken() ?? undefined);
  const [sessionRefreshToken, setSessionRefreshToken] = useState<
    string | undefined
  >(() => getRefreshToken() ?? undefined);
  const [sessionUser, setSessionUser] = useState<ISessionUser | undefined>(
    undefined,
  );

  const isAuthenticated = !!sessionAccessToken;

  const removeTokens = useCallback(() => {
    removeAccessToken();
    removeRefreshToken();
    setSessionAccessToken(undefined);
    setSessionRefreshToken(undefined);
    setSessionUser(undefined);
  }, []);

  const setTokens = useCallback(
    (input: ISessionTokens) => {
      const { accessToken, refreshToken } = input;
      const decodedAccessToken = decodeJwt(accessToken);

      if (decodedAccessToken) {
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setSessionAccessToken(accessToken);
        setSessionRefreshToken(refreshToken);
        setSessionUser({
          _id: decodedAccessToken.sub,
          username: decodedAccessToken.username,
          displayName: decodedAccessToken.displayName,
        });
      } else removeTokens();
    },
    [removeTokens],
  );

  const refreshTokens = useCallback(
    async (input: string) => {
      try {
        setTokens(await refreshTokenService({ refreshToken: input }));
      } catch {
        removeTokens();
        navigate('/login');
      }
    },
    [setTokens, removeTokens, navigate],
  );

  useEffect(() => {
    const accessDecoded = sessionAccessToken
      ? decodeJwt(sessionAccessToken)
      : undefined;
    const refreshDecoded = sessionRefreshToken
      ? decodeJwt(sessionRefreshToken)
      : undefined;

    const isAccessTokenValid =
      accessDecoded?.exp && accessDecoded.exp * 1000 > Date.now();
    const isRefreshTokenValid =
      refreshDecoded?.exp && refreshDecoded.exp * 1000 > Date.now();

    if (accessDecoded && isAccessTokenValid)
      setSessionUser({
        _id: accessDecoded.sub,
        username: accessDecoded.username,
        displayName: accessDecoded.displayName,
      });
    else if (
      !isAccessTokenValid &&
      sessionRefreshToken &&
      refreshDecoded &&
      isRefreshTokenValid
    )
      refreshTokens(sessionRefreshToken);
    else {
      removeTokens();
      if (location.pathname !== '/signin' && !hasNavigatedToSignInRef.current) {
        hasNavigatedToSignInRef.current = true;
        navigate('/signup');
      }
    }
  }, [
    sessionAccessToken,
    sessionRefreshToken,
    refreshTokens,
    removeTokens,
    navigate,
    location,
  ]);

  return (
    <SessionContext.Provider
      value={{
        isAuthenticated,
        sessionUser,
        setTokens,
        removeTokens,
        setSessionUser,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
