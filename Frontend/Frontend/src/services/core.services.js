

const createItem = (item) => {
  return fetch("http://localhost:3333/item", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": localStorage.getItem("session_token")
    },
    body: JSON.stringify({
      name: item.name,
      description: item.description,
      starting_bid: item.starting_bid,
      start_date: item.start_date,
      end_date: item.end_date
    })
  })
  .then(async res => {
    if (!res.ok) {
      const data = await res.json()
      throw data.error_message || "Failed to create item"
    }
    return res.json()
  })
}

const bidOnItem = (itemId, amount) => {
  return fetch(`http://localhost:3333/item/${itemId}/bid`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": localStorage.getItem("session_token")
    },
    body: JSON.stringify({ amount })
  })
  .then(async res => {
    if (!res.ok) {
      const data = await res.json()
      throw data.error_message || "Failed to place bid"
    }
    return res.json()
  })
}

const searchItems = (params = {}) => {
  const queryParams = {}

  if (params.q !== undefined) {
    queryParams.q = params.q
  }

  if (params.status) {
    queryParams.status = params.status
  }

  queryParams.limit = params.limit ?? 50
  queryParams.offset = params.offset ?? 0

  const query = new URLSearchParams(queryParams).toString()

  const headers = {}
  const token = localStorage.getItem("session_token")

  
  if (token) {
    headers["X-Authorization"] = token
  }

  return fetch(`http://localhost:3333/search?${query}`, {
    headers,
    cache: "no-store"
  })
    .then(res => {
      if (!res.ok) throw "Search failed"
      return res.json()
    })
}

const getSingleItem = (itemId) => {
  return fetch(`http://localhost:3333/item/${itemId}`)
    .then(res => {
      if (!res.ok) throw 'Item not found'
      return res.json()
    })
}

const getAllItems = () => {
  return fetch("http://localhost:3333/search?limit=1000", {
    cache: "no-store"
  })
  .then(res => {
    if (!res.ok) throw "Failed to fetch items"
    return res.json()
  })
}

export const coreService = {
    searchItems,
    getSingleItem,
    createItem,
    getAllItems,
    bidOnItem
}