<template>
  <div class="auth-container container my-5">
    <h1 class="mb-4">Create Account</h1>

    <form @submit.prevent="handleRegister" novalidate>
      <div class="mb-3">
        <label for="firstName" class="form-label">First Name</label>
        <input
          id="firstName"
          v-model.trim="firstName"
          type="text"
          placeholder="First name"
          class="form-control"
          :class="{ 'is-invalid': submitted && fieldErrors.firstName }"
        />
        <div class="invalid-feedback" v-if="submitted && fieldErrors.firstName">
          {{ fieldErrors.firstName }}
        </div>
      </div>

      <div class="mb-3">
        <label for="lastName" class="form-label">Last Name</label>
        <input
          id="lastName"
          v-model.trim="lastName"
          type="text"
          placeholder="Last name"
          class="form-control"
          :class="{ 'is-invalid': submitted && fieldErrors.lastName }"
        />
        <div class="invalid-feedback" v-if="submitted && fieldErrors.lastName">
          {{ fieldErrors.lastName }}
        </div>
      </div>

      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          id="email"
          v-model.trim="email"
          type="email"
          @blur="submitted = true; validateForm()"
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
            placeholder="Password"
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

      <button type="submit" class="btn btn-primary w-100 mb-3">Create Account</button>

      <p class="text-danger" v-if="backendError">{{ backendError }}</p>

      <p class="login-link text-center">
        Already have an account? <router-link to="/login">Log in</router-link>
      </p>
    </form>
  </div>
</template>

<script>
import { loginService } from "@/services/login.services"
import "../css/CreateAccount.css"

export default {
  name: "CreateAccount",

  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      password: "",

      showPassword: false,
      submitted: false,

      fieldErrors: {
        firstName: "",
        lastName: "",
        email: "",
        password: ""
      },

      backendError: ""
    }
  },

  methods: {
    validateForm() {
      this.fieldErrors = {
        firstName: "",
        lastName: "",
        email: "",
        password: ""
      }

      let valid = true

      if (!this.firstName) {
        this.fieldErrors.firstName = "First name is required."
        valid = false
      }

      if (!this.lastName) {
        this.fieldErrors.lastName = "Last name is required."
        valid = false
      }

      if (!this.email || !this.email.trim()) {
        this.fieldErrors.email = "Email is required."
        valid = false
      } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailPattern.test(this.email.trim())) {
          this.fieldErrors.email = "Please enter a valid email address."
          valid = false
        }
      }

      const passwordPattern =
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,30}$/

      if (!passwordPattern.test(this.password)) {
        this.fieldErrors.password =
          "Password must be 8–30 characters and include uppercase, lowercase, number, and special character."
        valid = false
      }

      return valid
    },

    async handleRegister() {
      this.submitted = true
      this.backendError = ""
      this.fieldErrors = {
        firstName: "",
        lastName: "",
        email: "",
        password: ""
      }

      if (!this.validateForm()) return

      try {
        await loginService.register(
          this.firstName.trim(),
          this.lastName.trim(),
          this.email.trim(),
          this.password
        )

        await loginService.login(this.email.trim(), this.password)

        this.$router.push("/")
      } catch (err) {
        let message = ""

        if (err.response && err.response.data) {
          message =
            err.response.data.message ||
            err.response.data.error ||
            JSON.stringify(err.response.data)
        } else {
          message = err.message || String(err)
        }

        message = message.toLowerCase()

        if (message.includes("email")) {
          this.fieldErrors.email = "Please enter a valid email address."
        } else if (message.includes("password")) {
          this.fieldErrors.password =
            "Password must include uppercase, lowercase, number, and special character."
        } else if (message.includes("first")) {
          this.fieldErrors.firstName = "First name is required."
        } else if (message.includes("last")) {
          this.fieldErrors.lastName = "Last name is required."
        } else {
          this.backendError = "Failed to create account."
        }
      }
    }
  }
}
</script>