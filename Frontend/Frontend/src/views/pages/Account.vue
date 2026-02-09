<template>
  <div class="account-wrapper container my-5">
    <h1 class="mb-4">Account</h1>

    <div class="account-card card p-4 shadow-sm">
      <div v-if="user" class="account-user mb-3 text-center">
        <h2 class="h4 fw-bold">{{ user.first_name }} {{ user.last_name }}</h2>
        <p class="account-email text-muted">{{ user.email }}</p>
      </div>

      <p class="account-text text-center mb-4">
        Manage your account and auctions.
      </p>

      <div class="account-links d-flex flex-column flex-md-row justify-content-center gap-3">
        <router-link to="/my-items" class="account-link btn btn-outline-primary">
          My Auctions
        </router-link>

        <router-link to="/my-bids" class="account-link btn btn-outline-primary">
          My Bids
        </router-link>

        <router-link to="/sold-items" class="account-link btn btn-outline-primary">
          Sold Items
        </router-link>

        <router-link to="/won-items" class="account-link btn btn-outline-primary">
          Won Auctions
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import "../css/Account.css"
import { loginService } from "@/services/login.services.js"

export default {
  name: "Account",
  data() {
    return {
      user: null
    }
  },
  mounted() {
    const userId = localStorage.getItem("user_id")
    if (!userId) return

    loginService.getUser(userId)
      .then(user => {
        this.user = user
      })
      .catch(err => {
        console.error("Failed to load user:", err)
      })
  }
}
</script>