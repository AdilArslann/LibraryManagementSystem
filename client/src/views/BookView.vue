<script setup lang="ts">
import { useRoute } from 'vue-router'
import { FwbButton, FwbHeading, FwbSpinner } from 'flowbite-vue'
import { onBeforeMount, ref } from 'vue'
import { useBookStore } from '@/stores/bookStore'

const isLoading = ref(true)
const route = useRoute()
const bookStore = useBookStore()
const bookId = Number(route.params.id)

onBeforeMount(async () => {
  bookStore.setBook(bookId)
  isLoading.value = false
})

const author = (authors: string[]) => {
  return authors.map((author) => author).join(', ')
}

const reserveBook = () => {
  bookStore.reserveBook()
}
</script>

<template>
  <div v-if="isLoading" class="loading">
    <FwbSpinner size="12" />
    <p><strong>Loading...</strong></p>
    <p>If the issue presists please contant support</p>
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
          <div
            class="reserve"
            v-if="bookStore.book.availableQuantity > 0"
            data-testid="reserveAvailableBooks"
          >
            <FwbButton class="reserveButton" @click="reserveBook" pill size="md">
              <template #prefix>
                <img src="../assets/reserve.svg" alt="" class="icons" />
              </template>
              Reserve
            </FwbButton>
          </div>
          <div class="about">
            <p>
              <strong>About this book:<br /></strong>
              {{ bookStore.book.description }}<br />
            </p>
            <div class="moreAbout">
              <div class="flex-row">
                <img src="../assets/published.svg" alt="" class="icons" />
                <p>
                  Published on <strong>{{ bookStore.book.publicationYear }}</strong>
                </p>
              </div>
              <div class="flex-row">
                <img src="../assets/publisher.svg" alt="" class="icons" />
                <p>
                  Published by <strong>{{ bookStore.book.publisher }}</strong>
                </p>
              </div>
              <div class="flex-row">
                <img src="../assets/isbn.svg" alt="" class="icons" />
                <p>
                  ISBN: <strong>{{ bookStore.book.isbn }}</strong>
                </p>
              </div>
              <div class="flex-row">
                <img src="../assets/availableqty.svg" alt="" class="icons" />
                <p>
                  Available Quantity: <strong>{{ bookStore.book.availableQuantity }}</strong>
                </p>
              </div>
            </div>
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
.flex-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.reserve {
  padding: 1rem 0;
  width: 100%;
}

.reserveButton {
  width: 90%;
  justify-content: center;
}

.book,
.loading {
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
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  margin: 1.5rem 0;
  padding: 0.6rem;
  gap: 0.4rem;
}

.about {
  text-align: left;
  padding: 1rem;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  margin-top: 10px;
}
</style>
