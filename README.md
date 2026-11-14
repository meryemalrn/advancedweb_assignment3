# Meryem Betül Abdulrahman, 2300009906

A complete Vite + React + TypeScript project. Nothing to copy or generate.

```
npm install
npm run dev       # open the address it prints
npm run build     # type check and build; must pass when you hand in
```

Needs Node.js 20.19 or newer (22 or 24 also work).

- `src/taskReducer.ts`: the reducer. You change it: the state becomes `{ tasks, filter }`
  and it gets two new actions (see the handout).
- `src/App.tsx`: keeps the state with `useReducer` and passes it down as props.
- `src/filter.ts`: the file you fill in.

Zip the whole folder without `node_modules` when you hand in.

## Bonus 1: Undo
The state is now `{ tasks: Task[]; filter: Filter; past: Task[][] }`, where `past` is a
stack of earlier task lists. Every action that changes the tasks (`add`, `advance`,
`remove`, `clearDone`) goes through a small helper, `withTasks`, which pushes the old
list onto `past` before replacing it. The `undo` action pops the last list from `past`
back into `tasks` and does nothing when `past` is empty. `setFilter` does not touch
`past`, so changing the filter is not undoable, and the Undo button is disabled while
`past` is empty.


## Bonus 2: Tests
Run with 'npm test'.

```
 RUN  v5.1.0 

 ✓ src/filter.test.ts (6 tests) 3ms
 ✓ src/taskReducer.test.ts (14 tests) 4ms

 Test Files  2 passed (2)
      Tests  20 passed (20)
   Start at  16:09:06
   Duration  234ms (import 52%, transform 38%, worker 6%, tests 4%)
```

## Bonus 3: Explain your reducer
1. Why a reducer must be pure, and what breaks if it mutates the old state

A pure reducer only reads state and action and returns a new state; it changes nothing outside itself.
React compares the old and the new state by reference. If the reducer mutates the old object and returns the same object, React sees no change and does not re-render, so the screen does not update.
In this project mutation would also break Undo: past keeps references to the earlier task lists, so mutating a list would silently change the history too.

2. Why the caller creates the id and the reducer does not

crypto.randomUUID() returns a different value on every call, so a reducer that calls it is not pure: the same state and action would give different results.
In development, StrictMode may call the reducer twice to detect impure code; an id created inside the reducer would be different each time.
When the caller passes the id in the action, the reducer is predictable and easy to test (the tests use fixed ids such as 'a' and 'x').

3. Why the filtered list and the counts are derived, with one bug that storing them would cause

filterTasks(state.tasks, state.filter) and countByFilter(state.tasks) are computed during every render, so they can never disagree with state.tasks.
If they were stored in state, every action would have to update them as well.
Example bug: remove deletes a task from tasks but forgets to update the stored counts, so the button still shows Done (2) although only one done task is left.

4. One thing that became easier or harder with the filter in the reducer state

Easier: all state lives in one object, so one dispatch handles every change and the filter can be tested without React (the setFilter test).
Harder: every case must copy the state with { ...state, ... }, and changing the state shape from an array to an object broke App.tsx until every use was fixed.

## Bonus 4: Git repository
https://github.com/meryemalrn/advancedweb_assignment3
