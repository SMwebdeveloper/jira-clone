<script setup lang="ts">
import { ACCOUNT } from '~/libs/appwrite';
// import { useLoadingStore } from '~/store/loading.store';

const router = useRouter()
// const loadingStore = useLoadingStore()

definePageMeta({ layout: 'documents' })
useHead({title:'Documents | Jira software'})
onMounted(() => {
    // ACCOUNT.get().then(() => loadingStore.set((false))).catch(() => router.push('/'))
})
</script>

<template>
    
</template>