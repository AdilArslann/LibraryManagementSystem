<script setup lang="ts">
import { FwbButton } from 'flowbite-vue'
import { useLoanStore } from '@/stores/loanStore';

const loansStore = useLoanStore()

const props = defineProps<{
  loanId: number
}>()

const loan = loansStore.getOne(props.loanId)

const checkIfStatusReturned = (status: string) => {
  return status === 'Returned'
}

const formatDate = (date: Date | string) => {
  // https://stackoverflow.com/questions/47349417/javascript-date-now-to-readable-format
  return new Date(date).toUTCString()
}
</script>

<template>
  <div class="loan" data-testid="loanShowcase">
    <div class="details">
      <h1 class="title">
        {{ loan.book.title }}
      </h1>
      <p class="user" data-testid="loanOwnerName">
        <strong>Loaned to:</strong> {{ loan.user.name }}
      </p>
      <p class="dates">
        <strong>Loaned On:</strong><br />
        {{ formatDate(loan.checkoutDate) }}<br />
        <strong>Due Date:</strong><br />
        {{ formatDate(loan.dueDate) }}
      </p>
      <p :class="['status', loan.status]" :data-testid="loan.status">
        {{ loan.status }}
      </p>
    </div>
    <div class="actions">
      <FwbButton v-if="!checkIfStatusReturned(loan.status)" @click="loansStore.returnLoan(loan.id)">Mark as Returned
      </FwbButton>
    </div>
  </div>
</template>

<style scoped>
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
  text-decoration: underline;
  font-weight: bold;
  color: #000;
}

.details {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-bottom: 0.5rem;
}

.dates {
  margin-top: 0.5rem;
  font-size: 0.7rem;
}

.actions {
  display: flex;
  flex-direction: row;
}

.title {
  font-weight: 800;
  font-size: 1.2rem;
  line-height: 1;
}

@media (width >=768px) {
  .loan {
    flex-direction: row;
    text-align: center;
  }

  .details {
    align-items: flex-start;
    text-align: start;
    width: 70%;
  }

  .actions {
    flex-direction: column;
    align-items: center;
    width: 30%;
  }
}

.status {
  display: flex;
  padding: 0.625rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: bold;
  align-items: center;
  justify-content: center;
  min-width: 8rem;
}

.status::before {
  content: '';
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  margin-right: 10%;
}

.Returned::before {
  background-color: grey;
}

.Checked_Out::before {
  background-color: green;
}

.Overdue::before {
  background-color: #f44336;
}

.status.Checked_Out {
  color: green;
  background-color: lightgreen;
}

.status.Overdue {
  background-color: #f44336;
}

.status.Returned {
  color: grey;
  background-color: lightgrey;
}
</style>
