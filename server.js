const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const app = express()
const env = require('dotenv')
const methodOverride = require('method-override')
// import Routers
const articleRouter = require('./routes/articles')

env.config()
// connect to db
//mongodb+srv://rooter:<password>@cluster0.zkw6i.mongodb.net/<dbname>?retryWrites=true&w=majority
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.zkw6i.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
  )
  .then(() => {
    console.log('Database connected')
  })

// convert ejs code to html
app.set('view engine', 'ejs')

//to parse the json file, req.body
// app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

// use the routes

app.get('/', async (req, res) => {
  const articles = await Article.find()
  res.render('articles/index', { articles: articles })
})
app.use('/articles', articleRouter)

app.listen(process.env.PORT)
