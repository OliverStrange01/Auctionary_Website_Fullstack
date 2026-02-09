<template>
  <footer class="site-footer">
    <div class="footer-content">
      <div class="footer-section">
        <h4>Auctionary</h4>
        <p>Discover unique items, place bids, and track auctions in real time.</p>
      </div>

      <div class="footer-section">
        <h4>Links</h4>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/auctions">Auctions</router-link></li>
          <li><router-link to="/about">About</router-link></li>
          <li><router-link to="/contact">Contact</router-link></li>
          <li><router-link to="/privacy-policy">Privacy policy</router-link></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      &copy; {{ new Date().getFullYear() }} Auctionary. All rights reserved.
    </div>
  </footer>
</template>

<script>
import "@/views/css/Footer.css"

export default {
  name: "Footer"
}
</script>