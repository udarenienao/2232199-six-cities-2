import {User} from './user.js';
import {City} from './city.js';
import {HousingType} from './housing-type.js';
import {Amenities} from './amenities.js';
import {Coordinates} from './coordinates.js';


export type Offer = {
  name: string;
  description: string;
  publicationDate: Date;
  city: City;
  previewImage: string;
  propertyImages: string[];
  premium: boolean;
  rating: number;
  housingType: HousingType;
  numberOfRooms: number;
  numberOfGuests: number;
  rentalCost: number;
  amenities: Amenities[];
  author: User;
  numberOfComments: number;
  coordinates: Coordinates
}
