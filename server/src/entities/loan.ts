import { validates } from '@server/utils/validation'
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm'
import { z } from 'zod'
import { User } from './user'
import { Book } from './book'
import { Reservation } from './reservation'

export enum LoanStatus {
  CHECKED_OUT = 'CHECKED_OUT',
  RETURNED = 'RETURNED',
  OVERDUE = 'OVERDUE',
}

@Entity()
export class Loan {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  checkoutDate: Date

  @Column('timestamp', { nullable: true })
  returnedDate: Date

  @Column('date')
  dueDate: Date

  @Column('text', { default: LoanStatus.CHECKED_OUT })
  status: LoanStatus

  @Column('integer')
  userId: number

  @Column('integer')
  bookId: number

  @Column('integer')
  reservationId: number

  @ManyToOne(() => User, (user) => user.loan)
  @JoinColumn()
  user: User

  @ManyToOne(() => Book, (book) => book.loan)
  @JoinColumn()
  book: Book

  @OneToOne(() => Reservation, (reservation) => reservation.loan)
  @JoinColumn()
  reservation: Reservation
}
export type LoanBare = Omit<Loan, 'book' | 'user' | 'reservation'>

export const loanSchema = validates<LoanBare>().with({
  id: z.number().int().positive(),
  checkoutDate: z.date(),
  returnedDate: z.date(),
  dueDate: z.date(),
  status: z.nativeEnum(LoanStatus),
  userId: z.number().int().positive(),
  bookId: z.number().int().positive(),
  reservationId: z.number().int().positive(),
})

export const loanInsertSchema = loanSchema.omit({ id: true })

export type LoanInsert = z.infer<typeof loanInsertSchema>

export type LoanShowcase = Omit<
  LoanBare,
  'bookId' | 'userId' | 'reservationId'
> & {
  book: {
    id: number
    title: string
  }
  user: {
    id: number
    name: string
  }
}

export const loanShowcaseSchema = validates<LoanShowcase>().with({
  id: z.number().int().positive(),
  returnedDate: z.date(),
  checkoutDate: z.date(),
  dueDate: z.date(),
  status: z.nativeEnum(LoanStatus),
  book: z.object({
    id: z.number().int().positive(),
    title: z.string(),
  }),
  user: z.object({
    id: z.number().int().positive(),
    name: z.string(),
  }),
})
