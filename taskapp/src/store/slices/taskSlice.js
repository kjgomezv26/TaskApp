import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../api/http";


export const fetchTasks = createAsyncThunk("tasks/fetch", async () => {
  const { data } = await http.get("/tasks/");
  return data;
});


export const fetchTaskById = createAsyncThunk("tasks/fetchById", async (id) => {
  const { data } = await http.get(`/tasks/${id}/`);
  return data;
});


export const createTask = createAsyncThunk("tasks/create", async (payload) => {
  const { data } = await http.post("/tasks/", payload);
  return data; // tarea creada
});


export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, ...payload }) => {
    const { data } = await http.put(`/tasks/${id}/`, payload);
    return data; // tarea actualizada
  }
);


export const deleteTask = createAsyncThunk("tasks/delete", async (id) => {
  await http.delete(`/tasks/${id}/`);
  return id;
});

const slice = createSlice({
  name: "tasks",
  initialState: { items: [], current: null, status: "idle", error: null },
  reducers: { clearCurrent(s){ s.current = null; } },
  extraReducers: (b) => {
    b.addCase(fetchTasks.pending, (s) => { s.status = "loading"; })
     .addCase(fetchTasks.fulfilled, (s, a) => { s.status = "succeeded"; s.items = a.payload; })
     .addCase(fetchTasks.rejected, (s, a) => { s.status = "failed"; s.error = a.error.message; })

     .addCase(fetchTaskById.pending, (s) => { s.current = null; })
     .addCase(fetchTaskById.fulfilled, (s, a) => { s.current = a.payload; })

     .addCase(createTask.fulfilled, (s, a) => { s.items.unshift(a.payload); })

     .addCase(updateTask.fulfilled, (s, a) => {
        s.current = a.payload;
        const idx = s.items.findIndex(t => t.id === a.payload.id);
        if (idx >= 0) s.items[idx] = a.payload;
     })

     .addCase(deleteTask.fulfilled, (s, a) => {
        s.items = s.items.filter(t => t.id !== a.payload);
        if (s.current?.id === a.payload) s.current = null;
     });
  },

});

export const { clearCurrent } = slice.actions;
export default slice.reducer;
