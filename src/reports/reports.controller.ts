import { Body, Controller, Patch, Post, UseGuards, Param, Get, Query, NotFoundException } from '@nestjs/common';
import { CreateReportDTO } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { ReportDTO } from './dtos/report.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ApproveReportDTO } from './dtos/approve-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { GetEstimateDTO } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController { 

    constructor(private reportsService: ReportsService){} 

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDTO) // Serializes the outgoing respopnse using the details inside the provided DTO
    createReport(@Body() body: CreateReportDTO, @CurrentUser() user: User){
        return this.reportsService.create(body, user);
    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    approveReport(@Param('id') id: string, @Body() body: ApproveReportDTO){
        return this.reportsService.changeApproval(id, body.approved);
    }

    // Extra (own) endpoint for getting a report by id
    @Get('/:id')
    @Serialize(ReportDTO)
    @UseGuards(AuthGuard)
    async getReportById(@Param('id') id: string){
        const report = await this.reportsService.getReportById(parseInt(id));
        if(!report){
            throw new NotFoundException('Report not found');
        }
        return report;
    }

    // Extra (own) endpoint for getting a report by id
    @Get()
    @Serialize(ReportDTO)
    @UseGuards(AuthGuard)
    async getAllReports(@CurrentUser() user: User){
        console.log('Getting all reports for user with id' + user.id);
        return await this.reportsService.getAllReports(user);
    }

    // Query string example
    // Everything is sent as a string so it needs to be transformed to the respective type
    // POST is not a proper HTTP verb.
    // It is used in this case to avoid clash with the extra getbyid enpoint
    @Post('/estimate')
    async getEstimate(@Query() query: GetEstimateDTO){
        console.log(query);
        return await this.reportsService.createEstimate(query);
    }
}
