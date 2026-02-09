<template>
  <div class="single-item-root">

    <div class="item-page">
      <p v-if="loading" class="item-loading">Loading item…</p>

      <div v-else-if="item" class="item-card">
        <h2 class="item-title">{{ item.name }}</h2>

        <div class="item-detail">
          <span class="label">About the item</span>
          <p class="item-description">{{ item.description }}</p>
        </div>

        <div class="item-details">
          <div class="item-detail">
            <span class="label">Current bid</span>
            <span class="value">£{{ item.current_bid ?? '—' }}</span>
          </div>

          <div class="item-detail">
            <span class="label">Starting bid</span>
            <span class="value">£{{ item.starting_bid }}</span>
          </div>

          <div class="item-detail" v-if="item.creator">
            <span class="label">Creator</span>
            <span class="value">{{ item.creator.username }}</span>
          </div>

          <div class="item-detail">
            <span class="label">Ends</span>
            <span class="value">{{ formattedEndDate }}</span>
          </div>
        </div>
      </div>

      <p v-else class="item-empty">Item not found.</p>
      <p v-if="error" class="item-error">{{ error }}</p>
    </div>

    <div class="bid-section" v-if="item && !isAuctionEnded">
      <div v-if="isLoggedIn">
        <h3>Place a Bid</h3>

        <form @submit.prevent="placeBid">
          <input
            type="number"
            min="0"
            step="1"
            v-model.number="bidAmount"
            placeholder="Enter bid amount"
            required
          />

          <button
            v-if="hasStarted"
            class="bid-button"
          >
            Place bid
          </button>

          <p v-else class="auction-not-started">
            This auction starts on {{ formattedStartDate }}
          </p>
        </form>

        <p v-if="bidError" class="bid-error">{{ bidError }}</p>
        <p v-if="bidSuccess" class="bid-success">
          Bid placed successfully!
        </p>
      </div>
      
      <div v-else class="bid-login-required">
        <p>You must be logged in to place a bid.</p>
        <router-link to="/login">Log in</router-link>
      </div>
      
    </div>
    <div class="bid-section" v-else-if="item && isAuctionEnded">
      <h3>Auction ended</h3>

      <p v-if="item.current_bid">
        Winning bid: £{{ item.current_bid }}
      </p>

      <p v-else>
        No bids were placed on this item.
      </p>
    </div>
    <div v-if="isWinner" class="auction-result-winner">
      <h3>🎉 Congratulations!</h3>
      <p>You won this auction with a bid of £{{ item.current_bid }}.</p>
    </div>

    <div class="questions-section" v-if="item">
      <h3>Questions</h3>

      <div
        v-if="isLoggedIn && !isCreator"
        class="ask-question-form"
      >
        <textarea
          class="question-input"
          v-model="newQuestion"
          placeholder="Ask a question about this item..."
        ></textarea>

        <button
          class="question-button"
          @click="askQuestion"
          :disabled="asking"
        >
          {{ asking ? "Sending…" : "Ask Question" }}
        </button>

        <p v-if="questionError" class="error">
          {{ questionError }}
        </p>
      </div>

      <p
        v-if="questions.length === 0"
        class="no-questions"
      >
        No questions yet.
      </p>

      <div
        v-for="q in questions"
        :key="q.question_id"
        class="question-card"
      >
        <p class="question-text">
          <strong>Q:</strong> {{ q.question_text }}
        </p>

        <p v-if="q.answer_text" class="answer-text">
          <strong>A:</strong> {{ q.answer_text }}
        </p>

        <div
          v-if="isCreator && !q.answer_text"
          class="answer-form"
        >
          <textarea
            class="answer-input"
            v-model="answers[q.question_id]"
            placeholder="Write an answer..."
          ></textarea>

          <button
            class="answer-button"
            :disabled="answering[q.question_id]"
            @click="answerQuestion(q.question_id)"
          >
            {{ answering[q.question_id] ? "Answered" : "Answer" }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { coreService } from '@/services/core.services'
import "../css/SingleItem.css"
import { questionsService } from "@/services/questions.services"

export default {
  data() {
    return {
      item: null,
      loading: false,
      error: "",

      bidAmount: null,
      bidding: false,
      bidError: "",
      bidSuccess: false,

      questions: [],
      newQuestion: "",
      asking: false,
      questionError: "",
      answers: {},
      answering: {}
    }
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem("session_token")
    },
    formattedStartDate() {
      if (!this.item?.start_date) return ""

      const date =
        typeof this.item.start_date === "number"
          ? new Date(this.item.start_date)
          : new Date(Date.parse(this.item.start_date))

      return date.toLocaleString()
    },

    formattedEndDate() {
      if (!this.item?.end_date) return ""

      const date =
        typeof this.item.end_date === "number"
          ? new Date(this.item.end_date)
          : new Date(Date.parse(this.item.end_date))

      return date.toLocaleString()
    },

    hasStarted() {
      if (!this.item?.start_date) return false

      const start =
        typeof this.item.start_date === "number"
          ? this.item.start_date
          : Date.parse(this.item.start_date)

      return Date.now() >= start
    },
    currentUserId() {
      return Number(localStorage.getItem("user_id"))
    },
    isCreator() {
      return this.item?.creator_id === this.currentUserId
    },
    isAuctionEnded() {
    return this.item && Date.now() > Number(this.item.end_date)
    },
    isWinner() {
      return (
        this.isAuctionEnded &&
        this.item.current_bid_holder &&
        this.item.current_bid_holder.user_id === this.currentUserId
      )
    },
    hasWinner() {
      return this.isAuctionEnded && this.item.current_bid_holder
    },
  },
  mounted() {
    this.loading = true

    coreService.getSingleItem(this.$route.params.id)
      .then(item => {
        this.item = item
        return questionsService.getItemQuestions(item.item_id)
      })
      .then(questions => {
        this.questions = questions
      })
      .catch(err => {
        this.error = this.getErrorMessage(
          err,
          "Failed to load item."
        )
      })
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    placeBid() {
      if (!this.hasStarted) {
        this.bidError = "This auction has not started yet."
        return
      }

      if (this.isAuctionEnded) {
        this.bidError = "This auction has ended."
        return
      }

      if (!this.isLoggedIn) {
        this.bidError = "You must be logged in to bid."
        return
      }

      this.bidError = ""
      this.bidSuccess = false
      this.bidding = true

      coreService.bidOnItem(this.item.item_id, this.bidAmount)
        .then(() => {
          this.bidSuccess = true
          this.bidAmount = null
          return coreService.getSingleItem(this.item.item_id)
        })
        .then(item => {
          this.item = item
        })
        .catch(err => {
          this.bidError = this.getErrorMessage(
            err,
            "Unable to place bid. Please try again."
          )
        })
        .finally(() => {
          this.bidding = false
        })
    },
    askQuestion() {
      if (!this.newQuestion.trim()) return

      this.asking = true
      this.questionError = ""

      questionsService.askQuestion(
        this.item.item_id,
        this.newQuestion
      )
        .then(() => {
          this.newQuestion = ""
          return questionsService.getItemQuestions(this.item.item_id)
        })
        .then(questions => {
          this.questions = questions
        })
        .catch(err => {
          this.questionError = this.getErrorMessage(
            err,
            "Could not submit your question."
          )
        })
        .finally(() => {
          this.asking = false
        })
    },

    answerQuestion(questionId) {
      if (this.answering[questionId]) return

      const text = this.answers[questionId]
      if (!text?.trim()) return

      this.answering[questionId] = true

      questionsService.answerQuestion(questionId, text)
        .then(() => {
          this.answers[questionId] = ""
          return questionsService.getItemQuestions(this.item.item_id)
        })
        .then(questions => {
          this.questions = questions
        })
        .catch(err => {
          if (err === "Forbidden") {
            alert("This question has already been answered.")
          }
        })
        .finally(() => {
          this.answering[questionId] = false
        })
    },
    getErrorMessage(err, fallback = "Something went wrong. Please try again.") {
      if (err?.response?.data?.error_message) {
        return err.response.data.error_message
      }

      if (typeof err === "string") return err
      if (err?.message) return err.message

      return fallback
    }
  }
}
</script>