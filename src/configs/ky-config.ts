import ky from "ky";

export const api = ky.create({
    prefixUrl: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    },
    retry: {
        limit: 3,
        methods: ["get", "post", "put", "delete"]
    },
    hooks: {
        beforeRequest: [
            request => {
                const jwt = localStorage.getItem("jwt")
                if (jwt) {
                    request.headers.set("Authorization", `Bearer ${JSON.parse(jwt)?.access_token}`);
                }
            }
        ],
        afterResponse: [
            async (request, options, response) => {
                if (response.status === 401) {
                    localStorage.clear();
                    window.location.href = "/login"
                    return ky(request, options);
                }

                return response;
            },
        ],
        beforeError: [
            async error => {
                const data: { message: string } = await error.response?.json();
                if (data) {
                    error.message = data.message;
                }
                
                return error
            }
        ]
    }
});