<template>
  <div>
    <h1 class="mb-7">Profil</h1>

    <UserData />
    <ResetPassword :changePassword="true" />
  </div>
</template>

<script setup>
import UserData from '@/components/auth/UserData.vue'
import ResetPassword from '@/components/auth/ResetPassword.vue'
</script>

<style></style>
