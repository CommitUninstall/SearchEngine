const serpapiFake = import('~/public/serpapi.json');

export default defineEventHandler(async (event) => {
   return serpapiFake;
});
