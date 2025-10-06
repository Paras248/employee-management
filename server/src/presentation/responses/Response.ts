export class Response {
    static success<T>(message: string, data: T) {
        return {
            success: true,
            error: null,
            data,
            message,
        };
    }

    static failure(message: string, error: string[]) {
        return {
            success: false,
            error,
            data: null,
            message,
        };
    }
}
