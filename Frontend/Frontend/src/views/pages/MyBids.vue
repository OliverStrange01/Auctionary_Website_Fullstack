<template>
  <div class="my-bids container my-5">
    <h1 class="mb-4">My Bids</h1>

    <p v-if="loading" class="text-center">Loading your bids…</p>

    <div v-else-if="items.length" class="list-group">
      <div
        v-for="item in items"
        :key="item.item_id"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <strong>{{ item.name || "Unnamed item" }}</strong>
          <span
            class="badge ms-2"
            :class="{
              'bg-success': item.status.toLowerCase() === 'winning',
              'bg-warning text-dark': item.status.toLowerCase() === 'pending',
              'bg-secondary': item.status.toLowerCase() === 'lost'
            }"
          >
            {{ item.status }}
          </span>
        </div>

        <button class="btn btn-outline-primary btn-sm" @click="$router.push(`/item/${item.item_id}`)">
          View
        </button>
      </div>
    </div>

    <p v-else class="text-center text-muted mt-3">
      You haven’t bid on any items yet.
    </p>
  </div>
</template>

<script>
import { coreService } from "@/services/core.services"
import "../css/MyBids.css"

export default {
  name: "MyBids",
  data() {
    return {
      items: [],
      loading: true
    }
  },
  mounted() {
    const userId = Number(localStorage.getItem("user_id"))

    coreService.searchItems({ status: "BID", limit: 100 })
        .then(async items => {
        const enriched = await Promise.all(
            items.map(async item => {
            const now = Date.now()
            const ended = item.end_date && Number(item.end_date) < now

            const details = await coreService.getSingleItem(item.item_id)

            const isHighest =
                details.current_bid_holder?.user_id === userId

            if (!ended) {
                return {
                ...item,
                status: isHighest ? "WINNING" : "OUTBID"
                }
            }

            return {
                ...item,
                status: isHighest ? "WON" : "OUTBID"
            }
            })
        )

        this.items = enriched
        })
        .catch(err => {
        console.error("Failed to load bids:", err)
        })
        .finally(() => {
        this.loading = false
        })
    }
}
</script>
