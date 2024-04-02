import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Relation, OneToMany, ManyToOne, Unique } from "typeorm"

@Entity('roles')
@Unique(['name'])
export class Role {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(() => User, user => user.role)
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

    @ManyToOne(() => Room, room => room.users)
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

    @ManyToOne(() => Role, (role) => role.users)
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

    @OneToMany(() => User, user => user.id_childdata)
    users: Relation<User[]>

    @ManyToOne(() => Hotel, hotel => hotel.rooms)
    hotel: Relation<Hotel>
}

@Entity('hotels')
@Unique(['name'])
@Unique(['number'])
export class Hotel {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    number: number

    @OneToMany(() => Room, room => room.hotel)
    rooms: Relation<Room[]>
}