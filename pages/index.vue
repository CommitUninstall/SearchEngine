<script setup lang="ts">

interface SearchApiResponse {
  items: ResultsApiResponse[];
  queries: {
    request: [
      {
        title: string | null,
        searchTerms: string

      }
    ]
  }
}

interface ResultsApiResponse {
  title: string;
  link: string;
  apiSource: "Google" | "Yahoo" | "Yandex";
}


interface BreachApiResponse {
  kind: string;
  items: BreachResponse[];
  queries: {
    request: [
      name: string,
      description: string
    ]
  }
}

interface BreachResponse {
  name: string;
  description: string;

}


const breachResponse = ref<BreachResponse[]>([]);
const responseRef = ref<SearchApiResponse | undefined>(undefined);
const textbox = ref('');
const errorMessage = ref('');
const resultsSection = ref<HTMLElement | null>(null);
const resultsContainer = ref<HTMLElement | null>(null);
const containerHeight = ref('100%');

const checkEmail = async (query: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailRegex.test(query)) {
    try {
      const breachData = await $fetch<BreachApiResponse>(`/api/haveibeenpwned?email=${encodeURIComponent(query)}`);
      breachResponse.value = breachData.items; // Update breachResponse with the fetched data (an array)
      console.log("test");
      console.log(breachData);  // For debugging, remove in production
    } catch (error) {
      console.error('Failed to fetch breach data:', error);
      errorMessage.value = 'Failed to fetch breach data'; // Error handling
    }
  } else {
    console.log('Invalid email address');
    errorMessage.value = 'Invalid email address'; // Error handling for invalid email
  }
};

const searchResults = async (query: string) => {
  console.log('searchResults');
  try {
    errorMessage.value = '';

    if (!query) {
      console.log('empty');
      errorMessage.value = "Please input something";
      return;
    }
    checkEmail(query);

    // Proceed with regular search logic
    const searchQuery = `q=${encodeURIComponent(query)}`;

    let googleData = await $fetch<SearchApiResponse>(`/api/google?${searchQuery}`);
    googleData.items = googleData.items.filter((item) => item.title && item.link)
      .map((item) => ({
        ...item,
        apiSource: 'Google'
      }));

    let serpapiData = await $fetch<SearchApiResponse>(`/api/serpapi?${searchQuery}`);
    serpapiData.items = serpapiData.items.filter((item) => item.title && item.link)
      .map((item) => ({
        ...item,
        apiSource: 'Yahoo'
      }));

    responseRef.value = {
      items: [...googleData.items, ...serpapiData.items],
      queries: {
        request: [
          {
            title: `Combined search for ${query}`,
            searchTerms: query,
          },
        ],
      },
    };

    nextTick(() => {
      if (resultsSection.value) {
        resultsSection.value.scrollIntoView({ behavior: 'smooth' });
      }
    });

  } catch (error) {
    console.error("Failed to get search results:", error);
  }
};

</script>

<template>
  <div class="relative flex flex-col justify-center min-h-screen">
    <NetworkAnimation containerClass="absolute top-0 left-0 w-full h-full z-0 opacity-50"
      :containerHeight="containerHeight" :speedFactor="0.5" :numPoints="100" :maxDistance="100" />
    <!-- Background Image -->
    <NuxtImg src="/headedit.png" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      style="width: 600px; position: absolute;" />

    <div class="relative z-10 flex flex-col items-start justify-center h-full mt-20">
      <div class="  font-orbiton text-white text-5xl mb-4 text-left w-full max-w-lg ml-36 mt-[-50vh]">
        <h1 class="font-semibold">
          Control your online life
        </h1>
        <p class="text-xl mt-10">
          Input your email address or username to see what information is available on you online.
        </p>
      </div>
      <div class="flex items-center mt-20 mb-4 w-full  ml-36" style="width: 480px;">
        <UInput class="border rounded-l-2xl border-orange-500 w-full" color="gray" variant="outline"
          placeholder="Search..." v-model="textbox"
          style="border-top-right-radius: 0; border-bottom-right-radius: 0; border-top-left-radius:20rem; border-bottom-left-radius: 20rem;" />
        <UButton color="white" variant="solid"
          class="rounded-l-none dark:hover:bg-orange-500 border border-orange-500 rounded-r-2xl"
          style="border-top-right-radius:20rem; border-bottom-right-radius: 20rem;" @click="searchResults(textbox)">
          Search
        </UButton>
      </div>
    </div>
  </div>

 <!-- Search results section -->
 <div v-if="responseRef" ref="resultsSection" class="relative w-full mt-8 bg-gradient-to-b from-zinc-950 from-1% to-zinc-600">
      <div ref="resultsContainer" class="relative">
        <NetworkAnimation 
          containerClass="absolute top-0 left-0 w-full h-full z-0 opacity-100" 
          :containerHeight="containerHeight"
          :speedFactor="2"
          :numPoints="400"
        />
        
        <!-- Search results content -->
        <div class="relative z-10 space-y-4 p-6">
          <div v-for="item in responseRef.items" :key="item.link" class="bg-white bg-opacity-90 rounded-lg shadow-md p-4 max-w-2xl mx-auto">
            <h3 class="font-semibold text-lg mb-2 text-gray-800">{{ item.title }}</h3>
            <p class="text-sm text-gray-600 mb-2">Source: {{ item.apiSource }}</p>
            <NuxtLink 
              :to="item.link" 
              target="_blank" 
              external
              class="text-blue-500 hover:underline"
            >
              {{ item.link }}
            </NuxtLink>
          </div>
        </div>
    </div>
  </div>

   <!-- Right Column for Breach Information -->
   <!-- <div class="w-full md:w-[300px] p-6 bg-white bg-opacity-90 rounded-lg shadow-md">
    <h3 class="font-semibold text-lg mb-2">Data Breach Information</h3> -->

    <!-- Loop through breaches if available -->
    <!-- <div v-if="!!breachResponse" v-for="(breach, index) in breachResponse" :key="index"
      class="bg-white bg-opacity-90 rounded-lg shadow-md p-4 max-w-xl mx-auto">
      <h3 class="font-semibold text-lg mb-2 text-gray-800">{{ breach.name }}</h3>
      <p class="text-sm text-gray-600">{{ breach.description }}</p>
    </div> -->

    <!-- Show error message or placeholder if no breaches found -->
    <!-- <p v-else-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
    <p v-else class="text-gray-600">Enter an email to check for breaches.</p>
  </div> -->
</template>


<style></style>
