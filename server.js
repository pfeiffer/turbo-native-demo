import express from "express"
import layouts from "express-ejs-layouts"
import cookieParser from "cookie-parser"
import multer from "multer"
const upload = multer()
const app = express();

// Ensure we use environment port if available for deploying
const PORT = process.env.PORT || 45678

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.static("public/javascript"))
app.use(express.static("json"))
app.use(cookieParser())
app.use(layouts)

// Determine platform
app.use((request, response, next) => {
  const userAgent = request.get("User-Agent")
  response.locals.native_app = userAgent.includes("Turbo Native")
  next()
})

// Auth
app.use((request, response, next) => {
  response.locals.authenticated =  request.cookies && request.cookies.authenticated
  next()
})

// Logging

app.use((request, response, next) => {
  console.log(`${Date()} -- ${request.method} ${request.path}`)
  next()
})

// JSON

app.use((request, response, next) => {
  if (request.url.endsWith(".json")) {
    res.type('json')
  }

  next()
})

// Routes

app.get("/", (request, response) => {
  response.render("index", { title: "Turbo Native Demo", page_class: "index" })
})

app.get("/one", (request, response) => {
  response.render("one", { title: "How’d You Get Here?" })
})

app.get("/two", (request, response) => {
  response.render("two", { title: "Push or Replace?", action: request.query.action })
})

app.get("/long", (request, response) => {
  response.render("long", { title: "A Really Long Page" })
})

app.get("/scroll", (request, response) => {
  response.render("scroll", { title: "Restoring Your Scroll" })
})

app.get("/follow", (request, response) => {
  response.redirect("/redirected")
})

app.get("/redirected", (request, response) => {
  response.render("redirected", { title: "Redirected Page" })
})

app.get("/reference", (request, response) => {
  response.render("reference", { title: "Reference", page_class: "index" })
})

app.get("/files", (request, response) => {
  response.render("files", { title: "Handling Files" })
})

app.get("/new", (request, response) => {
  response.render("new", { title: "A Modal Webpage" })
})

app.post("/new", (request, response) => {
  response.redirect("/success")
})

app.get("/turbo-frame-replace", (request, response) => {
  response.render("turbo-frame-replace", { title: "Turbo Frame Replace" })
})

app.get("/turbo-frame-replaced", (request, response) => {
  response.render("turbo-frame-replaced", { title: "Turbo Frame Replaced" })
})

app.get("/strada-form", (request, response) => {
  response.render("strada-form", { title: "Strada" })
})

app.post("/strada-form", (request, response) => {
  setTimeout(() => {
    response.redirect("/success")
  }, 1500)
})

app.get("/strada-menu", (request, response) => {
  response.render("strada-menu", { title: "Strada" })
})

app.get("/strada-overflow", (request, response) => {
  response.render("strada-overflow", { title: "Strada" })
})

app.get("/success", (request, response) => {
  response.render("success", { title: "It Worked!" })
})

app.get("/numbers", (request, response) => {
  response.render("numbers", { title: "A List of Numbers" })
})

app.get("/nonexistent", (request, response) => {
  response.status(404).send("Not Found")
})

app.get("/reference/turbo-drive", (request, response) => {
  response.render("turbo-drive", { title: "Turbo Drive" })
})

app.get("/reference/turbo-frames", (request, response) => {
  response.render("turbo-frames", { title: "Turbo Frames" })
})

app.get("/reference/turbo-streams", (request, response) => {
  response.render("turbo-streams", { title: "Turbo Streams" })
})

app.get("/reference/turbo-native", (request, response) => {
  response.render("turbo-native", { title: "Turbo Native" })
})

app.get("/protected", (request, response) => {
  if (response.locals.authenticated) {
    response.render("protected", { title: "Protected Webpage" })
  } else {
    response.status(401).send("Unauthorized")
  }
})

app.get("/signin", (request, response) => {
  response.render("signin", { title: "Sign In" })
})

app.post("/signin", upload.none(), (request, response) => {
  // Cookie expires in one day
  const expiration = new Date(Date.now() + 86400000)

  response.cookie("authenticated", request.body.name, { expires: expiration, httpOnly: true })
  response.redirect("/")
})

app.post("/signout", (request, response) => {
  response.clearCookie("authenticated")
  response.redirect("/")
})

app.get("/slow", (request, response) => {
  setTimeout(() => {
      response.render("slow", { title: "Slow-loading Page" })
  }, 3000)
})

app.get("/test", (request, response) => {
  response.sendStatus(200)
})

const listener = app.listen(PORT, () => {
  console.log("Server is listening on port " + listener.address().port);
})
