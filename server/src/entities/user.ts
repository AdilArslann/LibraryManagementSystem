import { validates } from '@server/utils/validation'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { z } from 'zod'
import { School } from './school'
import { Reservation } from './reservation'
import { Loan } from './loan'
import { Review } from './review'
import { Waitlist } from './waitlist'

export enum UserRoles {
  STUDENT = 'student',
  LIBRARIAN = 'librarian',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Unique(['email'])
  @Column('text')
  email: string

  @Column('text')
  name: string

  @Column('text', { select: false })
  password: string

  @Column('text', { default: UserRoles.STUDENT })
  role: UserRoles

  @Column('integer', { nullable: true })
  schoolId: number

  @ManyToOne(() => School, (school) => school.users)
  @JoinColumn()
  school: School

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservation: Reservation[]

  @OneToMany(() => Loan, (loan) => loan.user)
  loan: Loan[]

  @OneToOne(() => Waitlist, (waitlist) => waitlist.user)
  waitlist: Waitlist[]

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[]
}

export type UserBare = Omit<
  User,
  'school' | 'reservation' | 'loan' | 'reviews' | 'waitlist'
>

export const userSchema = validates<UserBare>().with({
  id: z.number().int().positive(),
  name: z.string().trim(),
  role: z.nativeEnum(UserRoles),
  schoolId: z.number().int().positive(),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(64),
})

export const userInsertSchema = userSchema.omit({ id: true })

export type UserInsert = z.infer<typeof userInsertSchema>

export type AuthUser = Pick<User, 'id' | 'schoolId' | 'role'>

export const authUserSchema = validates<AuthUser>().with({
  id: z.number().int().positive(),
  schoolId: z.number().int().positive(),
  role: z.nativeEnum(UserRoles),
})
