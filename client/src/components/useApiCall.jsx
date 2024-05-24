import { useMutation } from "react-query";

const useApiCall = (mutationFn) => {
  const { isLoading, mutate } = useMutation(mutationFn);

  return { isLoading, callApi: mutate };
};

export default useApiCall;
