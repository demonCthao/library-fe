import { api } from "@/configs/ky-config";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

interface DataResponse<T> {
    success: boolean;
    data: T
}

export const useFetch = <TData>({ url, key, options }: { url: string, key: string[], options?: UseQueryOptions<TData> }) => {
    const fetchAPI = async (): Promise<TData> => {
        const response: DataResponse<TData> = await api.get(url).json();

        return response.data;
    }

    return useQuery({
        queryKey: key,
        queryFn: fetchAPI,
        refetchOnWindowFocus: false,
        enabled: true,
        ...options
    })
}