import { getJson } from "serpapi";

export default defineEventHandler(async (event) => {
  const { q } = getQuery(event);

  const apiKey = process.env.SERP_API_KEY;

  try {
    const response = await getJson({
      engine: "yahoo",
      p: q,
      api_key: apiKey,
    });

    const transformedResponse = {
      apiSource: "Yahoo",
      items: response.omrganic_results.map((result: any) => ({
        title: result.title,
        link: result.link,
      })),
      queries: {
        request: [{
          title: { q },
          searchTerms: q
        }]
      }
    };

    return transformedResponse;
  } catch (error) {
    console.error("Error fetching SerpApi results:", error);
    throw new Error("Failed to fetch SerpApi search results");
  }
})

