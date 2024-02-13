<script setup lang="ts">
import { useRoute } from 'vue-router'
import { FwbButton, FwbHeading } from 'flowbite-vue'
import { onBeforeMount, ref } from 'vue'
import { useBookStore } from '@/stores/bookStore';

const isLoading = ref(true)
const route = useRoute()
const bookStore = useBookStore()
const bookId = Number(route.params.id)

onBeforeMount(async () => {
  bookStore.setBook(bookId)
  isLoading.value = false
})

const author = (authors: string[]) => {
  return authors.map(author => author).join(', ')
}

const reserveBook = () => {
  bookStore.reserveBook()
}
</script>

<template>
  <div v-if="isLoading">
    <FwbHeading>Loading...</FwbHeading>
    <p>If the issue presist please contant support</p>
  </div>
  <div v-else>
    <div class="BookView" v-if="bookStore.book">
      <div class="book">
        <div class="thumbnail" :style="`--cover-image: url(${bookStore.book.coverImageLargeUrl})`">
          <img :src="bookStore.book.coverImageLargeUrl" alt="book image" />
        </div>
        <div class="details">
          <h5 class="title">
            {{ bookStore.book.title }}
          </h5>
          <p class="authors">
            {{ author(bookStore.book.authors) }}
          </p>
          <div class="about">
            <p>
              <strong>About this book:<br></strong>
              {{ bookStore.book.description }}<br>
            </p>
            <div class="moreAbout">
              <p><strong>PublicationYear:</strong> {{ bookStore.book.publicationYear }}</p>
              <p></p>
              <p><strong>Publisher:</strong> {{ bookStore.book.publisher }}</p>
              <p></p>
              <p><strong>ISBN:</strong> {{ bookStore.book.isbn }}</p>
              <p></p>
            </div>
          </div>
          <div class="reserve" v-if="bookStore.book.availableQuantity > 0" data-testid="reserveAvailableBooks">
            <p>Available books: {{ bookStore.book.availableQuantity }}</p>
            <FwbButton @click="reserveBook">Reserve</FwbButton>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <FwbHeading>Book not found</FwbHeading>
    </div>
  </div>
</template>



<style scoped>
.book {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.thumbnail {
  position: relative;
  /* Set dimensions as needed */
  height: 200px;
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  border-radius: 5px;
}

.thumbnail::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 150px;
  width: 100%;
  background-image: var(--cover-image);
  background-size: cover;
  background-position: center;
  filter: blur(5px);
  z-index: -1;
}

.thumbnail img {
  width: 100px;
  height: 150px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
}

.details {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-size: 2rem;
  font-weight: 700;
}

.moreAbout {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  padding: 0.5rem;
}

.about {
  text-align: left;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 10px;
}
</style>