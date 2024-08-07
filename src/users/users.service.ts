import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private repository: Repository<User>){
    }

    create(email: string, password: string){
        // 'create' creates the entity but does not persist it in the database
        // this is a required step in case we want to run business logic steps on the entity, such as validations
        const user = this.repository.create({email, password});
        // 'save' persists the given entity into the database
        return this.repository.save(user);
    }

    findOne(id: number) {
        // we can search directly with the id or pass specific search criteria ({email: 'a@a.com'})
        if(!id){
            // if provided with null, the repo will always just return the first user
            return null;
        }
        return this.repository.findOneBy({ id });
        // returns one record or null
    }

    find(email: string) {
        return this.repository.find({ where: { email } });
        // returns empty array if no result is found
    }

    async update(id: number, attrs: Partial<User>){
        const user = await this.repository.findOneBy({ id });
        if(!user){
            throw new NotFoundException('User not found');
        }

        Object.assign(user, attrs);
        // Alternatively
        // if(attrs.email){ 
        //     user.email = attrs.email;
        // }
        // if(attrs.password){ 
        //     user.password = attrs.password;
        // }
        
        this.repository.save(user);
    }

    async remove(id: number){
        const user = await this.repository.findOneBy({ id });
        if(!user){
            throw new NotFoundException('User not found');
        }

        this.repository.remove(user);
    }
}
