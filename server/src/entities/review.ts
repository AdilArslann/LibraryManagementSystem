import { validates } from '@server/utils/validation'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { z } from 'zod'
import { User } from './user'
import { Book } from './book'

@Entity()
export class Review {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('int')
  rating: number

  @Column('text', { nullable: true })
  comment: string

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @ManyToOne(() => Book, (book) => book.reviews)
  @JoinColumn({ name: 'bookId' })
  book: Book

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'userId' })
  user: User
}
export type ReviewBare = Omit<Review, 'book' | 'user'>

export const reviewSchema = validates<ReviewBare>().with({
  id: z.number().int().positive(),
  rating: z.number().int().positive().min(1).max(5),
  comment: z.string().trim(),
  createdAt: z.date(),
})

export const reviewInsertSchema = reviewSchema.omit({ id: true })

export type ReviewInsert = z.infer<typeof reviewInsertSchema>
