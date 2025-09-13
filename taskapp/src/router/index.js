import { createRouter, createWebHistory } from "vue-router";

const Login = () => import("../views/LoginView.vue");
const TasksList = () => import("../views/TaskListView.vue");
const TaskForm = () => import("../views/TaskFormView.vue");

const routes = [
  { path: "/login", name: "login", component: Login },
  { path: "/tasks", name: "tasks", component: TasksList, meta: { requiresAuth: true } },
  { path: "/tasks/new", name: "task-new", component: TaskForm, meta: { requiresAuth: true } },
  { path: "/tasks/:id/edit", name: "task-edit", component: TaskForm, meta: { requiresAuth: true }, props: true },
  { path: "/", redirect: "/tasks" },
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to) => {
  const access = localStorage.getItem("access");
  if (to.meta.requiresAuth && !access) return { name: "login" };
  if (to.name === "login" && access) return { name: "tasks" };
});

export default router;
