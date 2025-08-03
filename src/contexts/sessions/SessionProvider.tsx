import { useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SessionContext } from './SessionContext';
import type {
  ISessionTokens,
  ISessionUser,
} from '../../interfaces/contexts.interface';
import { decodeJwt } from '../../utils/jwt.util';
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from '../../utils/cookie.util';

export default function SessionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const location = useLocation();

  const hasNavigatedToSignInRef = useRef(false);

  const [sessionAccessToken, setSessionAccessToken] = useState<
    string | undefined
  >(() => getAccessToken() ?? undefined);
  const [sessionUser, setSessionUser] = useState<ISessionUser | undefined>(
    undefined,
  );

  const isAuthenticated = !!sessionAccessToken;

  const removeTokens = useCallback(() => {
    removeAccessToken();
    setSessionAccessToken(undefined);
    setSessionUser(undefined);
  }, []);

  const setTokens = useCallback(
    (input: ISessionTokens) => {
      const { accessToken } = input;
      const decodedAccessToken = decodeJwt(accessToken);

      if (decodedAccessToken) {
        setAccessToken(accessToken);
        setSessionAccessToken(accessToken);
        setSessionUser({
          id: decodedAccessToken.sub,
          username: decodedAccessToken.username,
          displayName: decodedAccessToken.displayName,
        });
      } else removeTokens();
    },
    [removeTokens],
  );

  useEffect(() => {
    const accessDecoded = sessionAccessToken
      ? decodeJwt(sessionAccessToken)
      : undefined;
    const isAccessTokenValid =
      accessDecoded?.exp && accessDecoded.exp * 1000 > Date.now();

    if (accessDecoded && isAccessTokenValid)
      setSessionUser({
        id: accessDecoded.sub,
        username: accessDecoded.username,
        displayName: accessDecoded.displayName,
      });
    else {
      removeTokens();
      if (location.pathname !== '/signin' && !hasNavigatedToSignInRef.current) {
        hasNavigatedToSignInRef.current = true;
        navigate('/signup');
      }
    }
  }, [sessionAccessToken, removeTokens, navigate, location]);

  return (
    <SessionContext.Provider
      value={{
        isAuthenticated,
        sessionUser,
        setTokens,
        removeTokens,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
