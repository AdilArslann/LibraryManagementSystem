<script lang="ts" setup>
import { trpc } from '@/trpc'
import { onBeforeMount, ref, watchEffect } from 'vue'
import { FwbAlert, FwbPagination } from 'flowbite-vue'
import type { BookShowcase } from '@mono/server/src/shared/entities'
import Book from '@/components/Book.vue'
// If we want to get a type error at the place of assignment of
// projects.values, then we would declare the type of projects explicitly:
const books = ref<BookShowcase[]>([])
const totalPages = ref(1)
const currentPage = ref(1)
// If we wanted to get a type error at the place of usage of non-existent
// or incorrectly typed properties, then we would declare the
// type of projects simply as being whatever the query returns:
// const projects = ref<Awaited<ReturnType<typeof trpc.project.find.query>>>([])

watchEffect(async () => {
  books.value = await trpc.book.get.query({ page: currentPage.value - 1 })
})
onBeforeMount(async () => {
  books.value = await trpc.book.get.query({ page: currentPage.value - 1 })
  totalPages.value = await trpc.book.getPageNumber.query()
})
</script>

<template>
  <div class="DashboardView">
    <div v-if="books.length" class="bookList" data-testid="bookList">
      <Book v-for="book in books" :key="book.id" :book="book" />
    </div>
    <FwbAlert v-else data-testid="bookListEmpty">There are no books</FwbAlert>
    <fwb-pagination v-if="totalPages > 1" v-model="currentPage" :totalPages="totalPages"></fwb-pagination>
  </div>
</template>


<style scoped>
.bookList {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: .5rem;
  overflow: hidden;
}

.DashboardView {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>