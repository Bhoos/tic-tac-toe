import http from 'http';
import {mcts} from './mcts.js';

const server = http.createServer((req, res) => {
  if (req.url) res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.end();
    return;
  }

  let payload = '';
  req.on('data', chunk => {
    payload += chunk;
  });

  req.on('end', () => {
    let result = { error: 'Unknown request' };
    if (req.url.endsWith('play')) {
      console.log('Got play request');
      result = play(JSON.parse(payload));
    } else {
      console.log('Got unknown request');
    }

    res.write(JSON.stringify(result));
    res.end();
  });
});

function play(payload) {
  const { turn, state } = payload;
  return mcts(payload.state, payload.turn);
  let row = -1;
  let col = -1;
  let tries = 0;
  do {
    row = Math.floor(Math.random() * 3);
    col = Math.floor(Math.random() * 3);
    tries += 1;
  } while (state[row][col] !== '' && tries < 100)
  return { row, col };
}

server.listen(7777);