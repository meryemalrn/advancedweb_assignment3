import { describe, expect, it } from 'vitest'
import { countByFilter, filterTasks } from './filter'
import type { Task } from './taskReducer'

const tasks: Task[] = [
  { id: 'a', title: 'A', status: 'todo' },
  { id: 'b', title: 'B', status: 'in-progress' },
  { id: 'c', title: 'C', status: 'done' },
  { id: 'd', title: 'D', status: 'done' },
]

describe('filterTasks', () => {
  it('all returns every task', () => {
    expect(filterTasks(tasks, 'all')).toEqual(tasks)
  })

  it('returns only the tasks with the chosen status', () => {
    expect(filterTasks(tasks, 'done').map((t) => t.id)).toEqual(['c', 'd'])
    expect(filterTasks(tasks, 'todo').map((t) => t.id)).toEqual(['a'])
  })

  it('returns an empty list for an empty list', () => {
    expect(filterTasks([], 'in-progress')).toEqual([])
  })
})

describe('countByFilter', () => {
  it('counts every filter', () => {
    expect(countByFilter(tasks)).toEqual({ all: 4, todo: 1, 'in-progress': 1, done: 2 })
  })

  it('returns zeros for an empty list', () => {
    expect(countByFilter([])).toEqual({ all: 0, todo: 0, 'in-progress': 0, done: 0 })
  })

  it('counts are right after a delete', () => {
    const afterDelete = tasks.filter((t) => t.id !== 'c')
    expect(countByFilter(afterDelete)).toEqual({ all: 3, todo: 1, 'in-progress': 1, done: 1 })
  })
})