export const log = (action, payload) => {
  const entry = {
    time: new Date().toISOString(),
    action,
    payload
  }

  console.log("LOG:", entry)

  const logs = JSON.parse(localStorage.getItem("logs") || "[]")
  logs.push(entry)
  localStorage.setItem("logs", JSON.stringify(logs))
}