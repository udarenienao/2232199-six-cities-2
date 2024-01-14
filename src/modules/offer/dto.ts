import { Expose } from 'class-transformer';
import { City } from '../../types/city.js';
import { HousingType } from '../../types/housing-type.js';
import { Amenities } from '../../types/amenities.js';
import { Coordinates } from '../../types/coordinates.js';

export class OfferDto {
  @Expose()
    name!: string;

  @Expose({ name: 'createdAt'})
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

  @Expose({ name: 'createdAt'})
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

export class ShortOfferDto{
  @Expose()
  public id!: string;

  @Expose()
    name!: string;

  @Expose({ name: 'createdAt'})
    publicationDate!: Date;

  @Expose()
    city!: City;

  @Expose()
    previewImage!: string;

  @Expose()
    premium!: boolean;

  @Expose()
    favorite!: boolean;

  @Expose()
    rating!: number;

  @Expose()
    housingType!: HousingType;

  @Expose()
    rentalCost!: number;

  @Expose()
    numberOfComments!: number;
}

export class FavouriteShortOfferDto{
  @Expose()
  public id!: string;

  @Expose()
    name!: string;

  @Expose()
    description!: string;

  @Expose({ name: 'createdAt'})
    publicationDate!: Date;

  @Expose()
    city!: City;

  @Expose()
    previewImage!: string;

  @Expose()
    premium!: boolean;

  favorite = true;

  @Expose()
    rating!: number;

  @Expose()
    housingType!: HousingType;

  @Expose()
    rentalCost!: number;

  @Expose()
    numberOfComments!: number;
}

export class UploadImageResponse {
  @Expose()
  public image!: string;
}
