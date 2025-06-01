import { createSlice } from "@reduxjs/toolkit"
import { RequestStatus } from "@/common/types"

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "dark" as ThemeMode,
    status: 'idle'as RequestStatus
  },
  selectors: {
    selectThemeMode: (state) => state.themeMode,
    selectStatusLoader: (state) => state.status,
  },
  reducers: (create) => ({
    changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
      state.themeMode = action.payload.themeMode
    }),
    changeStatusLoaderAC: create.reducer<{ status: RequestStatus }>((state, action) => {
      state.status = action.payload.status
    }),
  }),


})

export const { selectThemeMode,selectStatusLoader } = appSlice.selectors
export const { changeThemeModeAC,changeStatusLoaderAC } = appSlice.actions
export const appReducer = appSlice.reducer

export type ThemeMode = "dark" | "light"
