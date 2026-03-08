import { api } from "@/configs/ky-config";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

type Method = "get" | "post" | "put" | "delete"

type ResponseType = "json" | "blob";

export const useMutationRequest = <
  TData,
  TVariables = unknown
>({
  key,
  url,
  method = "post",
  responseType = "json",
  options
}: {
  key: string[];
  url: string;
  method: Exclude<Method, "get">,
  responseType?: ResponseType;
  options?: UseMutationOptions<TData, Error, TVariables>
}) => {

  return useMutation({
    mutationKey: key,
    mutationFn: async (variables: TVariables): Promise<TData> => {
      const request = api[method].bind(api);
      const isFormData = variables instanceof FormData;
      const response = await request(url, {
        ...(isFormData
          ? { body: variables }
          : { json: variables }),
      });

      if (responseType === "blob") {
        return response.blob() as Promise<TData>;
      }

      return response.json<TData>();
    },
    ...options
  });
};
