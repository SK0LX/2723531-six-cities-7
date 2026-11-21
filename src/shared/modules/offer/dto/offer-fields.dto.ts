import {Transform, Type} from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDate,
  IsDefined,
  IsIn,
  IsInt,
  isISO8601,
  IsNumber,
  IsObject,
  isRFC3339,
  IsString,
  IsUrl,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import {AMENITIES, CITIES, HOUSING_TYPES} from '../../../types/index.js';
import type {Amenity, City, Coordinates, HousingType} from '../../../types/index.js';

const IMAGE_URL_OPTIONS = {
  protocols: ['http', 'https'],
  'require_protocol': true,
  'require_tld': false,
};

function parsePublicationDate({value}: {value: unknown}): unknown {
  if (typeof value === 'string' && isRFC3339(value) && isISO8601(value, {strict: true})) {
    return new Date(value);
  }

  return value;
}

class CoordinatesDto implements Coordinates {
  @IsDefined()
  @IsNumber()
  @Min(-90)
  @Max(90)
  public latitude!: number;

  @IsDefined()
  @IsNumber()
  @Min(-180)
  @Max(180)
  public longitude!: number;
}

export class OfferFieldsDto {
  @IsString()
  @Length(10, 100)
  public title?: string;

  @IsString()
  @Length(20, 1024)
  public description?: string;

  @Transform(parsePublicationDate, {toClassOnly: true})
  @IsDate()
  public postDate?: Date;

  @IsIn(CITIES)
  public city?: City;

  @IsUrl(IMAGE_URL_OPTIONS)
  public previewImage?: string;

  @IsArray()
  @ArrayMinSize(6)
  @ArrayMaxSize(6)
  @IsUrl(IMAGE_URL_OPTIONS, {each: true})
  public images?: string[];

  @IsBoolean()
  public isPremium?: boolean;

  @IsIn(HOUSING_TYPES)
  public type?: HousingType;

  @IsInt()
  @Min(1)
  @Max(8)
  public bedrooms?: number;

  @IsInt()
  @Min(1)
  @Max(10)
  public maxAdults?: number;

  @IsNumber()
  @Min(100)
  @Max(100000)
  public price?: number;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsIn(AMENITIES, {each: true})
  public amenities?: Amenity[];

  @IsObject()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  public location?: Coordinates;
}
