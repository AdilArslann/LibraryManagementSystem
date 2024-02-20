<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import { FwbAlert } from 'flowbite-vue'
import type { LoanShowcase } from '@mono/server/src/shared/entities';
import { trpc } from '@/trpc';
import Loan from '@/components/Loan.vue'

const loans = ref<LoanShowcase[]>([])



onBeforeMount(async () => {
  loans.value = await trpc.loan.get.query()
})
</script>
 

<template>
  <div class="loans" data-testid="loansShowcase">
    <FwbAlert v-if="loans.length === 0" type="info" data-testid="noLoans">
      No Loans
    </FwbAlert>
    <Loan v-for="loan in loans" :key="loan.id" :loan="loan" />
  </div>
</template>
