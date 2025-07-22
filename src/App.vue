<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div class="w-full max-w-2xl">
            <div class="flex items-center space-x-4">
                <input
                    v-model="inputUrl"
                    type="text"
                    placeholder="Paste your long URL here"
                    class="flex-1 h-16 px-6 text-lg border border-gray-300 rounded-3 focus:outline-none focus:ring focus:border-blue-300"
                />
                <button
                    @click="handleSubmit"
                    class="h-16 px-6 bg-blue-600 text-white rounded-3 hover:bg-blue-700 cursor-pointer"
                >
                    Shorten
                </button>
            </div>
        </div>

        <div
            v-if="shortUrl"
            class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
            <div class="bg-white p-6 rounded-3 shadow-md w-full max-w-sm text-center space-y-4">
                <p class="text-lg font-semibold">Your shortened URL:</p>
                <div class="flex justify-center items-center space-x-2 bg-gray-100 p-2 rounded-3">
                    <span class="truncate max-w-[70%]">{{ shortUrl }}</span>
                    <button
                        @click="copyToClipboard"
                        class="text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                        📋
                    </button>
                </div>
                <button
                    @click="shortUrl = ''"
                    class="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { apiRequest } from './lib/apiRequest'

const inputUrl = ref('')
const shortUrl = ref('')

const handleSubmit = async () => {
    if (!inputUrl.value.trim()) return

    const res = await apiRequest<string>({
        method: 'POST',
        endpoint: '/shorten',
        data: { url: inputUrl.value },
    })

    if (res?.data) {
        shortUrl.value = res.data.shortened_url
    }
}

const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl.value)
}
</script>

<style scoped></style>
