<script lang="ts" setup>
import { trpc } from '@/trpc'
import { onBeforeMount, ref, watchEffect } from 'vue'
import { FwbAlert, FwbPagination, FwbButton, FwbInput } from 'flowbite-vue'
import type { BookShowcase } from '@mono/server/src/shared/entities'
import Book from '@/components/Book.vue'
// If we want to get a type error at the place of assignment of
// projects.values, then we would declare the type of projects explicitly:
const books = ref<BookShowcase[]>([])
const totalPages = ref(1)
const currentPage = ref(1)
const query = ref('')
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
const search = async () => {
  books.value = await trpc.book.get.query({ title: query.value, page: 0 })
}
</script>

<template>
  <div class="DashboardView">
    <div class="dashboardMain">
      <div v-if="books.length" class="bookList" data-testid="bookList">
        <Book v-for="book in books" :key="book.id" :book="book" />
      </div>
      <div class="searchColumn">
        <fwb-input v-model="query" placeholder=" Enter Book Title" size="lg">
          <template #prefix>
            <svg
              aria-hidden="true"
              class="h-5 w-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </template>
          <template #suffix>
            <fwb-button @click="search">Search</fwb-button>
          </template>
        </fwb-input>
      </div>
    </div>
    <FwbAlert v-if="!books.length" data-testid="bookListEmpty">There are no books</FwbAlert>
    <fwb-pagination
      v-if="totalPages > 1"
      v-model="currentPage"
      :totalPages="totalPages"
    ></fwb-pagination>
  </div>
</template>

<style scoped>
.dashboardMain {
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
}

.bookList {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  overflow: hidden;
}

.DashboardView {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.searchColumn {
  display: flex;
  width: 100%;
  justify-content: center;
}

@media (width >=768px) {
  .dashboardMain {
    width: 100%;
  }

  .searchColumn {
    flex-direction: column;
    width: 30%;
    height: 100%;
    align-items: flex-end;
    align-self: flex-end;
    justify-content: flex-start;
  }

  .bookList {
    width: 70%;
  }
}
</style>
