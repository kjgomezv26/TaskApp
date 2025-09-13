import { inject, onUnmounted, ref } from "vue";
export const STORE_KEY = "redux:store";

export const provideStore = (app, store) => app.provide(STORE_KEY, store);

export const useDispatch = () => {
  const store = inject(STORE_KEY);
  if (!store) throw new Error("Redux store no disponible");
  return store.dispatch;
};

export const useSelector = (selector) => {
  const store = inject(STORE_KEY);
  if (!store) throw new Error("Redux store no disponible");
  const selected = ref(selector(store.getState()));
  const unsubscribe = store.subscribe(() => {
    selected.value = selector(store.getState());
  });
  onUnmounted(() => unsubscribe());
  return selected;
};
