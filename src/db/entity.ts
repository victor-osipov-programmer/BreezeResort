import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Relation, OneToMany, ManyToOne, Unique } from "typeorm"

@Entity('roles')
@Unique(['name'])
export class Role {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(() => User, users => users.role)
    users: Relation<User[]>
}

@Entity('users')
@Unique(['username'])
@Unique(['fio'])
@Unique(['email'])
@Unique(['phone'])
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        default: null
    })
    username: string

    @Column({
        default: null
    })
    fio: string

    @Column({
        default: null
    })
    email: string

    @Column({
        default: null
    })
    phone: string
    
    @Column({
        default: null
    })
    birth_date: string

    @Column({
        default: null
    })

    @ManyToOne(() => Room, rooms => rooms.users)
    @JoinColumn({name: 'id_childdata'})
    id_childdata: Relation<Room>
    
    @Column({
        default: null
    })
    password: string

    @Column({
        default: null
    })
    token: string

    @ManyToOne(() => Role, (roles) => roles.users)
    @JoinColumn({name: 'role_id'})
    role: Relation<Role>
}

@Entity('rooms')
@Unique(['name'])
export class Room {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    desc_data: string

    @OneToMany(() => User, users => users.id_childdata)
    users: Relation<User[]>
}