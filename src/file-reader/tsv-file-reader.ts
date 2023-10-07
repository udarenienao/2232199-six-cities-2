import {FileReaderInterface} from './file-reader.js';
import {readFileSync} from 'node:fs';
import {City} from '../types/city.js';
import {HousingType} from '../types/housing-type.js';
import {Amenities} from '../types/amenities.js';
import {Offer} from '../types/offer.js';
import {UserType} from '../types/user.js';

export default class TSVFileReader implements FileReaderInterface {
  private data = ' ';

  constructor(public filename: string) {
  }

  public read(): void {
    this.data = readFileSync(this.filename, {encoding: 'utf-8'});
  }

  public parseData(): Offer[] {
    const offers = this.data?.split('\n').filter((row) => row.trim() !== '');
    const offersRows = offers?.map((row) => row.split('\t'));
    return offersRows.map(([name,
      description,
      publicationDate,
      city,
      previewImage,
      images,
      premium,
      favorite,
      rating,
      housingType,
      roomCount,
      guestCount,
      facilities,
      offerAuthorName,
      offerAuthorAvatar,
      offerAuthorType,
      offerAuthorEmail,
      offerAuthorPassword,
      commentsCount,
      latitude,
      longitude,
      price]) => ({
      name: name,
      description: description,
      publicationDate: new Date(publicationDate),
      city: city as unknown as City,
      previewImage: previewImage,
      propertyImages: images.split(','),
      premium: premium as unknown as boolean,
      favorite: favorite as unknown as boolean,
      rating: parseFloat(rating),
      housingType: housingType as unknown as HousingType,
      numberOfRooms: parseInt(roomCount, 10),
      numberOfGuests: parseInt(guestCount, 10),
      rentalCost: parseInt(price, 10),
      amenities: facilities.split(',').map((x) => x as unknown as Amenities),
      author: {
        name: offerAuthorName,
        avatar: offerAuthorAvatar,
        type: offerAuthorType as unknown as UserType,
        email: offerAuthorEmail,
        password: offerAuthorPassword
      },
      numberOfComments: parseInt(commentsCount, 10),
      coordinates: {latitude: parseFloat(latitude), longitude: parseFloat(longitude)}
    }));
  }
}