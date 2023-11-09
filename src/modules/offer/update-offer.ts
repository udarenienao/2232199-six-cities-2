import {City} from '../../types/city.js';
import {HousingType} from '../../types/housing-type.js';
import {Amenities} from '../../types/amenities.js';
import {Coordinates} from '../../types/coordinates.js';

export default class UpdateOfferDto {
  public name!: string;
  public description!: string;
  public publicationDate!: Date;
  public city!: City;
  public previewImage!: string;
  public propertyImages!: string[];
  public premium!: boolean;
  public favorite!: boolean;
  public rating!: number;
  public housingType!: HousingType;
  public numberOfRooms!: number;
  public numberOfGuests!: number;
  public rentalCost!: number;
  public amenities!: Amenities[];
  public userId!: string;
  public numberOfComments!: number;
  public coordinates!: Coordinates;
}
