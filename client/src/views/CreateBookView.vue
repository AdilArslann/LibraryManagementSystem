<script setup lang="ts">
import { trpc } from '@/trpc'
import { ref } from 'vue'
import { FwbAlert, FwbButton, FwbInput } from 'flowbite-vue'
import { DEFAULT_SERVER_ERROR } from '@/consts'
import AlertError from '@/components/AlertError.vue'
import PageForm from '@/components/PageForm.vue'

const bookForm = ref({
  isbn: '',
  quantity: 1,
})

const hasSucceeded = ref(false)

const errorMessage = ref('')

async function submitBook() {
  try {
    await trpc.book.create.mutate(bookForm.value)
    errorMessage.value = ''
    hasSucceeded.value = true
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : DEFAULT_SERVER_ERROR
  }
}
</script>

<template>
  <div class="CreateBook">
    <PageForm heading="Create Book" form-label="CreateBook" @submit="submitBook">
      <FwbInput v-model="bookForm.isbn" label="ISBN" placeholder="ISBN" type="text" required />
      <label>Quantity</label>
      <input
        class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        v-model.number="bookForm.quantity"
        label="Quantity"
        type="number"
        required
        data-testid="bookQuantityInput"
        min="1"
      />

      <FwbAlert v-if="hasSucceeded" type="success" data-testid="successMessage">
        Book created successfully
      </FwbAlert>
      <AlertError :message="errorMessage">
        {{ errorMessage }}
      </AlertError>
      <FwbButton type="submit" :disabled="hasSucceeded">Create Book</FwbButton>
    </PageForm>
  </div>
</template>
