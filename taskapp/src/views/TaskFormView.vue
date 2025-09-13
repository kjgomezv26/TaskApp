<template>
  <div class="wrap">
    <header class="hdr">
      <h2>{{ isEdit ? 'Editar Tarea' : 'Nueva Tarea' }}</h2>
      <router-link :to="{ name:'tasks' }">Volver</router-link>
    </header>

    <form @submit.prevent="onSubmit" novalidate>
      
      <label>Título*</label>
      <input
        v-model="form.title"
        :class="{ invalid: !!errors.title }"
        required
        autocomplete="off"
      />
      <small v-if="errors.title" class="error">{{ errors.title }}</small>

      
      <label>Descripción*</label>
      <textarea
        v-model="form.description"
        rows="4"
        :class="{ invalid: !!errors.description }"
        required
      ></textarea>
      <small v-if="errors.description" class="error">{{ errors.description }}</small>

      
      <label>Estado*</label>
      <select
        v-model="form.status"
        :class="{ invalid: !!errors.status }"
        required
      >
        <option value="pending">pending</option>
        <option value="in_progress">in_progress</option>
        <option value="completed">completed</option>
      </select>
      <small v-if="errors.status" class="error">{{ errors.status }}</small>

      
      <label>Fecha de vencimiento*</label>
      <input
        type="date"
        v-model="form.due_date"
        :min="todayStr"
        :class="{ invalid: !!errors.due_date }"
        required
      />
      <small v-if="errors.due_date" class="error">{{ errors.due_date }}</small>

      <div style="margin-top:12px;">
        <button type="submit">{{ isEdit ? 'Guardar' : 'Crear' }}</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { onMounted, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDispatch, useSelector } from "../store/vueRedux.js";
import { fetchTaskById, createTask, updateTask, clearCurrent } from "../store/slices/taskSlice.js";

const route = useRoute();
const router = useRouter();
const dispatch = useDispatch();

const idParam = route.params.id ? Number(route.params.id) : null;
const isEdit = computed(() => !!idParam);

const current = useSelector((s) => s.tasks.current);


const todayStr = computed(() => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
});

const form = reactive({
  title: "",
  description: "",
  status: "pending",
  due_date: "" 
});

const errors = reactive({
  title: "",
  description: "",
  status: "",
  due_date: ""
});

function validate() {
  // limpia
  errors.title = errors.description = errors.status = errors.due_date = "";

  const title = (form.title || "").trim();
  const description = (form.description || "").trim();
  const status = form.status;
  const due = form.due_date;

  let ok = true;

  if (!title) {
    errors.title = "El título es obligatorio.";
    ok = false;
  }
  if (!description) {
    errors.description = "La descripción es obligatoria.";
    ok = false;
  }
  if (!status) {
    errors.status = "Selecciona un estado.";
    ok = false;
  } else if (!["pending", "in_progress", "completed"].includes(status)) {
    errors.status = "Estado inválido.";
    ok = false;
  }
  if (!due) {
    errors.due_date = "La fecha de vencimiento es obligatoria.";
    ok = false;
  } else if (due < todayStr.value) {
    errors.due_date = "La fecha no puede ser menor a la fecha actual.";
    ok = false;
  }

  return ok;
}

onMounted(async () => {
  if (isEdit.value) {
    await dispatch(fetchTaskById(idParam));
    if (current.value) {
      form.title = current.value.title || "";
      form.description = current.value.description || "";
      form.status = current.value.status || "pending";
      form.due_date = current.value.due_date || "";
    }
  } else {
    dispatch(clearCurrent());
  }
});

const onSubmit = async () => {
  if (!validate()) return;

  const payload = {
    title: form.title.trim(),
    description: form.description.trim(),
    status: form.status,
    due_date: form.due_date
  };

  if (isEdit.value) {
    await dispatch(updateTask({ id: idParam, ...payload }));
  } else {
    await dispatch(createTask(payload));
  }
  router.push({ name: "tasks" });
};
</script>

<style scoped>
.wrap { max-width: 720px; margin: 20px auto; padding: 0 12px; }
.hdr  { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
label { display:block; margin-top:8px; font-weight:600; }
input, textarea, select {
  width:100%; margin:6px 0; padding:10px;
  border:1px solid #cfd8dc; border-radius:8px; outline:none;
}
input:focus, textarea:focus, select:focus { border-color:#3949ab; box-shadow:0 0 0 3px rgba(57,73,171,.15); }
.invalid { border-color:#e53935 !important; box-shadow:0 0 0 3px rgba(229,57,53,.12) !important; }
.error { display:block; color:#e53935; margin-top:-2px; font-size:12px; }

button[type="submit"] {
  padding:10px 14px; border-radius:8px; border:0; cursor:pointer;
  background:#3949ab; color:#fff; font-weight:700;
}
button[type="submit"]:hover { filter: brightness(0.95); }
</style>
