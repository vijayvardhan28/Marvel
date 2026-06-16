const query = async (name) => {
  const r = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(name)}`);
  const d = await r.json();
  if (d.length === 0) return;
  const show = d[0].show;
  console.log('SHOW:', name, '->', show.name, show.image?.original);
  const r2 = await fetch(`https://api.tvmaze.com/shows/${show.id}/seasons`);
  const seasons = await r2.json();
  seasons.forEach(s => {
    console.log('  Season', s.number, ':', s.image?.original);
  });
};
(async () => {
  await query('What If');
  await query('I Am Groot');
  await query('X-Men 97');
  await query('Eyes of Wakanda');
  await query('Marvel Zombies');
})();
