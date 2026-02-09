<template>
  <div class="create-item-wrapper container my-5">

    <div class="create-item-image mb-4"></div>

    <div class="create-item-content row justify-content-center">
      <div class="create-item-card col-md-8 card p-4 shadow-sm">
        <h1 class="create-item-title display-5 fw-bold mb-2">Create Auction</h1>
        <p class="create-item-subtitle lead text-muted mb-4">
          Enter details for your auction lot.
        </p>

        <form class="create-item-form" @submit.prevent="submit">
          <div class="mb-3">
            <label class="form-label">Item name</label>
            <input
              v-model="name"
              class="form-control"
              placeholder="Item name"
              required
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Description</label>
            <textarea
              v-model="description"
              class="form-control"
              placeholder="Description"
              required
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Starting bid</label>
            <div class="input-group">
              <span class="input-group-text">£</span>
              <input
                v-model.number="startingBid"
                type="number"
                min="1"
                class="form-control"
                placeholder="0"
                required
              />
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Start date & time</label>
            <div class="row g-2 align-items-center">
              <div class="col">
                <input
                  v-model="startDate"
                  type="date"
                  class="form-control"
                  required
                />
              </div>
              <div class="col">
                <input
                  v-model="startTime"
                  type="time"
                  class="form-control"
                  :min="minStartTime"
                  required
                />
              </div>
            </div>
            <small class="form-text text-muted">
              Enter time in 24-hour format (e.g. 14:30)
            </small>
          </div>

          <div class="mb-4">
            <label class="form-label">End date & time</label>
            <div class="row g-2 align-items-center">
              <div class="col">
                <input
                  v-model="endDate"
                  type="date"
                  class="form-control"
                  :min="today"
                  required
                />
              </div>
              <div class="col">
                <input
                  v-model="endTime"
                  type="time"
                  class="form-control"
                  :min="minEndTime"
                  required
                />
              </div>
            </div>
            <small class="form-text text-muted">
              Enter time in 24-hour format (e.g. 14:30)
            </small>
          </div>

          <button class="btn btn-primary w-100 mb-3">
            Create Item
          </button>

          <p v-if="error" class="text-danger text-center">
            {{ error }}
          </p>
        </form>
      </div>
    </div>

  </div>
</template>

<script>
import { coreService } from "@/services/core.services"
import "../css/CreateItem.css"

export default {
  name: "CreateItem",
  data() {
    return {
      name: "",
      description: "",
      startingBid: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      error: ""
    }
  },
  methods: {
    submit() {
      this.error = ""

      const start = new Date(`${this.startDate}T${this.startTime}`).getTime()
      const end = new Date(`${this.endDate}T${this.endTime}`).getTime()

      if (isNaN(start) || isNaN(end)) {
        this.error = "Please select both date and time."
        return
      }

      if (start < Date.now()) {
        this.error = "Start date cannot be in the past."
        return
      }

      if (end <= start) {
        this.error = "End date must be after the start date."
        return
      }

      coreService.createItem({
        name: this.name,
        description: this.description,
        starting_bid: this.startingBid,
        start_date: start,
        end_date: end
      })
      .then(() => this.$router.push("/"))
      .catch(err => {
        this.error = err
      })
    }
  },
  computed: {
    minStartDate() {
      const now = new Date()
      now.setSeconds(0, 0)
      return now.toISOString().slice(0, 16)
    },
    isStartToday() {
      if (!this.startDate) return false

      const today = new Date()
      const [y, m, d] = this.startDate.split("-").map(Number)

      return today.getFullYear() === y &&
            today.getMonth() + 1 === m &&
            today.getDate() === d
    },

    minStartTime() {
      if (!this.isStartToday) return "00:00"

      const now = new Date()
      return now.toTimeString().slice(0, 5)
    },
    minEndTime() {
      if (!this.startDate || !this.endDate) return "00:00"

      const [sy, sm, sd] = this.startDate.split("-").map(Number)
      const [ey, em, ed] = this.endDate.split("-").map(Number)

      if (sy === ey && sm === em && sd === ed) {
        return this.startTime || "00:00"
      }

      return "00:00"
    },
    today() {
      return new Date().toISOString().slice(0, 10)
    }
  }
}
</script>