import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './projectSlice';

const loadState = () => {
  try {
    const savedState = localStorage.getItem('caseforge_redux_state');
    return savedState ? JSON.parse(savedState) : undefined;
  } catch {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    localStorage.setItem('caseforge_redux_state', JSON.stringify({
      project: state.project,
    }));
  } catch (err) {
    console.error('Could not save Redux state:', err);
  }
};

export const store = configureStore({
  reducer: {
    project: projectReducer,
  },
  preloadedState: loadState(),
});

store.subscribe(() => {
  saveState(store.getState());
});