<script lang="ts" setup>
import { onBeforeMount } from 'vue'
import { FwbAlert } from 'flowbite-vue'
import Loan from '@/components/Loan.vue'
import { useLoanStore } from '@/stores/loanStore'

const loansStore = useLoanStore()

onBeforeMount(async () => {
  loansStore.setLoans()
})
</script>

<template>
  <div class="loans" data-testid="loansShowcase">
    <FwbAlert v-if="!loansStore.Loans.length" type="info" data-testid="noLoans"> No Loans </FwbAlert>
    <Loan v-for="loan in loansStore.Loans" :key="loan.id" :loanId="loan.id" />
  </div>
</template>
