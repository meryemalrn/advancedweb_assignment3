import { describe, expect, it } from 'vitest'
import { initialState, taskReducer, type State, type Task } from './taskReducer'

const a: Task = { id: 'a', title: 'A', status: 'todo' }
const b: Task = { id: 'b', title: 'B', status: 'in-progress' }
const c: Task = { id: 'c', title: 'C', status: 'done' }
const state: State = { tasks: [a, b, c], filter: 'all', past: [] }

describe('taskReducer', () => {
  it('add appends a task with status todo', () => {
    const next = taskReducer(initialState, { type: 'add', id: 'x', title: 'X' })
    expect(next.tasks).toEqual([{ id: 'x', title: 'X', status: 'todo' }])
  })

  it('advance moves a task to the next status', () => {
    const next = taskReducer(state, { type: 'advance', id: 'a' })
    expect(next.tasks[0].status).toBe('in-progress')
  })

  it('advance three times returns to todo', () => {
    let s = state
    for (let i = 0; i < 3; i++) s = taskReducer(s, { type: 'advance', id: 'a' })
    expect(s.tasks[0].status).toBe('todo')
  })

  it('advance with an unknown id changes no task', () => {
    const next = taskReducer(state, { type: 'advance', id: 'nope' })
    expect(next.tasks).toEqual(state.tasks)
  })

  it('remove deletes the task', () => {
    const next = taskReducer(state, { type: 'remove', id: 'b' })
    expect(next.tasks).toEqual([a, c])
  })

  it('remove on an empty list keeps it empty', () => {
    const next = taskReducer(initialState, { type: 'remove', id: 'a' })
    expect(next.tasks).toEqual([])
  })

  it('setFilter stores the filter and keeps the tasks', () => {
    const next = taskReducer(state, { type: 'setFilter', filter: 'done' })
    expect(next.filter).toBe('done')
    expect(next.tasks).toBe(state.tasks)
  })

  it('clearDone removes done tasks and keeps the filter', () => {
    const filtered: State = { ...state, filter: 'todo' }
    const next = taskReducer(filtered, { type: 'clearDone' })
    expect(next.tasks).toEqual([a, b])
    expect(next.filter).toBe('todo')
  })

  it('clearDone with nothing done keeps every task', () => {
    const noDone: State = { ...state, tasks: [a, b] }
    const next = taskReducer(noDone, { type: 'clearDone' })
    expect(next.tasks).toEqual([a, b])
  })

  it('does not change the old state', () => {
    const before = structuredClone(state)
    taskReducer(state, { type: 'add', id: 'x', title: 'X' })
    taskReducer(state, { type: 'advance', id: 'a' })
    taskReducer(state, { type: 'remove', id: 'a' })
    taskReducer(state, { type: 'clearDone' })
    expect(state).toEqual(before)
  })
})

describe('undo', () => {
  it('does nothing when there is nothing to undo', () => {
    expect(taskReducer(initialState, { type: 'undo' })).toBe(initialState)
  })

  it('reverts the last change', () => {
    const added = taskReducer(state, { type: 'add', id: 'x', title: 'X' })
    const undone = taskReducer(added, { type: 'undo' })
    expect(undone.tasks).toEqual(state.tasks)
    expect(undone.past).toEqual([])
  })

  it('brings cleared tasks back after clearDone', () => {
    const cleared = taskReducer(state, { type: 'clearDone' })
    const undone = taskReducer(cleared, { type: 'undo' })
    expect(undone.tasks).toEqual([a, b, c])
  })

  it('does not undo a filter change', () => {
    const added = taskReducer(state, { type: 'add', id: 'x', title: 'X' })
    const filtered = taskReducer(added, { type: 'setFilter', filter: 'done' })
    const undone = taskReducer(filtered, { type: 'undo' })
    expect(undone.filter).toBe('done')
    expect(undone.tasks).toEqual(state.tasks)
  })
})