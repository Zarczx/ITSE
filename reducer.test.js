import test from 'node:test';
import assert from 'node:assert/strict';
import { issueReducer } from '../src/reducer.js';

test('ADD_ISSUE adds an open issue, increments nextId, and does not mutate', () => {
  const before = { issues: [], filter: 'all', nextId: 1 };
  const snapshot = JSON.stringify(before);
  const after = issueReducer(before, { type: 'ADD_ISSUE', payload: { title: 'Fix login' } });
  assert.deepEqual(after, {
    issues: [{ id: 1, title: 'Fix login', done: false }],
    filter: 'all',
    nextId: 2
  });
  assert.equal(JSON.stringify(before), snapshot);
});

test('TOGGLE_ISSUE flips done for the matching issue only', () => {
  const before = {
    issues: [{ id: 1, title: 'A', done: false }, { id: 2, title: 'B', done: false }],
    filter: 'all',
    nextId: 3
  };
  const after = issueReducer(before, { type: 'TOGGLE_ISSUE', payload: { id: 2 } });
  assert.equal(after.issues[0].done, false);
  assert.equal(after.issues[1].done, true);
  assert.equal(before.issues[1].done, false);
  assert.notEqual(after.issues[1], before.issues[1]);
});

test('CLEAR_DONE removes completed issues and unknown actions keep state', () => {
  const before = {
    issues: [{ id: 1, title: 'A', done: true }, { id: 2, title: 'B', done: false }],
    filter: 'all',
    nextId: 3
  };
  const after = issueReducer(before, { type: 'CLEAR_DONE' });
  assert.deepEqual(after.issues, [{ id: 2, title: 'B', done: false }]);
  assert.equal(issueReducer(before, { type: 'NOPE' }), before);
});
