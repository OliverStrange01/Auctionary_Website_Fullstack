<template>
  <div class="login-container container my-5">
    <h1 class="mb-4 text-center">Login</h1>
    <form @submit.prevent="handleSubmit" novalidate>
      
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          id="email"
          type="email"
          v-model.trim="email"
          autocomplete="email"
          class="form-control"
          :class="{ 'is-invalid': submitted && fieldErrors.email }"
        />
        <div class="invalid-feedback" v-if="submitted && fieldErrors.email">
          {{ fieldErrors.email }}
        </div>
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <div class="input-group">
          <input
            id="password"
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            autocomplete="current-password"
            class="form-control"
            :class="{ 'is-invalid': submitted && fieldErrors.password }"
          />
          <button type="button" class="btn btn-outline-secondary" @click="showPassword = !showPassword">
            {{ showPassword ? "Hide" : "Show" }}
          </button>
          <div class="invalid-feedback" v-if="submitted && fieldErrors.password">
            {{ fieldErrors.password }}
          </div>
        </div>
      </div>

      <button type="submit" class="btn btn-primary w-100 mb-3">Login</button>

      <p class="text-center mb-3">
        Don't have an account?
        <router-link to="/register">Register here</router-link>
      </p>

      <div class="text-danger text-center" v-if="backendError">
        {{ backendError }}
      </div>

    </form>
  </div>
</template>

<script>
    import EmailValidator from "email-validator"
    import { loginService } from "@/services/login.services"
    import "../css/Login.css"

    export default {
    data() {
        return {
        email: "",
        password: "",
        submitted: false,
        fieldErrors: {},
        backendError: "",
        showPassword: false
        }
    },
    methods: {
        handleSubmit() {
            this.submitted = true
            this.fieldErrors = {}
            this.backendError = ""

            if (!this.email) this.fieldErrors.email = "Email is required"
            else if (!EmailValidator.validate(this.email))
                this.fieldErrors.email = "Please enter a valid email"

            if (!this.password) this.fieldErrors.password = "Password is required"
            else {
                const passwordRules = [
                { test: pwd => pwd.length >= 8, message: "Password must be at least 8 characters" },
                { test: pwd => /[A-Z]/.test(pwd), message: "Password must contain at least one uppercase letter" },
                { test: pwd => /[0-9]/.test(pwd), message: "Password must contain at least one number" },
                { test: pwd => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), message: "Password must contain at least one special character" }
                ]

                for (const rule of passwordRules) {
                if (!rule.test(this.password)) {
                    this.fieldErrors.password = rule.message
                    break
                }
                }
            }

            if (Object.keys(this.fieldErrors).length > 0) return

            this.loading = true
            loginService.login(this.email, this.password)
              .then(result => {
                if (result.success) this.$router.push("/")
                else this.backendError = result.error
              })
              .finally(() => this.loading = false)
                }
    }
}
</script>