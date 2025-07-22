<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white p-6 rounded-3 shadow-md w-96">
            <h2 class="text-lg font-semibold mb-4">Your shortened URL:</h2>
            <div class="flex items-center justify-between bg-gray-100 p-3 rounded-3">
                <span class="truncate max-w-xs">{{ url }}</span>
                <button
                    @click="copyToClipboard"
                    class="ml-2 text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                    📋
                </button>
            </div>
            <button
                @click="$emit('close')"
                class="mt-4 text-gray-600 hover:text-gray-900 text-sm cursor-pointer"
            >
                Close
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{ url: string }>()
const emit = defineEmits(['close'])

function copyToClipboard() {
    navigator.clipboard.writeText(props.url)
}
</script>
