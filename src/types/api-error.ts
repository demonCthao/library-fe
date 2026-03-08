export class ApiError extends Error {
    errors?: unknown

    constructor(message: string, errors?: unknown) {
        super(message)
        this.errors = errors
    }
}