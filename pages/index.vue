<script setup lang="ts">
interface SearchApiResponse {
  items: ResultsApiResponse[]
}

interface ResultsApiResponse {
  title: string,
  link: string,
  apiSource: string
}

interface BreachApiResponse {
  breaches: [[string]],
  email: string,
}

const breachResponse = ref<BreachApiResponse | undefined>(undefined);
const searchAPIResponseRef = ref<SearchApiResponse | undefined>(undefined);

const emailInput = ref('spyrouzoe@gmail.com');
const errorMessage = ref<string | undefined>(undefined);

const resultsSection = ref<HTMLElement | null>(null);
const resultsContainer = ref<HTMLElement | null>(null);

const checkEmail = async (query: string) => {
  errorMessage.value = undefined;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(query)) {
    errorMessage.value = 'Invalid email address';
    return;
  }

  const response: any = await $fetch(`/api/xposedornot?email=${query}`,
    { ignoreResponseError: true }
  );

  breachResponse.value = response;
  if (response.statusCode && response.statusCode !== 200) {
    errorMessage.value = response.message || 'Failed to check for breaches';
  }
};

const searchResults = async () => {
  const query = emailInput.value;
  if (!query) {
    errorMessage.value = "Please input something";
    return;
  }
  // Proceed with regular search logic
  const searchQuery = `q=${encodeURIComponent(query)}`;
  const [googleData, serpapiData] = await Promise.all([
    $fetch<SearchApiResponse>(`/api/googlefake?${searchQuery}`),
    $fetch<SearchApiResponse>(`/api/serpapifake?${searchQuery}`),
    checkEmail(query)
  ]);

  searchAPIResponseRef.value = {
    items: [
      ...mapResults(googleData, "Google"),
      ...mapResults(serpapiData, "Yahoo")
    ],
  };

  nextTick(() => {
    resultsSection.value?.scrollIntoView({ behavior: 'smooth' });
  });
};

const mapResults = (response: any, apiSource: any) => {
  return response.items.map((item: any) => ({
    title: item.title,
    link: item.link,
    apiSource
  }));
}
</script>

<template>
  <div class="relative flex flex-col justify-center min-h-screen">
    <NetworkAnimation containerClass="absolute top-0 left-0 w-full h-full z-0 opacity-50" containerHeight="100%"
      :speedFactor="0.5" :numPoints="100" :maxDistance="100" />
    <!-- Background Image -->
    <NuxtImg src="/headedit.png" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      style="width: 600px; position: absolute;" />

    <div class="relative z-10 flex flex-col items-start justify-center h-full mt-20">
      <div class="font-orbiton text-white text-5xl mb-4 text-left w-full max-w-lg ml-36 mt-[-50vh]">
        <h1 class="font-semibold">
          Control your online life
        </h1>
        <p class="text-xl mt-10">
          Input your email address or username to see what information is available on you online.
        </p>
      </div>
      <div class="flex items-center mt-20 mb-4 w-full  ml-36" style="width: 480px;">
        <UInput class="border rounded-l-2xl border-orange-500 w-full" color="gray" variant="outline"
          v-model="emailInput" @keyup.enter="searchResults"
          style="border-top-right-radius: 0; border-bottom-right-radius: 0; border-top-left-radius:20rem; border-bottom-left-radius: 20rem;" />
        <UButton color="white" variant="solid"
          class="rounded-l-none dark:hover:bg-orange-500 border border-orange-500 rounded-r-2xl"
          style="border-top-right-radius:20rem; border-bottom-right-radius: 20rem;" @click="searchResults()">
          Search
        </UButton>
      </div>
    </div>
  </div>

  <!-- Search results section -->
  <div v-if="searchAPIResponseRef" ref="resultsSection"
    class="relative w-full mt-8 bg-gradient-to-b from-zinc-950 from-1% to-zinc-600">
    <div ref="resultsContainer">
      <NetworkAnimation containerClass="absolute top-0 left-0 w-full h-full z-0 opacity-100" containerHeight="100%"
        :speedFactor="1" :numPoints="400" />

      <!-- Search results content -->
      <div class="flex flex-wrap  p-24 ">
        <!-- Left Column -->
        <div class="relative z-10 space-y-4 flex-1 p-6">
          <div v-for="item in searchAPIResponseRef.items" :key="item.link"
            class="bg-white bg-opacity-90 rounded-lg shadow-md p-4 max-w-2xl">
            <h3 class="font-semibold text-lg mb-2 text-gray-800">{{ item.title }}</h3>
            <p class="text-sm text-gray-600 mb-2">Source: {{ item.apiSource }}</p>
            <NuxtLink :to="item.link" target="_blank" external class="text-blue-500 hover:underline">
              {{ item.link }}
            </NuxtLink>
          </div>
        </div>

        <!-- Right Column -->
        <!-- <div class="w-full md:w-[700px] p-8 bg-white bg-opacity-90 rounded-lg shadow-md text-gray-600"> -->
          <!-- <h3>Data Breach Information</h3> -->
          <div class="relative z-10 space-y-4 flex-1 p-6">
          <div v-for="(breach, index) in breachResponse?.breaches[0]" :key="index"
          class="bg-white text-black bg-opacity-90 rounded-lg shadow-md p-4">
            <h3>{{ breach }}</h3>
          </div>

          
          <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>

          <!-- Show error message or placeholder if no breaches found -->
          <!-- <p v-else class="text-gray-600">Enter an email to check for breaches.</p> -->
        </div>
        </div>
      </div>
    </div>
  <!-- </div> -->
</template>