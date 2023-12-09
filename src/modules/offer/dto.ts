import { Expose } from 'class-transformer';
import { City } from '../../types/city';
import { HousingType } from '../../types/housing-type';
import { Amenities } from '../../types/amenities';
import { Coordinates } from '../../types/coordinates';

export class OfferDto {
  @Expose()
    name!: string;

  @Expose()
    publicationDate!: Date;

  @Expose()
    city!: City;

  @Expose()
    previewImage!: string;

  @Expose()
    premium!: boolean;

  @Expose()
    rating!: number;

  @Expose()
    housingType!: HousingType;

  @Expose()
    rentalCost!: number;

  @Expose()
    numberOfComments!: number;
}

export class FullOfferDto {
  @Expose()
    name!: string;

  @Expose()
    description!: string;

  @Expose()
    publicationDate!: Date;

  @Expose()
    city!: City;

  @Expose()
    previewImage!: string;

  @Expose()
    propertyImages!: string[];

  @Expose()
    premium!: boolean;

  @Expose()
    rating!: number;

  @Expose()
    housingType!: HousingType;

  @Expose()
    numberOfRooms!: number;

  @Expose()
    numberOfGuests!: number;

  @Expose()
    rentalCost!: number;

  @Expose()
    amenities!: Amenities[];

  @Expose()
    userId!: string;

  @Expose()
    numberOfComments!: number;

  @Expose()
    coordinates!: Coordinates;
}