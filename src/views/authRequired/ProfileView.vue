<template>
  <h2 class="mb-7">Profil</h2>

  <UserData />
  <ResetPassword :changePassword="true" />
</template>

<script setup>
import UserData from '@/components/auth/UserData.vue'
import ResetPassword from '@/components/auth/ResetPassword.vue'
</script>

<style></style>
