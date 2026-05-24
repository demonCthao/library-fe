import ky from "ky";

export const api = ky.create({
    prefixUrl: import.meta.env.VITE_API_URL,
    timeout: 20000, // Tăng lên chút vì upload ảnh có thể lâu hơn
    retry: {
        limit: 2,
        methods: ["get", "post", "put", "delete"],
        // Không retry nếu lỗi 4xx (lỗi do mình/user thì retry làm gì đúng ko nè)
        statusCodes: [408, 413, 429, 500, 502, 503, 504]
    },
    hooks: {
        beforeRequest: [
            (request) => {
                const jwt = localStorage.getItem("jwt");
                if (jwt) {
                    try {
                        const token = JSON.parse(jwt)?.access_token;
                        if (token) {
                            request.headers.set("Authorization", `Bearer ${token}`);
                        }
                    } catch (e) {
                        console.error("JWT parse error", e);
                    }
                }
            },
        ],

        afterResponse: [
            async (_request, _options, response) => {
                if (response.status === 401) {
                    if (!window.location.pathname.includes("/login")) {
                        localStorage.clear();
                        window.location.href = "/login";
                    }
                }
            },
        ],

        beforeError: [
            async (error) => {
                const { response } = error;
                if (response) {
                    try {
                        const data = await response.json() as { message?: string };
                        if (data?.message) {
                            error.message = data.message;
                        }
                    } catch {
                        // Nếu ko parse đc json thì giữ nguyên error message mặc định
                    }
                }
                return error;
            },
        ],
    },
});