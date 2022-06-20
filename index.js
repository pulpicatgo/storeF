const express = require('express');
const app = express();
let cors = require('cors');
const bodyparser = require('body-parser');

app.use(cors());
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:false}));
app.use(express.static(process.cwd()+"/storeF/dist/store-f/"))

app.use(require('./routes/correoRoutes'));

app.get('/', (req,res) => {
    res.sendFile(process.cwd()+"/storeF/dist/store-f/index.html")
  });

app.listen('3080',()=>{
    console.log('server listening on port 3080');
})