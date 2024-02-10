import { validates } from '@server/utils/validation'
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { z } from 'zod'
import { User } from './user'
import { Book } from './book'

@Entity()
export class School {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Unique(['name'])
  @Column('text')
  name: string

  @Column('text')
  address: string

  @Column('text')
  phone: string

  @Unique(['email'])
  @Column('text')
  email: string

  @OneToMany(() => User, (user) => user.school, { cascade: ['insert'] })
  users: User[]

  @OneToMany(() => Book, (book) => book.school, { cascade: ['insert'] })
  books: Book[]
}

export type SchoolBare = Omit<School, 'users' | 'books'>

export const schoolSchema = validates<SchoolBare>().with({
  id: z.number().int().positive(),

  name: z.string().trim(),
  address: z.string().trim(),
  phone: z.string().trim(),
  email: z.string().trim().toLowerCase().email(),
})

export const schoolInsertSchema = schoolSchema.omit({ id: true })

export type SchoolInsert = z.infer<typeof schoolInsertSchema>

export const schoolSignUpSchema = schoolSchema.omit({
  email: true,
  phone: true,
})

export type SchoolSignUp = z.infer<typeof schoolSignUpSchema>
