const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/blogPageDB');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const homePageContent = "You see, your homepage needs to wear a lot of hats. Rather than treating it like a dedicated landing page built around one particular action, it should be designed to serve different audiences, from different origins. And in order to do so effectively, it needs to be built with purpose. In other words, you'll need to incorporate elements that attract traffic, educate visitors, and invite conversions"
const contactPageContent = "A Contact Us page is essential to building a brand’s website as it allows visitors to contact you easily without leaving their browser They also give you the opportunity to capture leads and improve customer service. Generally, visitors can also leave feedback or ask questions through these channels. You’ll receive valuable information about your customers’ preferences and expectations if done correctly "
const aboutUsContent = "Your 'About Us' page is perhaps the main page on your site, and it should be well crafted. This page likewise can also turn out to be the most disregarded pages, which is why you should make it stick out"

const blogSchema = new mongoose.Schema({
    title: String,
    content: String
})
const OurBlog = mongoose.model("OurBlog", blogSchema);



app.get("/", async (req, res)=>{
    const postArray = await OurBlog.find();
    console.log(postArray);
    res.render("home", {
        startingContent: homePageContent,
        postArray: postArray
    })
})

app.get("/about", (req, res)=>{
    res.render("about", {
        aboutStartContent: aboutUsContent
    })
})

app.get("/contact", (req, res)=>{
    res.render("contact", {
        contactStartContent: contactPageContent
    })
})

app.get("/posts", async (req, res)=>{
    const postArray = await OurBlog.find();
    console.log(postArray)
    res.render("posts", {
        posts: postArray
    })
})

app.get("/compose", (req, res)=>{
    res.render("compose")
})




app.get("/posts/:customID", async (req, res)=>{
    const requestedPost = req.params.customID;
    const thatPost = await OurBlog.findOne({_id: requestedPost});
    res.render("post", {
        postTitle: thatPost.title,
        postContent: thatPost.content
    })

})



// post request at the compose page
app.post("/compose", (req, res)=>{
    const reqTitle = req.body.postTitle;
    const reqContent = req.body.postText;
  
    const newPost = new OurBlog({
        title: reqTitle,
        content: reqContent
    })
    newPost.save();
    // redirecting it to the home route after submitting the post
    res.redirect("/");
});


app.post("/delete", async (req, res)=>{
    reqDeleteID = req.body.deleteID;
    await OurBlog.deleteOne({
        _id: reqDeleteID
    })
    res.redirect("/posts");
})


app.listen(3000, function() {
    console.log("Server started on port 3000");
});
  