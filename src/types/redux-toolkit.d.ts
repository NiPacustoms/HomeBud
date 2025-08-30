declare module '@reduxjs/toolkit' {
  export interface PayloadAction<P = void, T extends string = string, M = never, E = never> {
    payload: P
    type: T
    meta?: M
    error?: E
  }

  export interface SliceCaseReducers<State> {
    [K: string]: (state: State, action: PayloadAction<any>) => State | void
  }

  export interface Slice<State = any, CaseReducers extends SliceCaseReducers<State> = SliceCaseReducers<State>, Name extends string = string> {
    name: Name
    reducer: any
    actions: any
    caseReducers: CaseReducers
    getInitialState: () => State
  }

  export interface CreateSliceOptions<State, CaseReducers extends SliceCaseReducers<State>, Name extends string = string> {
    name: Name
    initialState: State
    reducers: CaseReducers
    extraReducers?: any
  }

  export function createSlice<State, CaseReducers extends SliceCaseReducers<State>, Name extends string = string>(
    options: CreateSliceOptions<State, CaseReducers, Name>
  ): Slice<State, CaseReducers, Name>

  export function createAsyncThunk<Returned, ThunkArg = void>(
    typePrefix: string,
    payloadCreator: (arg: ThunkArg, thunkAPI: any) => Promise<Returned> | Returned
  ): any

  export function configureStore(options: any): any
}
