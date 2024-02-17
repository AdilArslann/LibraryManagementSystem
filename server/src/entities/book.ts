import { validates } from '@server/utils/validation'
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm'
import { z } from 'zod'
import { School } from './school'
import { Review } from './review'
import { Waitlist } from './waitlist'
import { Reservation } from './reservation'
import { Loan } from './loan'

@Entity()
export class Book {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('text')
  title: string

  @Column('text', { array: true })
  authors: string[]

  @Column('text')
  isbn: string

  @Column('text')
  publicationYear: string

  @Column('text')
  publisher: string

  @Column('text', { nullable: true })
  coverImageUrl: string // URL to the cover image possibly gonna use igmur or some other image hosting service

  @Column('text', { nullable: true })
  coverImageLargeUrl: string

  @Column('text', { nullable: true })
  description: string

  @Column('integer')
  quantity: number

  @Column('integer')
  availableQuantity: number

  @Column('integer')
  schoolId: number

  @ManyToOne(() => School, (school) => school.books)
  @JoinColumn()
  school: School

  @OneToMany(() => Review, (review) => review.book)
  reviews: Review[]

  @OneToMany(() => Waitlist, (waitlist) => waitlist.book)
  waitlist: Waitlist[]

  @OneToMany(() => Reservation, (reservation) => reservation.book)
  reservation: Reservation[]

  @OneToMany(() => Loan, (loan) => loan.book)
  loan: Loan[]
}
export type BookBare = Omit<
  Book,
  'school' | 'reservation' | 'reviews' | 'waitlist' | 'loan'
>

export const bookSchema = validates<BookBare>().with({
  id: z.number().int().positive(),
  title: z.string().trim(),
  authors: z.array(z.string().trim()),
  isbn: z.string().trim(),
  quantity: z.number().int().positive(),
  availableQuantity: z.number().int().positive(),
  publicationYear: z.string().trim(),
  coverImageUrl: z.string().trim(),
  coverImageLargeUrl: z.string().trim(),
  description: z.string().trim(),
  publisher: z.string().trim(),
  schoolId: z.number().int().positive(),
})

export const bookInsertSchema = bookSchema.omit({ id: true })

export type BookInsert = z.infer<typeof bookInsertSchema>

export const bookShowcaseSchema = bookSchema.pick({
  id: true,
  title: true,
  authors: true,
  coverImageUrl: true,
  publisher: true,
})

export type BookShowcase = z.infer<typeof bookShowcaseSchema>
