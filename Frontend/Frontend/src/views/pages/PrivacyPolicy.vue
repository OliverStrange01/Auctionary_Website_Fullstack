<template>
  <div class="privacy-page container my-5">
    <header class="privacy-header text-center mb-5">
      <h1 class="display-5 fw-bold">Privacy Policy</h1>
      <p class="subtitle text-muted">Last updated: {{ lastUpdated }}</p>
    </header>

    <section class="privacy-section mb-4">
      <h2 class="h5">1. Introduction</h2>
      <p>
        Auctionary respects your privacy and is committed to protecting any
        personal information you provide when using our website.
      </p>
    </section>

    <section class="privacy-section mb-4">
      <h2 class="h5">2. Information We Collect</h2>
      <p>
        We may collect the following information when you use our services:
      </p>
      <ul>
        <li>Account information (such as username and email address)</li>
        <li>Auction activity (items created, bids placed)</li>
        <li>Technical data (such as browser type and device)</li>
      </ul>
    </section>

    <section class="privacy-section mb-4">
      <h2 class="h5">3. How We Use Your Information</h2>
      <p>
        Your information is used to:
      </p>
      <ul>
        <li>Provide and manage auction services</li>
        <li>Maintain account security</li>
        <li>Improve user experience</li>
      </ul>
    </section>

    <section class="privacy-section mb-4">
      <h2 class="h5">4. Cookies</h2>
      <p>
        Auctionary uses cookies to improve website functionality and user
        experience. You can disable cookies in your browser settings at any
        time.
      </p>
    </section>

    <section class="privacy-section mb-4">
      <h2 class="h5">5. Data Sharing</h2>
      <p>
        We do not sell or share your personal data with third parties, except
        where required by law.
      </p>
    </section>

    <section class="privacy-section mb-4">
      <h2 class="h5">6. Data Security</h2>
      <p>
        We take reasonable measures to protect your personal information from
        unauthorised access or disclosure.
      </p>
    </section>

    <section class="privacy-section mb-4">
      <h2 class="h5">7. Your Rights</h2>
      <p>
        You have the right to access, update, or request deletion of your
        personal data.
      </p>
    </section>

    <section class="privacy-section mb-4">
      <h2 class="h5">8. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us
        at <a href="mailto:support@auctionary.com">support@auctionary.com</a>.
      </p>
    </section>
  </div>
</template>

<script>
import "@/views/css/PrivacyPolicy.css"

export default {
  name: "PrivacyPolicy",
  data() {
    return {
      lastUpdated: "January 2026"
    }
  }
}
</script>