import { useEffect, useReducer } from 'react';

function load(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function usePersistentReducer(reducer, initialState, key) {
  // Lazy initializer: localStorage is read once, on the first render only.
  const [state, dispatch] = useReducer(reducer, initialState, (initial) => load(key, initial));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* storage unavailable; ignore */
    }
  }, [key, state]);

  return [state, dispatch];
}
