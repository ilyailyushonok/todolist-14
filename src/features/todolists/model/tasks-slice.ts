import { createTodolistTC, deleteTodolistTC } from "./todolists-slice"
import { createAppSlice } from "@/common/utils"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  selectors: {
    selectTasks: (state) => state,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
  },
  reducers: (create) => ({
    fetchTasksTC: create.asyncThunk(
      async (todolistId: string, thunkAPI) => {
        try {
          const res = await tasksApi.getTasks(todolistId)
          return { todolistId, tasks: res.data.items }
        } catch (error) {
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todolistId] = action.payload.tasks
        },
      },
    ),
    createTaskTC: create.asyncThunk(
      async (args: { todolistId: string; title: string }, thunkAPI) => {
        try {
          const res = await tasksApi.createTask(args)
          return res.data.data.item
        } catch (error) {
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todoListId].unshift(action.payload)
        },
      },
    ),
    deleteTaskTC: create.asyncThunk(
      async (args: { todolistId: string; taskId: string }, thunkAPI) => {
        try {
          await tasksApi.deleteTask(args)
          return args
        } catch (error) {
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const tasks = state[action.payload.todolistId]
          const index = tasks.findIndex((task) => task.id === action.payload.taskId)
          if (index !== -1) {
            tasks.splice(index, 1)
          }
        },
      },
    ),
    changeTaskStatusTC: create.asyncThunk(
      async (args: DomainTask, thunkAPI) => {
        try {
          const model: UpdateTaskModel = {
            status: args.status,
            description: args.description,
            title: args.title,
            priority: args.priority,
            startDate: args.startDate,
            deadline: args.deadline,
          }
          const res = await tasksApi.updateTask({ taskId:args.id,todolistId:args.todoListId, model })
          return res.data.data.item
        } catch (error) {
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const task = state[action.payload.todoListId].find((task) => task.id === action.payload.id)
          if (task) {
            task.status = action.payload.status
          }
        },
      },
    ),
    changeTaskTitleTC: create.asyncThunk(
      async (args: DomainTask, thunkAPI) => {
        try {
          const model: UpdateTaskModel = {
            status: args.status,
            description: args.description,
            title: args.title,
            priority: args.priority,
            startDate: args.startDate,
            deadline: args.deadline,
          }
          const res = await tasksApi.updateTask({ taskId:args.id,todolistId:args.todoListId, model })
          return res.data.data.item
        } catch (error) {
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const task = state[action.payload.todoListId].find((task) => task.id === action.payload.id)
          if (task) {
            task.title = action.payload.title
          }
        },
      },
    ),
  }),
})

export const { selectTasks } = tasksSlice.selectors
export const { deleteTaskTC, changeTaskStatusTC, changeTaskTitleTC, fetchTasksTC, createTaskTC } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer

export type TasksState = Record<string, DomainTask[]>
