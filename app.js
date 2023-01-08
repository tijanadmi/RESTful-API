//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/WikiDB");

const articlesSchema=  {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articlesSchema);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.route('/articles')
  .get((req, res) => {
    Article.find({},function(err, foundArticles){
        if (err){
            console.log(err);
        } else {
            res.send(foundArticles);    
        }
    });
  })
  .post((req, res) => {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    
    newArticle.save(function (err) {
        if (!err){
            res.send("Successfully added a new article.");
        } else {
            res.send(err);
        }
      });
  })
  .delete((req, res) => {
    Article.deleteMany(function(err){
        if (err){
            res.send(err);
        } else {
            res.send("Succesfully deleted all articles.")
        }
    });
  });

  app.route('/articles/:articleTitle')
  .get((req, res) => {
    
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if (foundArticle){
            res.send(foundArticle);
        } else {
            res.send("No article matching that title was found.");
        }
    });
  })
  .put((req, res) => {
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        function(err){
            if (!err){
                res.send("Successfully updated article.")
            } else {
                res.send(err);
            }
        }
    )
  })
  .patch((req, res) => {
    Article.updateOne(
        {title: req.params.articleTitle},
        {content: req.body.content},
        function(err){
            if (!err){
                res.send("Successfully updated the content for the selected article.")
            } else {
                res.send(err);
            }
        }
    )
  })
  .delete((req, res) => {
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if (!err){
                res.send("Successfully delete article.")
            } else {
                res.send(err);
            }
        }
    )
  });
/*app.get("/articles", function(req, res){
    
    Article.find({},function(err, foundArticles){
        if (err){
            console.log(err);
        } else {
            res.send(foundArticles);    
        }
    });
});

app.post("/articles", function(req, res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    
    newArticle.save(function (err) {
        if (!err){
            res.send("Successfully added a new article.");
        } else {
            res.send(err);
        }
      });
});

app.delete("/articles", function(req, res){
    Article.deleteMany(function(err){
        if (err){
            res.send(err);
        } else {
            res.send("Succesfully deleted all articles.")
        }
    });
});*/

app.listen(3000, function() {
  console.log("Server started on port 3000");
});