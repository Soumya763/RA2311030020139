const express = require("express")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

let data = [
  { id: 1, title: "System Update", body: "New version", time: "2m ago", seen: false }
]

const logger = (req, res, next) => {
  console.log({
    method: req.method,
    url: req.url,
    time: new Date().toISOString(),
    body: req.body
  })
  next()
}

app.use(logger)

app.get("/notifications", (req, res) => {
  res.json(data)
})

app.post("/notifications", (req, res) => {
  const item = { id: Date.now(), ...req.body }
  data.push(item)
  res.json(item)
})

app.delete("/notifications/:id", (req, res) => {
  data = data.filter(n => n.id != req.params.id)
  res.json({ success: true })
})

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000")
})