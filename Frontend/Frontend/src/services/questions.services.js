const getItemQuestions = (itemId) => {
  return fetch(`http://localhost:3333/item/${itemId}/question`, {
    cache: "no-store"
  })
    .then(res => {
      if (!res.ok) throw "Failed to fetch questions"
      return res.json()
    })
}

const askQuestion = (itemId, questionText) => {
  return fetch(`http://localhost:3333/item/${itemId}/question`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": localStorage.getItem("session_token")
    },
    body: JSON.stringify({
      question_text: questionText
    })
  })
  .then(async res => {
    if (!res.ok) {
      const text = await res.text()
      throw text || "Failed to ask question"
    }
    return res.json()
  })
}

const answerQuestion = (questionId, answerText) => {
  return fetch(`http://localhost:3333/question/${questionId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": localStorage.getItem("session_token")
    },
    body: JSON.stringify({
      answer_text: answerText
    })
  })
}

export const questionsService = {
  getItemQuestions,
  askQuestion,
  answerQuestion
}