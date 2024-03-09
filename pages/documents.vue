<script setup lang="ts">
import { status } from "~/constants";
import { ACCOUNT } from "~/libs/appwrite";
import { useAuthStore } from "~/store/auth.store";
import { useStatus } from "~/query/use-status";
import { useLoadingStore } from "~/store/loading.store";

const router = useRouter();
const loadingStore = useLoadingStore();
const authStore = useAuthStore();
definePageMeta({ layout: "documents" });
useHead({ title: "Documents | Jira software" });
onMounted(() => {
  ACCOUNT.get()
    .then(() => loadingStore.set(false))
    .catch(() => router.push("/"));
});

onMounted(() => {
  ACCOUNT.get()
    .then((response: any) =>
      authStore.set({
        email: response.email,
        id: response.$id,
        name: response.name,
        status: response.status,
      })
    )
    .finally(() => loadingStore.set(false));
});
const { data, isLoading, refetch } = useStatus();
</script>

<template>
  <div class="grid grid-cols-4 gap-2 mt-12" v-if="isLoading">
		<USkeleton class="h-12 dark:bg-gray-900 bg-gray-100" />
		<USkeleton class="h-12 dark:bg-gray-900 bg-gray-100" />
		<USkeleton class="h-12 dark:bg-gray-900 bg-gray-100" />
		<USkeleton class="h-12 dark:bg-gray-900 bg-gray-100" />

		<UiDealsLoader />
		<UiDealsLoader />
		<UiDealsLoader />
		<UiDealsLoader />
	</div>
  <div class="grid grid-cols-4 gap-2 mt-12">
    <div v-for="item in data" :key="item.id">
      <UButton class="w-full h-12" color="blue" variant="outline">
        <div class="flex items-center space-x-2">
          <span class="font-bold">{{ item.name }}</span>
          <span class="text-sm text-neutral-500">{{ item.items.length }}</span>
        </div>
      </UButton>

      <SharedCreateDeal :status="item.id" :refetch="refetch"/>
      <div
        v-for="card in item.items"
        :key="card.$id"
				class="my-3 dark:bg-gray-900 bg-gray-100 rounded-md p-2 animation"
        role="button"
        draggable="true"
      >
        <div class="flex items-center space-x-2">
          <span class="font-bold text-lg uppercase">{{ card.name }}</span>
        </div>

        <UDivider class="my-3" />

        <div class="opacity-55 text-sm line-clamp-1">
          {{ card.description }}
        </div>

        <UButton color="blue" class="w-full mt-3 group" variant="ghost">
          <span class="font-bold">More details</span>
          <Icon
            name="material-symbols:arrow-right-alt-rounded"
            class="group-hover:translate-x-2 transition"
          />
        </UButton>
      </div>
    </div>
  </div>
</template>
<style scoped>
@keyframes show {
	from {
		transform: scale(0.5) translateY(-30px);
		opacity: 0.4;
	}
	to {
		transform: scale(1) translateY(0);
		opacity: 1;
	}
}

.animation {
	animation: show 0.3s ease-in-out;
}
</style>