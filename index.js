require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const DNS = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded( {extended: false} ));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// store urls with id
const URLs = [];

// short url id
let id = 0;

app.post('/api/shorturl', function(req, res){
    const { url: _url } = req.body;

    if(_url === ""){
        return res.json({
            "error": "invalid url"
        });
    }

    let parsed_url;
    const modified_url = _url.replace(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/, '');

    try{
        parsed_url = new URL(_url);
    }catch(err){
        return res.json({
            "error": "invalid url"
        });
    }

    DNS.lookup(modified_url, function(err){
        if(err){
            return res.json({
                "error": "invalid url"
            });
        }else{
            ++id;

            const url_object = {
                "original_url": _url,
                "short_url": `${id}`
            };

            URLs.push(url_object);

            return res.json({"original_url": _url, "short_url": `${id}`});
        }
    });
});

app.get('/api/shorturl/:id', function(req, res){
    const { id: _id } = req.params;

    // find if id already exist
    const short_link = URLs.find(find => find.short_url === _id);

    if(short_link){
        return res.redirect(short_link.original_url);
    }else{
        return res.json({
            "error": "invalid url"
        });
    }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
