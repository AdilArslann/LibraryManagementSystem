<script setup lang="ts">
import { trpc } from '@/trpc'
import { ref } from 'vue'
import { FwbAlert, FwbButton, FwbInput } from 'flowbite-vue'
import { DEFAULT_SERVER_ERROR } from '@/consts'
import AlertError from '@/components/AlertError.vue'
import PageForm from '@/components/PageForm.vue'

const schoolForm = ref({
  name: '',
  address: '',
  phone: '',
  email: '',
})

const hasSucceeded = ref(false)

const errorMessage = ref('')

async function submitSchool() {
  try {
    await trpc.school.create.mutate(schoolForm.value)
    errorMessage.value = ''
    hasSucceeded.value = true
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : DEFAULT_SERVER_ERROR
  }
}


</script>


<template>
  <div class="CreateSchool">
    <PageForm heading="Create school" form-label="CreateSchool" @submit="submitSchool">
      <FwbInput v-model="schoolForm.name" label="Name" placeholder="Name" type="text" required />
      <FwbInput v-model="schoolForm.address" label="Address" placeholder="Address" type="text" required />
      <FwbInput v-model="schoolForm.phone" label="Phone" placeholder="Phone" type="text" required />
      <FwbInput v-model="schoolForm.email" label="Email" placeholder="Email" type="email" required />

      <FwbAlert v-if="hasSucceeded" type="success" data-testid="successMessage">
        <p>School created successfully</p>
      </FwbAlert>
      <AlertError :message="errorMessage">
        {{ errorMessage }}
      </AlertError>

      <FwbButton type="submit" :disabled="hasSucceeded">Create School</FwbButton>
    </PageForm>
  </div>
</template>