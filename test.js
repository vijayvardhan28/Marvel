const http = require('https');
const { mcuData } = require('./src/data/mcuData.js');

function fetchPath(title) {
  return new Promise((resolve) => {
    const query = encodeURIComponent(title);
    http.get(`https://www.themoviedb.org/search?query=${query}`, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const match = d.match(/\/t\/p\/w[0-9]+_and_h[0-9]+_bestv2(\/[^\"]+\.jpg)/);
        if (match) {
          resolve(match[1]);
        } else {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  const path = await fetchPath('Iron Man');
  console.log(path);
}
run();
