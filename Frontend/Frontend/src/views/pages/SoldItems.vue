<template>
  <div class="sold-items container my-5">
    <h1 class="mb-4">Sold Items</h1>

    <p v-if="loading" class="text-center">Loading sold items...</p>

    <div v-else-if="items.length" class="list-group">
      <div
        v-for="item in items"
        :key="item.item_id"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <strong>{{ item.name }}</strong>
          <p class="mb-0">Sold for £{{ item.current_bid }}</p>
        </div>
        <span class="badge bg-success me-3">SOLD</span>
        <button class="btn btn-outline-primary btn-sm" @click="$router.push(`/item/${item.item_id}`)">
          View Auction
        </button>
      </div>
    </div>

    <p v-else class="text-center text-muted mt-3">
      You haven’t sold any items yet.
    </p>
  </div>
</template>

<script>
import { coreService } from '@/services/core.services'
import "../css/SoldItems.css"

export default {
  name: "MySoldItems",

  data() {
    return {
      items: [],
      loading: true
    }
  },

  mounted() {
    const userId = Number(localStorage.getItem("user_id"))
    const now = Date.now()

    coreService.getAllItems()
      .then(items => {
        const myEndedItems = items.filter(
          i => i.creator_id === userId && Number(i.end_date) < now
        )

        return Promise.all(
          myEndedItems.map(item =>
            coreService.getSingleItem(item.item_id)
          )
        )
      })
      .then(itemsWithDetails => {
        this.items = itemsWithDetails.filter(
          item => item.current_bid > item.starting_bid
        )
      })
      .catch(err => {
        console.error("Failed to load sold items:", err)
      })
      .finally(() => {
        this.loading = false
      })
  }
}
</script>