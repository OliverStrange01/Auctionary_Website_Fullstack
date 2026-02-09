<template>
  <div class="my-items container my-5">
    <h1 class="my-auctions-title mb-4">My Auctions</h1>
    <p v-if="loading" class="text-center">Loading your auctions...</p>

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
              'bg-success': getStatus(item) === 'Live',
              'bg-warning text-dark': getStatus(item) === 'Upcoming',
              'bg-secondary': getStatus(item) === 'Ended'
            }"
          >
            {{ getStatus(item) }}
          </span>
        </div>

        <button class="btn btn-outline-primary btn-sm" @click="$router.push(`/item/${item.item_id}`)">
          View
        </button>
      </div>
    </div>
    
    <div v-else class="my-auctions-empty text-center mt-5">
      <div class="card p-4 shadow-sm mx-auto" style="max-width: 400px;">
        <h2 class="h4 mb-3">No auctions yet</h2>
        <div class="empty-icon display-1 mb-3">🏛️</div>
        <p class="text-muted mb-3">
          You haven’t listed any items for auction.<br />
          Start your first auction and let bidders compete.
        </p>

        <router-link to="/create" class="btn btn-primary">
          Create your first auction
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { coreService } from "@/services/core.services"
import "../css/MyItems.css"

export default {
  name: "MyItems",
  data() {
    return {
      items: [],
      loading: true
    }
  },
  mounted() {
    const userId = Number(localStorage.getItem("user_id"))

    coreService.getAllItems()
      .then(items => {

        this.items = items.filter(
          item => item.creator_id === userId
        )

        console.log("FILTERED MY ITEMS:", this.items)

        this.loading = false
      })
      .catch(err => {
        console.error("FAILED TO LOAD ITEMS:", err)
        this.loading = false
      })
  },
  computed: {
    now() {
      return Date.now()
    }
  },
  methods: {
    getStatus(item) {
      const now = this.now
      const start = item.start_date ? Number(item.start_date) : 0
      const end = item.end_date ? Number(item.end_date) : 0

      if (end && end < now) return "expired"
      if (start && start > now) return "upcoming"
      return "live"
    }
  }
}
</script>