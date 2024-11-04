<script setup lang="ts">

interface SearchApiResponse {
  kind: string;
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
}

const responseRef = ref<SearchApiResponse | undefined>(undefined);
const textbox = ref('');
const errorMessage = ref('');

const searchResults = async (query: string) => {
  console.log('searchResults');
  try {
    errorMessage.value = '';
    textbox.value = '';

    // Check if the search is empty
    if (query != null) {
      console.log('query is ', query)
      query = `q=${query}`;
      //It is not empty, add results to a list 
      let data = await $fetch<SearchApiResponse>(`/api/googlefake?${query}`);
      data.items = data.items.filter((item) => item.title && item.link);
      responseRef.value = data;
      console.log(data.items);

    } else {
      console.log('empty')
      return "Please input something";
    }
  }
  catch (error) {
    console.error("Failed to get search results:", error);
  }
}

</script>

<template>
  <div class="relative flex flex-col justify-center min-h-screen">
    <!-- Background Image -->
    <NuxtImg src="/headedit.png" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      style="width: 600px;" />

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
      <!-- Logic for return of results -->
      <div v-if="!!responseRef">
        <div class="bg-orange-500 p-6 rounded-s text-white bg-opacity-50 ">
          <div v-for="item in responseRef.items" class="text-white">
            {{ item.title }}  {{ item.link }}
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<style></style>
