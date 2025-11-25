import type { App } from 'vue';

import { createPinia } from 'pinia';

import { PiniaColada, type PiniaColadaOptions } from '@pinia/colada';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const piniaStore = createPinia();
const piniaColadaConfig: PiniaColadaOptions = {
  queryOptions: {
    staleTime: 0
  },
  mutationOptions: {},
  plugins: []
};

export function setupStore(app: App) {
  app.use(piniaStore);
  app.use(PiniaColada, piniaColadaConfig);
  piniaStore.use(piniaPluginPersistedstate);
}
