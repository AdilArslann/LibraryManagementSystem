<script setup lang="ts">
import { trpc } from '@/trpc';
import type { LoanShowcase } from '@mono/server/src/shared/entities';
import { FwbButton } from 'flowbite-vue'

defineProps<{
  loan: LoanShowcase
}>()

const returned = async (id: number) => {
  await trpc.loan.returned.mutate({ id })
}
</script>

<template>
  <div class="loan" data-testid="loanShowcase">
    <div class="details">
      <h1 class="title">
        {{ loan.book.title }}
      </h1>
      <p class="user" data-testid="loanOwnerName">
        <strong>Loaned By:</strong> {{ loan.user.name }}
      </p>
      <p class="dates">
        <strong>Loaned On:</strong><br>
        {{ loan.checkoutDate }}<br>
        <strong>Due Date:</strong><br>
        {{ loan.dueDate }}
      </p>
      <p :class="['status', loan.status]" :data-testid="loan.status">
        {{ loan.status }}
      </p>
    </div>
    <FwbButton @click="returned(loan.id)">Mark as Returned</FwbButton>
  </div>
</template>

<style>
.loan {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  margin: 0.3rem;
  padding: 0.4rem 0.7rem;
  border-radius: 4px;
  transition: all 0.2s ease-in-out;
  text-align: start;
  font-size: 0.8rem;
}

.user {
  margin-top: 0.5rem;
  font-size: 0.7rem;
}

.dates {
  margin-top: 0.5rem;
  font-size: 0.7rem;
}

.status {
  margin-top: 0.5rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
}

@media (width >=768px) {
  .loan {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .details {
    text-align: center;
  }
}
</style>