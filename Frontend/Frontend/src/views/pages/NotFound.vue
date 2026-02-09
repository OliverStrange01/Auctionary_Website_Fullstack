<template>
  <div class="notfound-container container text-center my-5">
    <h1 class="display-4 mb-3">404 - Page Not Found</h1>
    <p class="lead mb-4">The page you are looking for does not exist.</p>
    <router-link to="/" class="btn btn-primary">Go back home</router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.notfound-container {
  text-align: center;
  margin-top: 5rem;
  font-family: Arial, sans-serif;
}

.notfound-container h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}
</style>