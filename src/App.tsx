// Assignment 3: change the state shape, add actions, add a filter bar (see the handout).
import { useReducer } from 'react'
import type { Dispatch } from 'react'
import { taskReducer, initialState, type Task, type Action } from './taskReducer'
import { FILTERS, filterTasks, countByFilter, type Filter } from './filter'
import TaskRow from './TaskRow'

const LABELS: Record<Filter, string> = {
  all: 'All',
  todo: 'To do',
  'in-progress': 'In progress',
  done: 'Done',
}

function AddForm({ dispatch }: { dispatch: Dispatch<Action> }) {
  function addTask(formData: FormData) {
    const title = String(formData.get('title') ?? '').trim()
    if (title) dispatch({ type: 'add', id: crypto.randomUUID(), title })
  }
  return (
    <form action={addTask}>
      <input name="title" placeholder="New task" />
      <button type="submit">Add</button>
    </form>
  )
}

type FilterBarProps = {
  filter: Filter
  counts: Record<Filter, number>
  dispatch: Dispatch<Action>
}

function FilterBar({ filter, counts, dispatch }: FilterBarProps) {
  return (
    <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => dispatch({ type: 'setFilter', filter: f })}
          aria-pressed={f === filter}
          style={{
            fontWeight: f === filter ? 'bold' : 'normal',
            background: f === filter ? '#1a58a5' : 'white',
            color: f === filter ? 'white' : 'black',
           }}
        >
          {LABELS[f]} ({counts[f]})
        </button>
      ))}
      <button onClick={() => dispatch({ type: 'clearDone' })}>Clear done</button>
    </div>
  )
}

function TaskList({ tasks, dispatch }: { tasks: Task[]; dispatch: Dispatch<Action> }) {
  if (tasks.length === 0) return <p>No tasks here.</p>
  return (
    <ul>
      {tasks.map((t) => (
        <TaskRow
          key={t.id}
          task={t}
          onNext={() => dispatch({ type: 'advance', id: t.id })}
          onDelete={() => dispatch({ type: 'remove', id: t.id })}
        />
      ))}
    </ul>
  )
}

export default function App() {
  const [state, dispatch] = useReducer(taskReducer, initialState)
  const visibleTasks = filterTasks(state.tasks, state.filter)
  const counts = countByFilter(state.tasks)
  return (
    <main>
      <h1>Task Manager</h1>
      <AddForm dispatch={dispatch} />
      <FilterBar filter={state.filter} counts={counts} dispatch={dispatch} />
      <TaskList tasks={visibleTasks} dispatch={dispatch} />
    </main>
  )
}