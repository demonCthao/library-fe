import { api } from "@/configs/ky-config";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

type Method = "get" | "post" | "put" | "delete"

type ResponseType = "json" | "blob";

export const useMutationRequest = <TData, TVariables = unknown>({
  key,
  url: defaultUrl,
  method: defaultMethod = "post",
  responseType = "json",
  options
}: {
  key: string[];
  url: string;
  method: Exclude<Method, "get">;
  responseType?: ResponseType;
  options?: UseMutationOptions<TData, Error, TVariables>;
}) => {
  return useMutation({
    mutationKey: key,
    mutationFn: async (variables: TVariables): Promise<TData> => {
      const isFormData = variables instanceof FormData;

      const response = await api(defaultUrl, {
        method: defaultMethod,
        body: variables instanceof FormData ? variables : undefined,
        json: variables instanceof FormData ? undefined : variables,
        headers: variables instanceof FormData ? undefined : undefined,
      });

      if (responseType === "blob") {
        return await response.blob() as TData;
      }

      return await response.json<TData>();
    },
    ...options
  });
};
