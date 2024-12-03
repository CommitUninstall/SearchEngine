export default defineEventHandler(async (event) => {
    const { q } = getQuery(event);
    
    const apiKey = process.env.GOOGLE_API_KEY;
    const cx = '8194329901e7c4e5b';
  
    const apiURL = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(q!.toString())}`;
    const response : any = await $fetch(apiURL);
    response.apiSource = "Google";

    return response;
});
