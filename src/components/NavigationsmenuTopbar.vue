<script setup>
import { ref } from 'vue'

const menuHidden = ref(true)

function toggleMenu() {
  menuHidden.value = !menuHidden.value
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-div">
      <a href="https://flowbite.com/" class="navbar-icon">
        <img src="../../assets/pimoo_3logos.png" class="h-8" alt="Flowbite Logo" />
        <span class="navbar-title"></span>
      </a>
      <button
        data-collapse-toggle="navbar-default"
        type="button"
        class="navbar-button"
        aria-controls="navbar-default"
        aria-expanded="false"
        @click="toggleMenu"
      >
        <span class="sr-only">Open main menu</span>
        <svg
          class="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 17 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </button>
      <div
        class="w-full md:block md:w-auto"
        :class="menuHidden ? '' : 'hidden'"
        id="navbar-default"
      >
        <ul class="navbar-items-ul">
          <li>
            <RouterLink class="navbar-item" to="/">Startseite</RouterLink>
          </li>
          <li>
            <RouterLink class="navbar-item" to="/ueber-das-tool">Über das Tool</RouterLink>
          </li>
          <li>
            <RouterLink class="navbar-item" to="/auth/anmelden" mode="outline">Anmelden</RouterLink>
          </li>
          <li>
            <RouterLink class="navbar-item" to="/auth/registrieren">Registrieren</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  @apply bg-gray-100 border-gray-200 dark:bg-gray-900 mb-8;
}
.navbar-div {
  @apply max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4;
}
.navbar-icon {
  @apply flex items-center space-x-3 rtl:space-x-reverse;
}
.navbar-title {
  @apply self-center text-2xl font-semibold whitespace-nowrap dark:text-white;
}
.navbar-button {
  @apply inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600;
}

.navbar-items-ul {
  @apply font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-100 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-gray-100 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700;
}
.navbar-item {
  @apply block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent;
}

.router-link-active,
.router-link-exact-active {
  @apply block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500;
}
</style>
