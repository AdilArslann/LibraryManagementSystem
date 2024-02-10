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
import { Book } from './book'
import { User } from './user'
import { Loan } from './loan'

export enum Status {
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
  EXPRIED = 'Expired',
  CANCELLED = 'Canceled',
}

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('integer')
  bookId: number

  @Column('integer')
  userId: number

  @ManyToOne(() => Book, (book) => book.reservation)
  @JoinColumn()
  book: Book

  @ManyToOne(() => User, (user) => user.reservation)
  @JoinColumn()
  user: User

  @OneToOne(() => Loan, (loan) => loan.reservation)
  loan: Loan

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  reservationDate: Date

  @Column('date')
  expireDate: Date

  @Column('text', { default: Status.ACTIVE })
  status: Status
}
export type ReservationBare = Omit<Reservation, 'book' | 'user' | 'loan'>

export const reservationSchema = validates<ReservationBare>().with({
  id: z.number().int().positive(),
  reservationDate: z.date(),
  expireDate: z.date(),
  status: z.nativeEnum(Status),
  bookId: z.number().int().positive(),
  userId: z.number().int().positive(),
})

export const reservationInsertSchema = reservationSchema.omit({ id: true })

export type ReservationInsert = z.infer<typeof reservationInsertSchema>

export type ReservationShowcase = Omit<ReservationBare, 'bookId' | 'userId'> & {
  book: {
    id: number
    title: string
  }
  user: {
    id: number
    name: string
  }
}

export const reservationShowcaseSchema = validates<ReservationShowcase>().with({
  id: z.number().int().positive(),
  reservationDate: z.date(),
  expireDate: z.date(),
  status: z.nativeEnum(Status),
  book: z.object({
    id: z.number().int().positive(),
    title: z.string().trim(),
  }),
  user: z.object({
    id: z.number().int().positive(),
    name: z.string().trim(),
  }),
})
