export default defineEventHandler(async (event) => {
  const {email} = getQuery(event);
  const encodedEmail = encodeURIComponent(email!.toString());

  const apiURL = `https://api.xposedornot.com/v1/check-email/${encodedEmail}`;
  console.log(apiURL);

  try{
    const response = await $fetch(apiURL);
    return response;
  } catch(error) {
    // 404
    setResponseStatus(event, 404);
    return new Error('Email not found');
    // console.error('Error fetching query:', error);
  }
})
