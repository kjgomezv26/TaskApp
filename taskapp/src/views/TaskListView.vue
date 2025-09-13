<template>
  <div class="page">
    <header class="page-header">
      <h2>Bienvenido, <span class="username">{{ username }}</span></h2>
      <div class="actions">
        <router-link :to="{ name:'task-new' }" class="btn primary">+ Nueva</router-link>
        <button class="btn" @click="doLogout">Salir</button>
      </div>
    </header>

    <section v-if="status==='loading'" class="loading">Cargando...</section>

    <section v-else class="table-card">
      <table class="task-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Estado</th>
            <th>Vence</th>
            <th>Creada</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in tasks" :key="t.id">
            <td class="title">{{ t.title }}</td>
            <td>
              <span class="badge" :class="t.status">
                {{ t.status }}
              </span>
            </td>
            <td>{{ t.due_date || '-' }}</td>
            <td>{{ (t.created_at || '').slice(0,19).replace('T',' ') }}</td>
            <td class="row-actions">
              <router-link :to="{ name:'task-edit', params:{ id: t.id } }" class="link">Editar</router-link>
              <button class="link danger" @click="remove(t.id)">Eliminar</button>
            </td>
          </tr>
          <tr v-if="tasks.length===0">
            <td colspan="5" class="empty">Sin tareas</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useDispatch, useSelector } from "../store/vueRedux.js";
import { fetchTasks, deleteTask } from "../store/slices/taskSlice.js";
import { logout } from "../store/slices/authSlice.js";
import { useRouter } from "vue-router";

const dispatch = useDispatch();
const router = useRouter();

const tasks   = useSelector((s)=>s.tasks.items);
const status  = useSelector((s)=>s.tasks.status);
const username = useSelector((s)=>s.auth.user?.username || "Usuario");

onMounted(() => dispatch(fetchTasks()));

const remove = async (id) => {
  if (confirm("¿Eliminar tarea?")) await dispatch(deleteTask(id));
};

const doLogout = () => {
  dispatch(logout());
  router.push({ name: "login" });
};
</script>

<style scoped>

.page {
  max-width: 1000px;
  margin: 24px auto;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center; /* centra contenido */
  text-align: center;  /* centra texto */
}


.page-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between; /* título izq, acciones der */
  gap: 12px;
  margin-bottom: 16px;
}
.page-header h2 { margin: 0; }
.username { font-weight: 800; }


.btn {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background: #fff;
  cursor: pointer;
  margin-left: 8px;
}
.btn.primary {
  background: #3949ab;      
  color: #fff;
  border-color: transparent;
}
.btn:hover { filter: brightness(0.95); }



.table-card {
  width: 100%;
  background: #ffffff;          /* blanco */
  border-radius: 12px;
  box-shadow: 0 10px 24px rgba(0,0,0,.12);
  overflow: hidden;
  border: 1px solid #e7e8f2;
}


.task-table {
  width: 100%;
  border-collapse: collapse;
  color: #1f2a44;               
}


.task-table thead th {
  background: #232752;          
  color: #ffffff;
  font-weight: 700;
  padding: 12px;
  text-align: left;
}


.task-table tbody td {
  padding: 12px;
  border-top: 1px solid #eceff7;
  color: #2a3351;
  background: #ffffff;          
}


.task-table tbody tr:hover td {
  background: #f7f8ff;
}


.title { font-weight: 600; }
.row-actions .link {
  background: none;
  border: none;
  color: #1976d2;
  cursor: pointer;
  margin: 0 6px;
  text-decoration: underline;
}
.row-actions .link.danger { color: #d32f2f; }


.empty { padding: 24px; }


.loading { padding: 24px; }


.badge{
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  text-transform: lowercase;
}

.badge.pending{
  background: #9e9e9e;   /* gris */
  color: #ffffff;
}
.badge.in_progress{
  background: #ffd54f;   /* amarillo */
  color: #1b1f3b;        /* texto oscuro para contraste */
}
.badge.completed{
  background: #43a047;   /* verde */
  color: #ffffff;
}
</style>
