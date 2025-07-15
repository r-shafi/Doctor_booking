import { useState } from 'react';

export const useLoadingState = (initialStates = {}) => {
  const [loadingStates, setLoadingStates] = useState(initialStates);

  const setLoading = (key, value) => {
    setLoadingStates((prev) => ({ ...prev, [key]: value }));
  };

  const isLoading = (key) => {
    return loadingStates[key] || false;
  };

  const isAnyLoading = () => {
    return Object.values(loadingStates).some(Boolean);
  };

  return {
    loadingStates,
    setLoading,
    isLoading,
    isAnyLoading,
  };
};

export default useLoadingState;
