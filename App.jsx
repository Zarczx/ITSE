import { useState } from 'react';
import { initialState, issueReducer } from './reducer.js';
import { usePersistentReducer } from './usePersistentReducer.js';

const FILTERS = ['all', 'open', 'done'];

export default function App() {
  const [state, dispatch] = usePersistentReducer(issueReducer, initialState, 'issue-tracker-state');
  const [title, setTitle] = useState('');

  const counts = {
    all: state.issues.length,
    open: state.issues.filter((i) => !i.done).length,
    done: state.issues.filter((i) => i.done).length
  };
  const visible = state.issues.filter(
    (i) => state.filter === 'all' || (state.filter === 'open' ? !i.done : i.done)
  );

  const handleAdd = (e) => {
    e.preventDefault();
    dispatch({ type: 'ADD_ISSUE', payload: { title } });
    setTitle('');
  };

  return (
    <main>
      <h1>Issue Tracker</h1>
      <form className="card row" onSubmit={handleAdd}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New issue title" aria-label="Issue title" />
        <button type="submit" disabled={!title.trim()}>Add issue</button>
      </form>
      <section className="card">
        <div className="row">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={state.filter === f ? 'active' : 'secondary'}
              onClick={() => dispatch({ type: 'SET_FILTER', payload: { filter: f } })}
            >
              {f[0].toUpperCase() + f.slice(1)} ({counts[f]})
            </button>
          ))}
          <button className="secondary" onClick={() => dispatch({ type: 'CLEAR_DONE' })} disabled={counts.done === 0}>
            Clear done
          </button>
        </div>
        {visible.length === 0 ? (
          <p className="muted">No issues in this view.</p>
        ) : (
          <ul className="plain">
            {visible.map((i) => (
              <li key={i.id}>
                <label className="inline">
                  <input
                    type="checkbox" checked={i.done}
                    onChange={() => dispatch({ type: 'TOGGLE_ISSUE', payload: { id: i.id } })}
                  />
                  <span style={{ textDecoration: i.done ? 'line-through' : 'none' }}>#{i.id} {i.title}</span>
                </label>
                <button className="secondary" onClick={() => dispatch({ type: 'DELETE_ISSUE', payload: { id: i.id } })}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
