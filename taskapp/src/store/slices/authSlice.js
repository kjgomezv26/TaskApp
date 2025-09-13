import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../api/http.js";

export const loginThunk = createAsyncThunk("auth/login", async ({ username, password }) => {
  const { data } = await http.post("/auth/token/", { username, password });
  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);
  localStorage.setItem("username", username);   
  return { username, access: data.access, refresh: data.refresh };
});

const slice = createSlice({
  name: "auth",
  initialState: {
    user: localStorage.getItem("access")
      ? { username: localStorage.getItem("username") || null }   
      : null,
    access: localStorage.getItem("access"),
    refresh: localStorage.getItem("refresh"),
    status: "idle",
    error: null,
  },
  reducers: {
    logout(s){
      s.user = null; s.access = null; s.refresh = null;
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("username");       
    },
  },
  extraReducers: (b) => {
    b.addCase(loginThunk.pending,(s)=>{ s.status="loading"; s.error=null; })
     .addCase(loginThunk.fulfilled,(s,a)=>{
       s.status="succeeded";
       s.user = { username: a.payload.username }; 
       s.access = a.payload.access;
       s.refresh = a.payload.refresh;
     })
     .addCase(loginThunk.rejected,(s,a)=>{ s.status="failed"; s.error=a.error.message || "Credenciales inválidas"; });
  },
});

export const { logout } = slice.actions;
export default slice.reducer;
