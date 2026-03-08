import ky from "ky";

export const api = ky.create({
    prefixUrl: import.meta.env.VITE_API_URL,
    timeout: 10000,
    retry: {
        limit: 2,
        methods: ["get", "post", "put", "delete"],
    },
    hooks: {
        beforeRequest: [
            (request) => {
                const jwt = localStorage.getItem("jwt");
                if (jwt) {
                    const token = JSON.parse(jwt)?.access_token;
                    if (token) {
                        request.headers.set("Authorization", `Bearer ${token}`);
                    }
                }
            },
        ],

        afterResponse: [
            async (_request, _options, response) => {
                if (response.status === 401) {
                    localStorage.clear();
                    window.location.href = "/login";
                }
            },
        ],

        beforeError: [
            async (error) => {
                try {
                    const data: { message?: string } = await error.response?.json();
                    if (data?.message) {
                        error.message = data.message;
                    }
                } catch { }

                return error;
            },
        ],
    },
});