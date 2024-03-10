<script setup lang="ts">
import { COLLECTION_DEALS, DB_ID, status } from "~/constants";
import { ACCOUNT, DATABASE } from "~/libs/appwrite";
import { useStatus } from "~/query/use-status";
import { useLoadingStore } from "~/store/loading.store";
import { useMutation } from "@tanstack/vue-query";
import type { IColumn, IDeal } from "~/types";
import { useCurrentDealStore } from "~/store/current-deal.store";

const router = useRouter();
const loadingStore = useLoadingStore();
const {set} = useCurrentDealStore()

definePageMeta({ layout: "documents" });
useHead({ title: "Documents | Jira software" });
onMounted(() => {
  ACCOUNT.get()
    .then(() => loadingStore.set(false))
    .catch(() => router.push("/"));
});

const { data, isLoading, refetch } = useStatus();
const dragCardRef = ref<IDeal | null>(null);
const sourceColumnRef = ref<IColumn | null>(null);
const isMoving = ref(false);

const { mutate, isPending } = useMutation({
  mutationKey: ["moveCard"],
  mutationFn: ({ docId, status }: { docId: string; status: string }) =>
    DATABASE.updateDocument(DB_ID, COLLECTION_DEALS, docId, { status }),
  onSuccess: () => refetch(),
});

const handleDragStart = (card: IDeal, column: IColumn) => {
  isMoving.value = true;
  dragCardRef.value = card;
  sourceColumnRef.value = column;
};
const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
};
const handleDrop = (item: IColumn) => {
  isMoving.value = false;
  if (dragCardRef.value && sourceColumnRef.value) {
    mutate({ docId: dragCardRef.value.$id, status: item.id });
  }
};
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
    <div
      v-for="item in data"
      :key="item.id"
      @dragover="handleDragOver"
      @drop="() => handleDrop(item)"
      class="px-1"
      :class="isMoving && 'border-l-2 border-r-2 border-dotted h-screen dark:border-gray-900 border-gray-200'"
      >
      <UButton class="w-full h-12" color="blue" variant="outline">
        <div class="flex items-center space-x-2">
          <span class="font-bold">{{ item.name }}</span>
          <span class="text-sm text-neutral-500">{{ item.items.length }}</span>
        </div>
      </UButton>

      <SharedCreateDeal :status="item.id" :refetch="refetch" />
      <div
        v-for="card in item.items"
        :key="card.$id"
        class="my-3 dark:bg-gray-900 bg-gray-100 rounded-md p-2 animation"
        :class="isPending && 'opacity-50 cursor-not-alloweds'"
        role="button"
        draggable="true"
        @dragstart="() => handleDragStart(card, item)"
      >
        <div class="flex items-center space-x-2">
          <span class="font-bold text-lg uppercase">{{ card.name }}</span>
        </div>

        <UDivider class="my-3" />

        <div class="opacity-55 text-sm line-clamp-1">
          {{ card.description }}
        </div>

        <UButton color="blue" class="w-full mt-3 group" variant="ghost" @click="set(card)">
          <span class="font-bold">More details</span>
          <Icon
            name="material-symbols:arrow-right-alt-rounded"
            class="group-hover:translate-x-2 transition"
          />
        </UButton>
      </div>
    </div>
  </div>
  <Slideover/>
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
