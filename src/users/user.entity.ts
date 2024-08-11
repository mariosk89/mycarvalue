import 
{ 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    AfterInsert, 
    AfterRemove, 
    AfterUpdate, 
    OneToMany 
} from "typeorm";
import { Report } from "src/reports/report.entity";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    //@Exclude() //ignore when serializing in the
    password: string;

    @Column({default: true})
    admin: boolean

    // () => Report
    // User will be associated with something of type Report. 
    // Wraps the entity with a function and this way gets around the circular dependency
    // (report) => report.user
    //  
    @OneToMany(() => Report, (report) => report.user)
    reports: Report[];

    //Hooks
    @AfterInsert()
    logInsert(){
        console.log('Inserted user with id ', this.id);
    }

    @AfterUpdate()
    logUpdate(){
        console.log('Updated user with id ', this.id);
    }

    @AfterRemove()
    logRemove(){
        console.log('Removed user with id ', this.id);
    }
}