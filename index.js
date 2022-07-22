require('dotenv').config();
const express = require('express');
const cors = require('cors');
var shortId = require('shortid');
var Url = require('./connection')
const app = express();

const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
const checkLink= (req,res,next)=>{
  Url.findOne({original_url: req.body.url}, function (err, urlFound){ 
    if (urlFound){
      return res.json({original_url:urlFound.original_url, short_url: urlFound.short_url})
    }
    else{
      next()
    }
  })
}
function isValidHttpUrl(string) {
  let url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }


  return url.protocol === "http:" || url.protocol === "https:";
}
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/hello',function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post ("/api/shorturl",checkLink, function(req,res){
  if (isValidHttpUrl(req.body.url)){
      var new_data = new Url({original_url: req.body.url, short_url: shortId.generate()})
      new_data.save(function(err, data) {
        if (err) return res.send(err);
        return res.json({original_url: data.original_url, short_url: data.short_url})
      });


}
  else{
    res.json({ error: 'Invalid url' })
  }
})

app.get("/api/shorturl/:shorturl", function(req,res){
  const shorturl=req.params.shorturl
  if (shorturl){
    Url.findOne({short_url: shorturl}, function (err, urlFound) {
      if (err) return res.send(err);
      return res.redirect(urlFound.original_url)
    });
}
else{
  res.status(400).send("Invalid shorturl")
}
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
