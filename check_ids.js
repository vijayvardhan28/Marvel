import { allMediaData } from './src/data/allData.js';

const idSet = new Set();
const duplicates = [];

allMediaData.forEach(item => {
  if (idSet.has(item.id)) {
    duplicates.push(item.id);
  }
  idSet.add(item.id);
});

console.log("Duplicate IDs:", duplicates);
