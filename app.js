require("dotenv").config();
const { urlencoded } = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const ejs = require("ejs");
const url = require("./models/url");
const shortenLength = process.env.SHORTEN_LENGTH;
const options = {
  originalUrl: undefined,
  shortUrl: undefined
}

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to the database...");
  } catch (err) {
    console.error(`Error in connecting to the database:- ${err}`);
    process.exit(1);
  }
};

const app = express();
connectDatabase();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.listen(process.env.port || 3000, () => {
  console.log("Server started!");
});

app.get("/errorPage", (req,res)=> {
  res.render("error");    
})

app.get("/", (req, res) => {
  console.log(" [ GET / ] ");
  res.render("index", options);
});

app.post("/shorten", async (req, res) => {
  console.log(" [ POST /shorten ] ");
  console.log(req.body)
  if(req.body.reset){
    console.log("Resetting...")
    options.originalUrl = undefined;
    options.shortUrl = undefined;
    res.redirect("/");
    return;
  }
  const originalUrl = req.body.originalUrl;
  url.findOne({ original: originalUrl }, async  (err, result) => {
    if (result) {
      console.log("Already processed url...");
      console.log(result);
      options.originalUrl = originalUrl;
      options.shortUrl = result.shortened;
      res.redirect("/");
      return;
    } else {
      const shortUrl =  req.headers.host + "/" + nanoid(shortenLength);
      const doc = new url({ original: originalUrl, shortened: shortUrl });
      await doc.save();
      console.log("Shortened the url");
      options.originalUrl = originalUrl;
      options.shortUrl = shortUrl;
      res.redirect("/");
      return;
    }
  });
});

app.get("/:shortUrl", async (req, res) => {
  console.log(` [ GET /${req.params.shortUrl} ] `);
  // since complete url including hostname is stored in the database
  let shortUrl =  req.headers.host + "/" + req.params.shortUrl;
  url.findOne({ shortened: shortUrl },async  (err, result) => {
    if (!err) {
      if(!result){
          console.error("Invalid short URL!");
          res.redirect("errorPage");
      }
      console.log("Redirecting...");
      result.clicks++;
      await result.save();
      res.redirect(result.original);
      return;
    } else {
      console.error("Invalid url... --> ", error);
      res.render("error");
      return;
    }
  });
});

