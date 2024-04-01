import { Role } from './entity';
import { AppDataSource } from './data-source';

export let roles: Role[];

export async function getRoles() {
    roles = await AppDataSource.manager.find(Role)
}