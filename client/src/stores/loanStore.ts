import { defineStore } from 'pinia'
import { ref } from 'vue'
import { trpc } from '@/trpc'
import type { LoanStatus, LoanShowcase } from '@mono/server/src/shared/entities'

export const useLoanStore = defineStore('loan', () => {
  const Loans = ref<LoanShowcase[]>([])

  const setLoans = async () => {
    Loans.value = await trpc.loan.get.query()
  }

  const returnLoan = async (loanId: number) => {
    await trpc.loan.returned.mutate({ id: loanId })
    const loan = Loans.value.find((loan) => loan.id === loanId)
    if (loan) {
      loan.status = 'Returned' as LoanStatus.RETURNED
    }
  }

  const getOne = (loanId: number) => {
    return Loans.value.find((loan) => loan.id === loanId) as LoanShowcase
  }

  return {
    Loans,
    setLoans,
    returnLoan,
    getOne,
  }
})
