<template>
    <section class="home-items container my-5">
        <h2 class="mb-4">Live Auctions</h2>

        <div class="search-wrapper mb-4 position-relative">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search auctions..."
            class="form-control"
            @focus="showDropdown = true"
            @input="showDropdown = true"
          />

          <ul v-if="showDropdown && filteredItems.length" class="list-group position-absolute w-100 zindex-2 mt-1">
            <li
              v-for="item in filteredItems.slice(0, 5)"
              :key="item.item_id"
              class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              @click="handleItemClick(item.item_id)"
            >
              {{ item.name }}
              <span v-if="!isLoggedIn" class="text-muted small">— log in to bid</span>
            </li>
          </ul>

          <p v-if="showDropdown && !filteredItems.length" class="search-hint mt-1 text-muted">
            No matching auctions.
          </p>
        </div>

        <div v-if="displayedItems.length" class="row row-cols-1 row-cols-md-3 g-4">
          <div v-for="item in displayedItems" :key="item.item_id" class="col">
            <div class="card h-100 shadow-sm">
              <div class="card-body d-flex flex-column justify-content-between">
                <strong class="card-title">{{ item.name || "Unnamed item" }}</strong>
                <button
                  class="btn btn-primary mt-3"
                  @click="$router.push(`/item/${item.item_id}`)"
                >
                  View auction →
                </button>
              </div>
            </div>
          </div>
        </div>

        <p v-else class="no-auctions text-center text-muted mt-4">No auctions available.</p>
      </section>
</template>

<script>

import { coreService } from "@/services/core.services"
import { auth } from "@/views/auth"
import "../css/Home.css"

export default {
  name: "Bids",
  data() {
    return {
      items: [],
      error: "",
      loading: true,
      searchTerm: "",
      showDropdown: false
    }
  },
  computed: {
    isLoggedIn() {
      return auth.isAuthenticated
    },
    currentUserId() {
      return Number(localStorage.getItem("user_id"))
    },
    liveItems() {
      const now = Date.now()
      const userId = Number(localStorage.getItem("user_id"))

      return this.items.filter(item => {
        const start = Number(item.start_date) || 0
        const end = Number(item.end_date) || 0
        const isLive = start <= now && end >= now
        const notOwnAuction = !this.isLoggedIn || item.creator_id !== userId
        return isLive && notOwnAuction
      })
    },
    filteredItems() {
      if (!this.searchTerm.trim()) return []
      const term = this.searchTerm.toLowerCase()
      return this.liveItems.filter(item => {
        const nameMatch = item.name.toLowerCase().includes(term)
        const descMatch = item.description?.toLowerCase().includes(term)
        return nameMatch || descMatch
      })
    },
    displayedItems() {
      return this.searchTerm.trim() ? this.filteredItems : this.liveItems
    }
  },
  methods: {
    handleItemClick(id) {
      this.showDropdown = false
      this.searchTerm = ""
      this.$router.push(`/item/${id}`)
    }
  },
  mounted() {
    coreService.searchItems().then(items => {
      console.log("ITEMS:", items)

      items.forEach(i => {
        console.log({
          id: i.item_id,
          start: i.start_date,
          end: i.end_date,
          now: Date.now()
        })
      })

      this.items = items
    })
  }
}
</script>