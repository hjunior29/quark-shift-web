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
                        class="w-full h-12 px-6 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 mb-3"
                    />
                    <button
                        @click="handleSubmit"
                        class="h-12 px-12 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer mx-auto"
                    >
                        Shorten
                    </button>
                </div>
            </div>
            <div v-if="shortUrl" class="fixed inset-0 flex items-center justify-center z-50 ">
                <div
                    class="bg-white/70 backdrop-blur-sm px-8 py-8 rounded-md shadow-lg w-1/3 h-68 text-center space-y-8 text-gray-800"
                >
                    <p class="text-lg font-semibold ">Shortened URL</p>

                    <div
                        class="flex justify-center items-center space-x-2 bg-white/20 px-4 py-2 rounded-md "
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
                class="px-4 py-2 bg-white/20 backdrop-blur-md rounded-md shadow-md flex items-center"
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
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { apiRequest } from './lib/apiRequest'
import * as THREE from 'three'
import CLOUDS from 'vanta/dist/vanta.clouds.min'

const vantaRef = ref<HTMLDivElement | null>(null)
let vantaEffect: any = null

onMounted(() => {
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

<style scoped>
html,
body {
    margin: 0;
    padding: 0;
}
</style>
