# Exam 6 - Issue Tracker State Engine (useReducer, custom Hook)

Run: `npm install` then `npm run dev`. Tests: `npm test` (uses Node's built-in test runner, no extra library).

## Completed requirements
- State shape `{ issues: [], filter: 'all', nextId: 1 }` and all five actions: `ADD_ISSUE`, `TOGGLE_ISSUE`, `DELETE_ISSUE`, `SET_FILTER`, `CLEAR_DONE` (`src/reducer.js`).
- Reducer is pure and immutable (spread copies, `map`, `filter`).
- Default branch returns the existing state.
- `usePersistentReducer` (`src/usePersistentReducer.js`) loads from localStorage once via a lazy initializer and saves in an effect whenever state changes.
- All, Open, and Done views with accurate counts.
- Three required reducer tests (add, toggle, clear completed) in `test/reducer.test.js`.

## Debugging cases
- **Direct mutation:** `state.issues.push(...)` or `issue.done = true` changes the existing objects, so React can see "same state" and skip updates. Fix: return a new state object and new issue objects only where changes occur.
- **Mismatched action shape:** the reducer reads `action.payload.title` but dispatch sent `action.title`. Fix: dispatch `{ type, payload: { title } }` everywhere.
- **Default returns undefined:** state becomes `undefined` and the app crashes. Fix: `default: return state;`.

## Known limitations
- Blank titles are ignored by the reducer.
- Persisted data is not validated; corrupted localStorage falls back to the initial state only when it fails to parse.

## Test steps
1. Add several issues, toggle some, and check All/Open/Done counts.
2. Clear done removes completed issues. Delete removes one issue.
3. Reload the page: the state is restored.
4. Run `npm test`: three tests pass.
