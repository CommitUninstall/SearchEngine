const googleFake = import('~/public/google.json');

export default defineEventHandler(async (event) => {
   return googleFake;
});
