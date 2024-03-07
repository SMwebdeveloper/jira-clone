export const useLoadingStore = defineStore('loading', {
    state: () => ({ isLoading: false }),
    actions: {
        set(isLoading: boolean) {
            this.$patch({isLoading})
        }
    }
})