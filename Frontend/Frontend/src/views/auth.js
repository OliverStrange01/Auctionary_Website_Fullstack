import { reactive } from "vue"

export const auth = reactive({
  isAuthenticated: !!localStorage.getItem("session_token"),
  userId: localStorage.getItem("user_id"),

  login(userId, token) {
    this.isAuthenticated = true
    this.userId = userId
    localStorage.setItem("user_id", userId)
    localStorage.setItem("session_token", token)
  },

  logout() {
    this.isAuthenticated = false
    this.userId = null
    localStorage.removeItem("user_id")
    localStorage.removeItem("session_token")
  }
})