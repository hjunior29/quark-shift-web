<template>
    <div ref="vantaRef" class="w-full h-screen relative text-white">
        <div class="absolute inset-0 z-5 flex items-center justify-center">
            <div
                class="w-1/2 h-96 px-6 bg-white/30 backdrop-blur-sm rounded-md shadow-lg flex items-center justify-center"
            >
                <div class="flex flex-col w-full items-center">
                    <div class="mb-16">
                        <h1 class="text-5xl font-bold text-white drop-shadow-md text-center">
                            Quark Shift
                        </h1>
                        <p class="text-lg text-gray-200 text-center">
                            Shorten your URLs with ease and style.
                        </p>
                    </div>

                    <input
                        v-model="inputUrl"
                        type="text"
                        placeholder="Paste your long URL here"
                        class="w-full h-12 px-6 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                    <button
                        @click="handleSubmit"
                        class="mt-3 h-12 w-1/2 rounded-md mx-auto text-white transition-colors duration-200"
                        :class="
                            apiPingSuccess
                                ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                                : 'bg-gray-400 cursor-not-allowed'
                        "
                        :disabled="!apiPingSuccess"
                    >
                        <template v-if="isLoading">
                            <svg
                                aria-hidden="true"
                                role="status"
                                class="inline w-4 h-4 text-white animate-spin"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="#E5E7EB"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </template>
                        <template v-else> Shorten</template>
                    </button>
                </div>
            </div>
            <div v-if="shortUrl" class="fixed inset-0 flex items-center justify-center z-50">
                <div
                    class="bg-white/70 backdrop-blur-sm px-8 py-8 rounded-md shadow-lg w-1/3 h-68 text-center space-y-8 text-gray-800 flex flex-col justify-between"
                >
                    <p class="text-lg font-semibold">Shortened URL</p>

                    <div
                        class="flex justify-center items-center space-x-2 bg-white/20 px-4 py-2 rounded-md"
                    >
                        <span class="truncate max-w-[90%]">{{ shortUrl }}</span>
                    </div>

                    <button
                        @click="(copyToClipboard(), (shortUrl = ''))"
                        class="h-8 px-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer mx-auto"
                    >
                        Copy and Close
                    </button>
                </div>
            </div>
        </div>
        <div class="absolute bottom-6 w-full flex justify-center z-10">
            <div
                class="px-4 py-2 bg-white/30 backdrop-blur-md rounded-md shadow-md flex items-center"
            >
                <img src="https://static.cdnlogo.com/logos/r/21/rust.svg" alt="Rust" class="h-12" />
                <p>+</p>
                <img
                    src="https://static.cdnlogo.com/logos/v/92/vue-js.svg"
                    alt="Vue"
                    class="h-12"
                />
                <p class="text-sm">Simple URL shortener built in Rust + Vue.</p>
            </div>
        </div>
    </div>
    <div
        v-if="isNotificationVisible"
        id="toast-bottom-right"
        class="fixed flex items-center w-full h-18 max-w-xs p-4 space-x-4 text-white bg-white/30 backdrop-blur-sm rounded-md shadow-lg divide-x rtl:divide-x-reverse divide-gray-200 right-5 bottom-5 "
        role="alert"
    >
        <template v-if="!apiPingSuccess">
            <div class="flex flex-col items-center w-full">
                <span class="text-sm font-normal flex self-start">Wake up API...</span>
                <div class="w-full -bottom-4 h-1.5 bg-white/90 overflow-hidden rounded-full relative">
                    <div class="absolute h-full bg-blue-600 animate-loading-bar w-1/3 rounded-full"></div>
                </div>
            </div>
        </template>
        <template v-else>
            <span class="text-sm font-normal">API is ready!</span>
        </template
        >
    </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { apiRequest, type ApiResponse } from './lib/apiRequest'
import * as THREE from 'three'
import CLOUDS from 'vanta/dist/vanta.clouds.min'
import type { VantaEffect } from '@/types/vanta-effect'

interface PingPong {
    message: string
}

interface Shortener {
    shortened_url: string
}

const vantaRef = ref<HTMLDivElement | null>(null)
const inputUrl = ref('')
const shortUrl = ref('')
const apiPingSuccess = ref(false)
const isLoading = ref(false)
const isNotificationVisible = ref(true)

let vantaEffect: VantaEffect

onMounted(() => {
    apiWakeUp()

    if (!vantaEffect && vantaRef.value) {
        vantaEffect = CLOUDS({
            el: vantaRef.value,
            THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            backgroundColor: 0xffffff,
            skyColor: 0x68b8d7,
            cloudColor: 0xadc1de,
            cloudShadowColor: 0x183550,
            sunColor: 0xff9919,
            sunGlareColor: 0xff6633,
            sunlightColor: 0xff9933,
            speed: 1,
        })
    }
})

onBeforeUnmount(() => {
    if (vantaEffect) vantaEffect.destroy()
})

const apiWakeUp = async () => {
    const start = Date.now()
    let attempts = 0

    while (!apiPingSuccess.value) {
        attempts++
        const res = await apiRequest<ApiResponse<PingPong>>('ping', 'GET')

        if (!res) {
            console.warn(`❌ Attempt ${attempts} failed. Retrying in 5 seconds...`)
            await new Promise((resolve) => setTimeout(resolve, 5_000))
            continue
        }

        if (res.status === 200) {
            apiPingSuccess.value = true
            const end = Date.now()
            const duration = Math.round((end - start) / 1000)
            console.log(`✅ API responded in ${duration} seconds after ${attempts} attempt(s).`)
            setTimeout(() => {
                isNotificationVisible.value = false
            }, 3000)
        } else {
            console.warn(`❌ Attempt ${attempts} failed. Retrying in 10 seconds...`, res.message)
            await new Promise((resolve) => setTimeout(resolve, 10_000))
        }

        if (!apiPingSuccess.value) {
            await new Promise((resolve) => setTimeout(resolve, 5_000))
        }
    }
}

const handleSubmit = async () => {
    isLoading.value = true
    if (!inputUrl.value.trim()) {
        console.warn('Input URL is empty. Please enter a valid URL.')
        isLoading.value = false
        return
    }

    const body = { url: inputUrl.value }

    const res = await apiRequest<ApiResponse<Shortener>>('shorten', 'POST', body)

    if (res.status === 200) {
        isLoading.value = false
        shortUrl.value = res.data.shortened_url
    } else {
        console.error('Error shortening URL:', res?.message || 'Unknown error')
        shortUrl.value = ''
        isLoading.value = false
    }
}

const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl.value)
}
</script>

<style scoped>
html,
body {
    margin: 0;
    padding: 0;
}

@keyframes loading-bar {
    0% {
        left: -33%;
    }
    100% {
        left: 100%;
    }
}

.animate-loading-bar {
    animation: loading-bar 0.75s linear infinite;
}
</style>
