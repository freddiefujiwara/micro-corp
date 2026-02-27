import { computed, ref, watch } from 'vue';
import { runSimulation, getOptimizationData } from '../domain/scenario-engine.js';
import { encode, decode } from '../domain/url.js';
import { DEFAULT_PARAMS } from '../constants/simulation.js';

export const useSimulation = (route, router) => {
  const params = ref({ ...DEFAULT_PARAMS });

  const applyToken = (token) => {
    if (!token || typeof token !== 'string') {
      return;
    }

    const decoded = decode(token);
    if (!decoded) {
      return;
    }

    const currentToken = encode(params.value);
    if (token !== currentToken) {
      params.value = { ...params.value, ...decoded };
    }
  };

  applyToken(route.params.token);

  watch(
    () => route.params.token,
    (newToken) => applyToken(newToken),
  );

  watch(
    params,
    (newParams) => {
      const token = encode(newParams);
      router.replace({ name: 'home', params: { token } });
    },
    { deep: true },
  );

  const results = computed(() => runSimulation(params.value));
  const optimizationData = computed(() =>
    getOptimizationData(params.value, 45000, 250000, 5000),
  );

  return {
    params,
    results,
    optimizationData,
  };
};
