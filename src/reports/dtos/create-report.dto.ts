import { 
    IsNumber, IsString, 
    Min, Max,
    IsLongitude, IsLatitude
} from "class-validator";

export class CreateReportDTO{

    @Min(0)            //Minimum numberical value
    @Max(1000000)      //Maximum numberical value
    price: number;

    @IsString()
    make: string;

    @IsString()
    model: string;

    @IsNumber()
    @Min(1930)          //Minimum numberical value
    @Max(2024)          //Maximum numberical value
    year: number;

    @IsLongitude()
    lng: number;

    @IsLatitude()
    lat: number;

    @IsNumber()
    @Min(0)            //Minimum numberical value
    @Max(1000000)      //Maximum numberical value
    mileage: number;
}