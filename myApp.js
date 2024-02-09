let express = require('express');
let app = express();

absolutePath = __dirname + '/views/index.html'

app.get('/', (req, res) =>{
        res.sendFile(absolutePath);
      })
      
app.use('/public', express.static(__dirname + "/public"));

app.get("/json", (req, res) =>{
  res.send({"message": "Hello json"})
})

































 module.exports = app;
