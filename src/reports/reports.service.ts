import { Injectable, NotFoundException } from '@nestjs/common';
import { Report } from './report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDTO } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';
import { GetEstimateDTO } from './dtos/get-estimate.dto';


@Injectable()
export class ReportsService {

    constructor(@InjectRepository(Report) private repository: Repository<Report>){}

    create(reportDto: CreateReportDTO, user: User){
        const report = this.repository.create(reportDto); // Works because the 'create' method accepts a partial version of the ReportEntity
        // setting up entitty association
        report.user = user;
        return this.repository.save(report);
    }

    async changeApproval(id: string, approved: boolean){
        const report = await this.repository.findOne({ where: { id: parseInt(id) } });
        
        if(!report){
            throw new NotFoundException('Report not found');
        }

        report.approved = approved;
        
        return this.repository.save(report);
    }

    // simple version with no relations included
    // userid will not be visible in the response
    // findReportById(id: number){
    //     if(!id){
    //         return null;
    //     }
    //     return this.repository.findOneBy({ id });
    // }

    async getReportById(id: number){
        const reports = await this.repository.find({
            relations: {
                user: true,
            },
            where: {
                id: id
            },
        });
        return reports;
    }

    async getAllReports(user: User){
        const reports = await this.repository.find({
            relations: {
                user: true,
            },
            where: {
                user: {
                    id: user.id
                },
            },
        });
        return reports;
    }

    // createEstimate(estimateDTO: GetEstimateDTO){
    // or a desctructured object approach
    async createEstimate({make, model, lng, lat, year, mileage}: GetEstimateDTO){
        console.log('Creating an estimate')
        return this.repository.createQueryBuilder()
        .select('AVG(price)','price')
        // ':make' some value named 'make'. The value will come from the object after the , {make: estimateDTO.make}
        // this is how SQL Injections are addressed
        .where('make = :make', {make})
        // 2nd where overrides the 1st one 
        //.where()
        // so we use '.enadWhere()'
        .andWhere('model = :model', {model})
        // for lng lat we want to find reports within +-5 degrees
        .andWhere('lng - :lng BETWEEN -5 AND 5', {lng})
        .andWhere('lat - :lat BETWEEN -5 AND 5', {lat})
        .andWhere('year - :year BETWEEN -3 AND 3', {year})
        .andWhere('approved IS TRUE')
        // provide the ordering values via the set parameters method
        .orderBy('ABS(mileage - :mileage)', 'DESC')
        .setParameters({mileage})
        .limit(3)
        .getRawOne();
    }
}
