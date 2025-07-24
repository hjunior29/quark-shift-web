export interface ApiResponse<T> {
    status: number
    message: string
    data: T
}

export interface RequestOptions<T> {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    endpoint: string
    data?: T
}

const API_BASE_URL = import.meta.env.VITE_API_URL || console.error('API URL not set!')

export async function apiRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body?: object,
): Promise<T> {
    try {
        const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: method !== 'GET' ? JSON.stringify(body) : undefined,
        })

        const apiResponse = await res.json()

        const response: ApiResponse<T> = {
            status: apiResponse.status,
            message: apiResponse.message,
            data: apiResponse.data,
        }

        return response as T
    } catch (err) {
        console.error('API Request Error:', err)
        throw err
    }
}
