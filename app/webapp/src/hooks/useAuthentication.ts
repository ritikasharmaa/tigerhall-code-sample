import * as React from 'react';

import { useAppDispatch, useAppSelector } from './redux';
import { getAccessToken, setAccessToken } from '../redux/ducks/user';

interface UseAuthenticationReturn {
  logout: () => void;
  login: (accessToken: string, isOnboarding?: boolean) => void;
  isAuthenticated: boolean;
}

export function useAuthentication(): UseAuthenticationReturn {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(getAccessToken);

  const logout = React.useCallback(() => {
    dispatch(
      setAccessToken({
        token: null
      })
    );
  }, [dispatch]);

  const login = React.useCallback(
    (accessToken: string, isOnboarding = false) => {
      dispatch(
        setAccessToken({
          token: accessToken,
          isOnBoarding: isOnboarding
        })
      );
    },
    [dispatch]
  );

  return {
    login,
    logout,
    isAuthenticated: isAuthenticated !== null
  };
}
