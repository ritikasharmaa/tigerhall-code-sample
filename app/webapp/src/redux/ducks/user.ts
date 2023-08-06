import decodeJwt from 'jwt-decode';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'redux/store';

// ------------------------------------
// Reducer
// ------------------------------------

type CustomerType = 'INDIVIDUAL' | 'TEAM' | 'ENTERPRISE';

interface Claims {
  iat: number | null;
  exp: number | null;
  sub: string | null;
  tenantId: null | string;
  organisationId: null | string;
  customerType: CustomerType | null;
  roles: string[];
}

export interface State {
  token: string | null;
  claims: Claims;
  isOnBoarding: boolean;
  user: {};
}

const initialState: State = {
  token: null,
  claims: {
    iat: null,
    exp: null,
    sub: null,
    tenantId: null,
    organisationId: null,
    customerType: null,
    roles: []
  },
  isOnBoarding: false,
  user: {}
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAccessToken: (
      state,
      action: PayloadAction<{ token: string | null; isOnBoarding?: boolean }>
    ) => {
      if (!action.payload.token) {
        return initialState;
      }

      return {
        ...state,
        ...action.payload,
        claims: decodeJwt(action.payload.token)
      };
    },
    setIsOnboardingStatus: (
      state,
      action: PayloadAction<{ isOnBoarding: boolean }>
    ) => ({
      ...state,
      ...action.payload
    }),

    logout: () => initialState
  }
});

export const { logout, setAccessToken, setIsOnboardingStatus } =
  userSlice.actions;

export default userSlice.reducer;

// ------------------------------------
// Custom selectors
// ------------------------------------
export const getAccessToken = (state: RootState) => state.user.token;
export const getOnboardingStatus = (state: RootState) =>
  state.user.isOnBoarding;
export const getCustomerType = (state: RootState) =>
  state.user.claims.customerType;

export const hasOrgAdminAccess = (state: RootState) => {
  if (!state.user.claims) {
    return false;
  }

  if (state.user.claims.roles.indexOf('admin') !== -1) {
    return true;
  }

  return state.user.claims.roles.indexOf('org_admin') !== -1;
};

export const getOrgIdFromToken = (state: RootState) =>
  state?.user?.claims?.organisationId || null;

export const getTokenIssuedAt = (state: RootState) => state.user.claims.iat;
