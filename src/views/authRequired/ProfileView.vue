<template>
  <div>
    <BaseHeading>Profil</BaseHeading>

    <UserData />
    <ResetPassword :changePassword="true" />
  </div>
</template>

<script setup>
import UserData from '@/components/auth/UserData.vue'
import ResetPassword from '@/components/auth/ResetPassword.vue'
</script>

<style></style>
