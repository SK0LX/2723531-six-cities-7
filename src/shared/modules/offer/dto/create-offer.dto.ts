import type {Amenity, City, Coordinates, HousingType} from '../../../types/index.js';
import {OfferFieldsDto} from './offer-fields.dto.js';

export class CreateOfferDto extends OfferFieldsDto {
  declare title: string;
  declare description: string;
  declare postDate: Date;
  declare city: City;
  declare previewImage: string;
  declare images: string[];
  declare isPremium: boolean;
  declare type: HousingType;
  declare bedrooms: number;
  declare maxAdults: number;
  declare price: number;
  declare amenities: Amenity[];
  declare location: Coordinates;

  public userId!: string;
}
