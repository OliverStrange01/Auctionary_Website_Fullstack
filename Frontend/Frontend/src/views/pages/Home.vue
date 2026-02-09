<template>
  <div class="home">
    
      <section class="home-hero">
        <div class="home-content">
          <header class="home-header">
            <div>
              <div v-if="isLoggedIn" class="welcome-message">
                Welcome back!
              </div>
              <div v-else class="info-message">
                Browse auctions — log in to place bids.
              </div>

              <p class="auction-intro">
                Discover unique items, place competitive bids, and track auctions in real time.
              </p>
            </div>
          </header>
          <section class="antique-sections">
            <div class="antique-item">
              <h3>Fine Art & Paintings</h3>
              <p>
                Original oil paintings, watercolours, and works on paper from respected artists and historic periods.
              </p>
            </div>

            <div class="antique-item">
              <h3>Antiques & Decorative Objects</h3>
              <p>
                Carefully curated furniture, ceramics, clocks, and decorative pieces with character and provenance.
              </p>
            </div>

            <div class="antique-item">
              <h3>Vintage Jewelry & Watches</h3>
              <p>
                Elegant rings, necklaces, brooches, and timepieces crafted with timeless design and craftsmanship.
              </p>
            </div>

            <div class="antique-item">
              <h3>Collectibles & Memorabilia</h3>
              <p>
                Rare books, coins, manuscripts, and unique collectibles sought after by dedicated collectors.
              </p>
            </div>
          </section>
          
        </div>
      </section>

      <div v-if="error" class="backend-error">{{ error }}</div>

      <section class="home-items">
        <h2>Live Auctions</h2>
        <ul v-if="previewItems.length" class="auction-grid">
          <li v-for="item in previewItems" :key="item.item_id" class="auction-card">
            <div class="auction-card-body">
              <strong class="auction-title">
                {{ item.name || "Unnamed item" }}
              </strong>
            </div>

            <button
              class="auction-button"
              @click="$router.push(`/item/${item.item_id}`)"
            >
              View auction
            </button>
            
          </li>
        </ul>
        

        <p v-else class="no-auctions">No auctions available.</p>
        <h2>View more here:</h2>
        <router-link to="/auctions" class="nav-link">Auctions</router-link>
      </section>
    </div>
</template>

<script>
import { coreService } from "@/services/core.services"
import { auth } from "@/views/auth"
import "../css/Home.css"

export default {
  name: "Home",
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
        const end = Number(item.end_date)
        if (!end) return false

        const start = item.start_date
          ? Number(item.start_date)
          : 0

        const isLive = start <= now && end >= now
        const notOwnAuction =
          !this.isLoggedIn || item.creator_id !== userId

        return isLive && notOwnAuction
      })
    },

    previewItems() {
      return this.liveItems.slice(0, 6) 
    },

    filteredItems() {
      if (!this.searchTerm.trim()) return []

      const term = this.searchTerm.toLowerCase()
      return this.liveItems.filter(item =>
        item.name.toLowerCase().includes(term)
      )
    }
  },
  methods: {
    handleItemClick(id) {
      if (!this.isLoggedIn) {
        this.$router.push("/login")
        return
      }
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
  },
}
</script>