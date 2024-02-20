<script lang="ts" setup>
import type { BookShowcase } from '@mono/server/src/shared/entities'

defineProps<{
  book: BookShowcase
}>()

const author = (authors: string[]) => {
  return authors.map(author => author).join(', ')
}
</script>

<template>
  <RouterLink :to="{ name: 'Book', params: { id: book.id } }" class="book" data-testid="bookShowcase">
    <div class="thumbnail">
      <img :src="book.coverImageUrl" alt="book image" class="smallThumbnail" />
    </div>
    <div class="details">
      <p class="title">{{ book.title }}</p>
      <div class="authors">
        <img src="../assets/author.svg" alt="author icon" class="icon" />
        <p>
          {{ author(book.authors) }}
        </p>
      </div>
      <div class="publisher">
        <img src="../assets/publisher.svg" alt="publisher icon" class="icon" />
        <p>{{ book.publisher }}</p>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.icon {
  width: 0.8rem;
  height: 0.8rem;
}

.book {
  display: flex;
  border-radius: 5px;
  overflow: hidden;
  width: 100%;
  min-width: 355px;
}

.details {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 80%;
  gap: 0.1rem;
}

.thumbnail {
  width: 20%;
  display: flex;
  justify-content: center;
}

.title {
  font-size: .8rem;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.authors,
.publisher {
  display: flex;
  gap: .5rem;
  font-size: .8rem;
  font-weight: bold;
  color: #666;
  align-items: center;
  margin-bottom: 0.2rem;
}

.smallThumbnail {
  width: 50px;
  height: 70px;
  border-radius: 10px;
}

@media (width >=768px) {
  .book {
    justify-content: center;
    gap: 1rem;
  }

  .thumbnail {
    width: auto;
  }
}
</style>