const express = require('express')
const app = express()
const http = require('http').Server(app)
const fs = require('fs')
const bodyParser = require('body-parser');
const Net = require('./train');

app.use(express.static('./static'));
app.use(bodyParser.json({ type: 'application/json' }));

const BRAIN = (new Net()).train();

app.get('/', (req, res)=>{
  res.sendFile('./static/index.html');
})

app.post('/saveSnapshot', (req, res) => {
  fs.appendFile('data.txt', JSON.stringify(req.body)+',\n', function (err) {
    if (err)
      throw err;
    console.log('saved', Date.now());
    res.status(200).send('ok');
  });

})

// app.get('/output', (req, res) => {
//   res.json();
// })

// setTimeout(()=>{
//   console.log(BRAIN.run({"i0":1,"i1":1,"i2":0,"i3":1,"i4":1,"i5":0,"i6":1,"i7":1,"i8":1,"d":2.8720035301432207,"s":0.29000000000000004}));
// }, 60000);

http.listen(3210, ()=>console.log('working...'))
