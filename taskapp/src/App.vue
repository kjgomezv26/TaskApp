<template>
  <header class="app-navbar">
    <div class="brand">
      <router-link to="/tasks">Sistema de tareas</router-link>
    </div>
    <!-- Si quieres botones a la derecha, agrégalos aquí -->
    <!-- <nav class="nav-actions">
      <router-link to="/tasks/new" class="btn">Nueva tarea</router-link>
    </nav> -->
  </header>

  <main class="app-main">
    <router-view />
  </main>
</template>



<style scoped>
.app-navbar {
  /* Azul casi morado (indigo) + suave degradado */
  background: linear-gradient(90deg, #3f51b5, #5e35b1);
  color: #fff;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .15);
  position: sticky;
  top: 0;
  z-index: 100;
}

.brand a {
  color: #fff;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: .2px;
}

.nav-actions a {
  color: #fff;
  text-decoration: none;
  margin-left: 12px;
  opacity: .9;
}
.nav-actions a:hover { opacity: 1; }

.nav-actions .btn {
  padding: 6px 10px;
  border: 1px solid rgba(255,255,255,.55);
  border-radius: 8px;
}

.app-main { padding: 16px; }
</style>
