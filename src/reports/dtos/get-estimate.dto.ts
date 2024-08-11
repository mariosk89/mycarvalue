import { 
    IsNumber, IsString, 
    Min, Max,
    IsLongitude, IsLatitude,
    IsOptional
} from "class-validator";
import { Transform } from "class-transformer";

export class GetEstimateDTO{

    @IsString()
    make: string;

    @IsString()
    model: string;

    @Transform( ( {value}) => parseInt(value) ) // parsing the input string value into an integer
    @IsNumber()
    @Min(1930)          //Minimum numberical value
    @Max(2024)          //Maximum numberical value
    year: number;

    @Transform( ( {value}) => parseFloat(value) ) // parsing the input string value into a float
    @IsLongitude()
    lng: number;

    @Transform( ( {value}) => parseFloat(value) ) // parsing the input string value into a float
    @IsLatitude()
    lat: number;

    @Transform( ( {value}) => parseInt(value) ) // parsing the input string value into an integer
    @IsNumber()
    @Min(0)            //Minimum numberical value
    @Max(1000000)      //Maximum numberical value
    mileage: number;
}