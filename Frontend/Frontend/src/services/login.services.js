import { auth } from "../views/auth"

const register = (firstName, lastName, email, password) => {
  return fetch("http://localhost:3333/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      email,
      password
    })
  })
  .then(async (response) => {
    const text = await response.text()

    if (response.ok) return JSON.parse(text)

    try {
      throw JSON.parse(text).error_message
    } catch {
      throw "Failed to create account"
    }
  })
}

const login = (email, password) => {
  return fetch("http://localhost:3333/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })
  .then(async (response) => {
    const text = await response.text()

    if (response.ok) {
      const resJson = JSON.parse(text)
      auth.login(resJson.user_id, resJson.session_token)
      return { success: true, data: resJson, error: null }
    }

    try {
      const json = JSON.parse(text)
      return { success: false, data: null, error: json.error_message }
    } catch {
      return { success: false, data: null, error: text || "Login failed" }
    }
  })
}

const logout = () => {
  return fetch("http://localhost:3333/logout", {
    method: "POST",
    headers: auth.isAuthenticated
      ? { "X-Authorization": localStorage.getItem("session_token") }
      : {}
    })
  .then((response) => {
    if (response.status === 200) {
      return
    } else {
      throw 'Logout failed'
    }
  })
  .finally(() => {
    // Always clear local auth, even if backend fails
    localStorage.removeItem("session_token")
    localStorage.removeItem("user_id")
  })
}

const getUser = (userId) => {
  return fetch(`http://localhost:3333/users/${userId}`, {
    headers: {
      "X-Authorization": localStorage.getItem("session_token")
    }
  })
    .then(async response => {
      const text = await response.text()
      if (response.ok) return JSON.parse(text)
      throw JSON.parse(text).error_message || "Failed to load user"
    })
}

export const loginService = {
  login,
  logout,
  register,
  getUser
}

