export default defineEventHandler(async (event) => {
    const { q } = getQuery(event);
    
    const apiKey = process.env.GOOGLE_API_KEY;
    const cx = '8194329901e7c4e5b';
  
    const apiURL = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(q!.toString())}`;
  
    try {
        const response = await $fetch(apiURL);
        return response;
    } catch (error) {
        console.error('Error fetching query:', error);
        throw new Error('Failed to fetch query');
    }
});
