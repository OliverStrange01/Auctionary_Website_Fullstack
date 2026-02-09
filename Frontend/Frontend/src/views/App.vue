<template>
  <div class="app-container">
    <nav class="navbar">
      <div class="nav-brand" @click="$router.push('/')">
        <img src="../views/images/Logo.png" alt="Auctionary logo" />
      </div>

      <div class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/auctions" class="nav-link">Auctions</router-link>

        <template v-if="!auth.isAuthenticated">
          <router-link to="/login" class="nav-link">Login</router-link>
          <router-link to="/register" class="nav-link">Create Account</router-link>
        </template>

        <template v-else>
          <router-link to="/account" class="nav-link">My Account</router-link>
          <router-link to="/create" class="nav-link">Create Auction</router-link>
          <router-link to="/logout" class="nav-link">Logout</router-link>
        </template>
      </div>
    </nav>

    <main class="content">
      <router-view />
    </main>

    <div
      v-if="showCookiesBanner"
      class="cookie-banner"
      role="alert"
      aria-live="polite"
    >
      <p>
        We use cookies to improve your experience on Auctionary. By continuing, you agree to our
        <a href="/privacy-policy" target="_blank">Privacy Policy</a>.
      </p>
      <button @click="acceptCookies" class="cookie-button">Accept</button>
    </div>
    
    <Footer />
  </div>
</template>

<script>
import { auth } from "../views/auth";
import "../views/css/Navbar.css";
import Footer from "@/views/components/Footer.vue"

export default {
  name: "App",
  data() {
    return {
      auth,
      showCookiesBanner: !localStorage.getItem("cookiesAccepted")
    };
  },
  methods: {
    logout() {

      // Remove only auth-related data
      localStorage.removeItem("session_token")
      localStorage.removeItem("user_id")
      localStorage.removeItem("user_name")

      auth.isAuthenticated = false
      auth.userId = null
      auth.userName = null

      // Navigate to login safely
      this.$router.replace("/login")
    },
    acceptCookies() {
      localStorage.setItem("cookiesAccepted", true);
      this.showCookiesBanner = false;
    }
  },
  components: {Footer}
  
};
</script>

