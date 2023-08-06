import { GetCurrentUserDocument, User } from '../generated';
import { fixtures } from './fixtures';

function currentUser(user: Partial<User> = {}) {
  return {
    request: {
      query: GetCurrentUserDocument
    },

    result: {
      data: {
        me: fixtures.user(user)
      },

      loading: false,
      errors: undefined
    }
  };
}

export const mocks = {
  currentUser
};
