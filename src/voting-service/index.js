const express = require('express')
const bodyParser = require('body-parser');
const storage = require('node-persist');
const morgan = require('morgan');

// configure middleware
const app = express()
app.use(bodyParser.json());
morgan.token('body', (req, res) => { return req.body ? JSON.stringify(req.body) : ''; });
app.use(morgan('HTTP/:http-version :method :url :body :status'));

// storage
storage.init();
const votesStoreKey = 'votes';

app.get('/vote', async (req, res) => {
  const votes = await storage.getItem(votesStoreKey);
  res.send(votes);
});

app.post('/vote', async (req, res) => {
  try {
    /*
      votes: {
        'Skaffold': 1,
        'Jib': 3,
        'None of the Above': 0
      }
    */
    const votes = await storage.getItem(votesStoreKey) || {};

    const postedVotes = Object.keys(req.body);
    for (var name of postedVotes) {
      votes[name] = votes[name] ? votes[name] + 1 : 1;
    }
  
    await storage.setItem(votesStoreKey, votes);
    res.send(votes);
  } catch(e) {
    res.status(500).send(e.message);
  }
})

app.listen(8080, () => console.log('Nodejs Voting service listening on port 8080!'))