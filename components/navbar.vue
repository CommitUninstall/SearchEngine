<template>
  <div class="bg-zinc-900 shadow-md">
    <nav class="flex justify-between items-center h-14 px-10">
      <div class="flex space-x-8 h-full">
        <RouterLink 
          v-for="link in links" 
          :key="link.to" 
          :to="link.to" 
          class="group relative h-full flex items-center"
        >
          <span class="group-hover:bg-orange-500 absolute inset-0 h-full w-full transition-colors duration-300"></span>
          <span class="relative z-10 text-gray-300 px-3 py-2 group-hover:text-zinc-900 transition-colors duration-300">{{ link.label }}</span>
        </RouterLink>
      </div>
      <RouterLink 
        to="/legal-disclaimer" 
        class="group relative h-full flex items-center"
      >
        <span class="group-hover:bg-orange-500 absolute inset-0 h-full w-full transition-colors duration-300"></span>
        <span class="relative z-10 text-gray-300 px-3 py-2 group-hover:text-zinc-900 transition-colors duration-300">Legal Disclaimer</span>
      </RouterLink>
    </nav>
  </div>
</template>

<script lang="ts" setup>
const links = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' }
] 
</script>
