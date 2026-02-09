<template>
  <div class="logout-container container my-5 text-center">
    <h1 class="mb-3">Log out</h1>
    <p class="mb-4">Are you sure you want to log out?</p>

    <div class="d-flex justify-content-center gap-3">
      <button class="btn btn-danger" @click="confirmLogout">Yes, log me out</button>
      <button class="btn btn-secondary" @click="cancelLogout">Cancel</button>
    </div>
  </div>
</template>

<script>
import { auth } from "@/views/auth"

export default {
  methods: {
    confirmLogout() {
        fetch("http://localhost:3333/logout", {
            method: "POST",
            headers: {
            "X-Authorization": localStorage.getItem("session_token")
            }
        }).finally(() => {
            auth.logout()
            this.$router.replace("/")
        })
    },
    cancelLogout() {
      this.$router.back()
    }
  }
}
</script>

