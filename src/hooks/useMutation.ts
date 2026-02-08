import { api } from "@/configs/ky-config"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"

type Method = "get" | "post" | "put" | "delete"

export const useMutationRequest = <
    TData,
    TVariables = unknown
>({ key, url, method, options }: {
    key: string[];
    url: string,
    method: Exclude<Method, "get">,
    options?: UseMutationOptions<TData, Error, TVariables>
}
) => {
    const mutationFn = async (variables: TVariables): Promise<TData> => {
        return api[method](url, {
            json: variables,
        }).json<TData>()
    }

    return useMutation({
        mutationKey: key,
        mutationFn,
        ...options,
    })
}
