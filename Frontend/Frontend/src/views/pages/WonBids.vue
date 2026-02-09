<template>
  <div class="won-bids container my-5">
    <h1 class="mb-4">Auctions You’ve Won</h1>

    <p v-if="loading" class="text-center">Loading won auctions…</p>

    <div v-else-if="items.length" class="list-group">
      <div
        v-for="item in items"
        :key="item.item_id"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <strong>{{ item.name }}</strong>
          <p class="mb-0 text-success">Won for £{{ item.current_bid }}</p>
        </div>
        <button class="btn btn-outline-primary btn-sm" @click="$router.push(`/item/${item.item_id}`)">
          View Auction
        </button>
      </div>
    </div>

    <p v-else class="text-center text-muted mt-3">
      You haven’t won any auctions yet.
    </p>
  </div>
</template>

<script>
import { coreService } from "@/services/core.services"
import "../css/WonBids.css"

export default {
  name: "WonBids",
  data() {
    return {
      items: [],
      loading: true
    }
  },
  mounted() {
    const userId = Number(localStorage.getItem("user_id"))
    const now = Date.now()

    coreService.searchItems({ status: "BID", limit: 100 })
      .then(async items => {
        const ended = items.filter(
          i => Number(i.end_date) < now
        )

        const detailed = await Promise.all(
          ended.map(i =>
            coreService.getSingleItem(i.item_id)
          )
        )

        this.items = detailed.filter(
          i => i.current_bid_holder?.user_id === userId
        )
      })
      .catch(err => {
        console.error("Failed to load won bids:", err)
      })
      .finally(() => {
        this.loading = false
      })
  }
}
</script>