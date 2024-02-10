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
      <img :src="book.coverImageUrl" alt="book image" />
    </div>
    <div class="details">
      <h5 class="title">
        {{ book.title }}
      </h5>
      <p class="authors">
        {{ author(book.authors) }}
      </p>
    </div>
  </RouterLink>
</template>

<style scoped>
.book {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  margin: 0.3rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  width: 8rem;
  height: 10rem;
  text-align: center
}

.book:hover {
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.thumbnail {
  width: 100%;
  height: 50%;
  margin-bottom: 0.3rem;
  display: flex;
  justify-content: center;
  align-items: bottom;
}

.details {
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.title {
  font-size: 0.6rem;
  font-weight: bold;
}

.authors {
  font-size: 0.5rem;
}


@media (width >=768px) {
  .book {
    width: 11rem;
    height: 13rem;
  }

  .title {
    font-size: 0.8rem;
  }

  .authors {
    font-size: 0.8rem;
  }

  .thumbnail {
    margin-bottom: 0.5rem;
  }
}
</style>