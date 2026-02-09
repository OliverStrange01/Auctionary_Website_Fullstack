<template>
  <div class="contact-page container my-5">
    <header class="contact-header text-center mb-5">
      <h1 class="display-5 fw-bold">Contact Us</h1>
      <p class="subtitle lead text-muted">
        We're happy to help. Reach out to us through the details below.
      </p>
    </header>

    <section class="contact-content row justify-content-center g-4">
      <div class="contact-card col-md-4">
        <div class="card h-100 shadow-sm p-3">
          <h2 class="h5 mb-2">Email</h2>
          <p><a href="mailto:support@auctionary.com">support@auctionary.com</a></p>
        </div>
      </div>

      <div class="contact-card col-md-4">
        <div class="card h-100 shadow-sm p-3">
          <h2 class="h5 mb-2">Phone</h2>
          <p>+44 123 456 789</p>
        </div>
      </div>

      <div class="contact-card col-md-4">
        <div class="card h-100 shadow-sm p-3">
          <h2 class="h5 mb-2">Address</h2>
          <p>123 Auctionary Street, Manchester, UK</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import "@/views/css/ContactUs.css"

export default {
  name: "ContactUs"
}
</script>