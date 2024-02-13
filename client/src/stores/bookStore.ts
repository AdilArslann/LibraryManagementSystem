import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BookBare } from '@mono/server/src/shared/entities'
import { trpc } from '@/trpc'

export const useBookStore = defineStore('book', () => {
  const book = ref<BookBare>()

  const setBook = async (bookId: number) => {
    book.value = await trpc.book.getOne.query(bookId)
  }

  const reserveBook = async () => {
    if (book.value) {
      await trpc.reservation.create.mutate({ bookId: book.value.id })
      book.value.availableQuantity -= 1
    }
  }

  return {
    book,
    setBook,
    reserveBook,
  }
})
