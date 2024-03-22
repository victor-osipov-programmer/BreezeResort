import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Relation, OneToMany, ManyToOne } from "typeorm"

@Entity()
export class Roles {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(() => Users, users => users.role)
    users: Relation<Users[]>
}

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    password: string

    @Column({
        default: null
    })
    token: string

    @ManyToOne(() => Roles, (roles) => roles.users)
    role: Relation<Roles>
}

@Entity()
export class Rooms {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    desc_data: string
}