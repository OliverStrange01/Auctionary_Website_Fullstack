<template>
  <div class="about-us-page container my-5">
    <header class="about-header text-center mb-5">
      <h1 class="display-5 fw-bold">About Auctionary</h1>
      <p class="subtitle lead text-muted">
        Learn more about our mission and how we connect buyers with unique auction items.
      </p>
    </header>

    <section class="about-content row justify-content-center">
      <div class="about-section col-md-8 mb-4">
        <h2 class="h4 mb-3">Our Mission</h2>
        <p>
          At Auctionary, we aim to provide a secure and seamless online auction experience.
          From rare antiques to contemporary collectibles, we connect sellers with enthusiastic buyers worldwide.
        </p>
      </div>

      <div class="about-section col-md-8 mb-4">
        <h2 class="h4 mb-3">Why Choose Us?</h2>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Trusted platform with verified sellers</li>
          <li class="list-group-item">Real-time bidding and updates</li>
          <li class="list-group-item">Secure payments and transparent transactions</li>
          <li class="list-group-item">Curated items with detailed descriptions and images</li>
        </ul>
      </div>

      <div class="about-section col-md-8">
        <h2 class="h4 mb-3">Contact Us</h2>
        <p>
          Have questions? Reach out at
          <a href="mailto:support@auctionary.com" class="ms-1">support@auctionary.com</a>
          or visit our
          <router-link to="/contact" class="ms-1">Contact Page</router-link>.
        </p>
      </div>
    </section>
  </div>
</template>

<script>
import "@/views/css/AboutUs.css"

export default {
  name: "AboutUs"
}
</script>