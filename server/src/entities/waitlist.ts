import { validates } from '@server/utils/validation'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { z } from 'zod'
import { User } from './user'
import { Book } from './book'

@Entity()
export class Waitlist {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column('integer')
  Priority: number

  @Column('integer')
  userId: number

  @Column('integer')
  bookId: number

  @OneToOne(() => User, (user) => user.waitlist)
  @JoinColumn()
  user: User

  @ManyToOne(() => Book, (book) => book.waitlist)
  @JoinColumn()
  book: Book
}

export type WaitlistBare = Omit<Waitlist, 'user' | 'book'>

export const waitlistSchema = validates<WaitlistBare>().with({
  id: z.number().int().positive(),
  createdAt: z.date(),
  Priority: z.number().int().positive(),
  userId: z.number().int().positive(),
  bookId: z.number().int().positive(),
})

export const waitlistInsertSchema = waitlistSchema.omit({ id: true })

export type WaitlistInsert = z.infer<typeof waitlistInsertSchema>
