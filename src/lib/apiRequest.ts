export interface ApiResponse<T> {
    code: number
    message: string
    data: T
}

export interface RequestOptions<T> {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    endpoint: string
    data?: T
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function apiRequest<T = unknown, P = any>({
    method,
    endpoint,
    data,
}: RequestOptions<P>): Promise<ApiResponse<T> | null> {
    try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: method !== 'GET' ? JSON.stringify(data) : undefined,
        })

        const json = await res.json()
        return json as ApiResponse<T>
    } catch (err) {
        console.error('API Request Error:', err)
        return null
    }
}
