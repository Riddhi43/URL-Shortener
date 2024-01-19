const express = require('express');
const bodyParser = require('body-parser');
var QRCode = require('qrcode');
const shortid = require('shortid');

const app = express();
const port = process.env.PORT || 3000;

const urlDatabase = {};

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {    
    res.render('index')
})

app.post('/', (req, res) => {
    const longUrl = req.body.data;
    const shortId = shortid.generate();
    const shortUrl = shortId;

    urlDatabase[shortId] = longUrl;

    QRCode.toDataURL(longUrl, (err, src) => {
        if (err) {
          console.error('Error generating QR code:', err);
          res.status(500).send('Internal Server Error');
        } else {
          res.render('index', { shortUrl, src }); 
        }
      });
})

app.get('/:shortId', (req, res) => {
    const shortId = req.params.shortId;
    const longUrl = urlDatabase[shortId];
  
    if (longUrl) {
      res.redirect(longUrl);
    } else {
      res.status(404).send('URL not found');
    }
  })
  
app.listen (port, function () {
    console.log(`Server running on port ${port}`);
})

