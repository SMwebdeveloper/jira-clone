<script setup lang="ts">
import { useAuthStore } from '~/store/auth.store';
import { useLoadingStore } from '~/store/loading.store';
import { ACCOUNT } from '~/libs/appwrite';
const authStore = useAuthStore()
const loadingStore = useLoadingStore()
onMounted(() => {
    ACCOUNT.get().then((response:any) => {
        authStore.set({
            email: response.email,
			id: response.$id,
			name: response.name,
			status: response.status
        })
    }).finally(() => loadingStore.set(false))
}
)
</script>

<template>
    <UiLoader v-if="loadingStore.isLoading"/>
    <template v-else>
        <LayoutsMainNavbar/>
        <section class="min-h-screen bg-white dark:bg-black">
            <slot/>
        </section>
    </template>
</template>~/store/loading.store