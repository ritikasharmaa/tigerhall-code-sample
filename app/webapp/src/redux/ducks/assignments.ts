import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'redux/store';

interface State {
  newAssignmentIds: string[];
}

const initialState: State = {
  newAssignmentIds: []
};

const assignments = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    setNewAssignmentIds: (state, action: PayloadAction<string[]>) => {
      state.newAssignmentIds = action.payload;
    }
  }
});

export const getNewAssignmentIds = (state: RootState) =>
  state.assignments.newAssignmentIds;

export const { setNewAssignmentIds } = assignments.actions;

export default assignments.reducer;
