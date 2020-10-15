const express = require('express')
const Article = require('../models/article')
const router = express.Router()

router.get('/new', (req, res) => {
  res.render('articles/new', { article: new Article() })
  //   a blank default article
})

// render edit page
router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render('articles/edit', { article: article })
  //   a blank default article
})

//   edit
router.put(
  '/:id',
  async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
  },
  saveArticleAndRedirect('edit'),
)

router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  console.log(article.title)
  if (article == null) res.redirect('/')
  res.render('articles/show', { article: article })
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    try {
      article = await article.save()
      console.log(article.slug)
      res.redirect(`/articles/${article.slug}`)
    } catch (err) {
      console.error(err.message)
      res.render(`/articles/${path}`, { article: article })
    }
  }
}

router.post(
  '/',
  (async = (req, res, next) => {
    req.article = new Article()
    next()
  }),
  saveArticleAndRedirect('new'),
)

router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')
})
module.exports = router
