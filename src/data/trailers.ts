// Curated official high-definition YouTube trailer keys for popular cinema and series
export const CURATED_TRAILERS: Record<string, string> = {
  // Movies
  'inception': 'YoHD9XEInc0',
  'interstellar': 'zSWdZVtXT7E',
  'coherence': 'sEceDz1Rodc',
  'dune': 'Way9Dexny3w',
  'dune: part two': 'Way9Dexny3w',
  'oppenheimer': 'uYPbbksJxIg',
  'the dark knight': 'EXeTwQWrcwY',
  'parasite': '5xH0RZE7V4Y',
  'blade runner 2049': 'gCcx85zbxz4',
  'spider-man: across the spider-verse': 'cqGjhVJWtEg',
  'everything everywhere all at once': 'wxN1T1uxQ2g',
  'whiplash': '7d_jQycdQGo',
  'the matrix': 'vKQi3bBA1y8',
  'pulp fiction': 's7EdQ4FqbhY',
  'spirited away': 'ByXuk9QqQkk',
  'fight club': 'qtRKdVHc-cE',
  'la la land': '0pdqf4P9MB8',
  'gladiator': 'P5ieIbInFpg',
  'alien: romulus': 'x0XDEhP4MQs',
  'deadpool & wolverine': '73_1biulkYk',
  'twisters': 'Jff4p57QQOE',
  'furiosa: a mad max saga': 'XJMuhwVlca4',
  'civil war': 'aDyQxtg0V2w',
  'the substance': 'LNlrGhPdnkE',
  'challengers': 'VobTTb-ET4Q',
  'poor things': 'RlbR5N6veqw',
  'past lives': 'kA244xewjcI',
  'anatomy of a fall': 'fTrsp5BMloA',
  'zone of interest': 'GFknTGw0pZ4',

  // TV Series
  'severance': 'xEQP4VVuyrY',
  'succession': 'ozhkydwJgB0',
  'the bear': 'y-cqq38vK-A',
  'shōgun': 'yKiIielqAbI',
  'shogun': 'yKiIielqAbI',
  'arcane': 'fXmAurh012s',
  'breaking bad': 'HhesaQXLuRY',
  'better call saul': 'HN4oydykJFc',
  'game of thrones': 'KPLWWIOCOOQ',
  'house of the dragon': 'DotnJ7tTA34',
  'the last of us': 'uLtkt8BonwM',
  'stranger things': 'b9EkMc79ZSU',
  'dark': 'rrwycJ08PSA',
  'true detective': 'fVQUcaO4AvE',
  'chernobyl': 's9APLXM9Ei8',
  'fargo': 'a3_GZrqh3l8',
  'ted lasso': '3u7EIiohs6U',
  'the crown': 'JWtnJjn6G0Q',
  'perfect crown': '4zH5iYM4wJo',
  'squid game': 'oqxAJKy0ii4',
  'the penguin': 'sfJM_aW8w6g',
  'fallout': 'V-mugKDQDlg',
  'the boys': '06rueu_fh30',
  'mindhunter': '7gZCfRD_ChE',
  'fleabag': 'I5Uv6Cb9fGs',
  'silo': '8ZYhuvIv1pA',
  'slow horses': 'O6rFqFqUf0k',
};

export function getFallbackTrailerKey(title: string): string {
  const norm = title.toLowerCase().trim();
  if (CURATED_TRAILERS[norm]) return CURATED_TRAILERS[norm];

  for (const [key, trailer] of Object.entries(CURATED_TRAILERS)) {
    if (norm.includes(key) || key.includes(norm)) {
      return trailer;
    }
  }

  // Fallback to cinematic high-concept trailer
  return 'YoHD9XEInc0'; // Inception iconic trailer
}
