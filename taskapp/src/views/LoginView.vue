<template>
  <div class="login-wrap">
    <h2>Login</h2>
    <form @submit.prevent="onSubmit" class="form">
      <input required v-model="username" placeholder="Usuario" class="input" />
      <input required v-model="password" type="password" placeholder="Contraseña" class="input" />
      <button :disabled="status==='loading'" class="btn">Entrar</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useDispatch, useSelector } from "../store/vueRedux";
import { loginThunk } from "../store/slices/authSlice";

const username = ref("");
const password = ref("");
const router = useRouter();
const dispatch = useDispatch();

const status = useSelector((s) => s.auth.status);
const error  = useSelector((s) => s.auth.error);

const onSubmit = async () => {
  await dispatch(loginThunk({ username: username.value, password: password.value }));
  if (!error.value) router.push({ name: "tasks" });
};


watch(() => localStorage.getItem("access"), (v) => {
  if (v) router.replace({ name: "tasks" });
});
</script>

<style scoped>
.login-wrap{
  max-width: 420px;
  margin: 72px auto;
  padding: 24px 24px 16px;
  text-align: center;           
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 24px rgba(0,0,0,.10);
}

.input{
  width: 80%;
  margin: 10px 0;
  padding: 12px;
  border: 1px solid #cfd8dc;
  border-radius: 10px;
  outline: none;
}
.input:focus{
  border-color: #5e35b1;        
  box-shadow: 0 0 0 3px rgba(94,53,177,.15);
}

.btn{
  width: 80%;
  padding: 12px;
  border: 0;
  border-radius: 10px;
  background: #5e35b1;          
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: filter .15s ease;
}
.btn:hover{ filter: brightness(0.95); }
.btn:disabled{ opacity: .6; cursor: not-allowed; }

.error{ color: #d32f2f; margin-top: 8px; }
</style>