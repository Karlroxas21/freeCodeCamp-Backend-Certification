let express = require('express');
let app = express();

absolutePath = __dirname + '/views/index.html'

app.get('/', (req, res) =>{
        res.sendFile(absolutePath);
      })
      
app.use('/public', express.static(__dirname + "/public"));


































 module.exports = app;
