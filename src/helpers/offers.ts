import { Offer } from '../types/offer.js';
import {HousingType} from '../types/housing-type.js';
import {Amenities} from '../types/amenities.js';
import {UserType} from '../types/user.js';
import {City} from '../types/city.js';
import { MockData } from '../types/mock-data.js';
import dayjs from 'dayjs';
import { generateRandomNumber, getRandomItem, getRandomItems } from './random.js';
import {
  MIN_RENTAL_COST,
  MAX_RENTAL_COST,
  MIN_RATING,
  MAX_RATING,
  MIN_GUESTS_NUMBER,
  MAX_GUESTS_NUMBER,
  MIN_COUNT_ROOM,
  MAX_COUNT_ROOM,
  FIRST_WEEK_DAY,
  LAST_WEEK_DAY } from '../types/consts.js';

export function parseOffer(offerRaw: string): Offer{
  const offer = offerRaw.trim().replace('\n', '').split('\t');
  const [name,
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
    price] = offer;
  return {
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
  };
}

export function generateOffer(mockData: MockData): string {
  const name = getRandomItem<string>(mockData.names);
  const description = getRandomItem<string>(mockData.descriptions);
  const publicationDate = dayjs().subtract(generateRandomNumber(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
  const city = getRandomItem([City.Amsterdam, City.Cologne, City.Brussels, City.Paris, City.Hamburg, City.Dusseldorf]);
  const previewImage = getRandomItem<string>(mockData.previewImages);
  const images = getRandomItems<string>(mockData.propertyImages);
  const premium = getRandomItem<string>(['true', 'false']);
  const favorite = getRandomItem<string>(['true', 'false']);
  const rating = generateRandomNumber(MIN_RATING, MAX_RATING, 1);
  const housingType = getRandomItem([HousingType.House, HousingType.Hotel, HousingType.Room, HousingType.Apartment]);
  const roomCount = generateRandomNumber(MIN_COUNT_ROOM, MAX_COUNT_ROOM);
  const guestCount = generateRandomNumber(MIN_GUESTS_NUMBER, MAX_GUESTS_NUMBER);
  const price = generateRandomNumber(MIN_RENTAL_COST, MAX_RENTAL_COST);
  const facilities = getRandomItems([Amenities.AirConditioning, Amenities.BabySeat, Amenities.Fridge]);
  const offerAuthorName = getRandomItem<string>(mockData.users.names);
  const offerAuthorAvatar = getRandomItem<string>(mockData.users.avatars);
  const offerAuthorType = getRandomItem([UserType.pro, UserType.simple]);
  const offerAuthorNameEmail = getRandomItem<string>(mockData.users.emails);
  const offerAuthorNamePassword = getRandomItem<string>(mockData.users.passwords);
  const commentsCount = generateRandomNumber(1, 10);
  const latitude = getRandomItem<number>(mockData.coordinates.latitude);
  const longitude = getRandomItem<number>(mockData.coordinates.longitude);

  return [
    name, description, publicationDate,
    city, previewImage, images, premium,
    favorite, rating, housingType, roomCount,
    guestCount, price, facilities, offerAuthorName,
    offerAuthorAvatar, offerAuthorType, offerAuthorNameEmail,
    offerAuthorNamePassword, commentsCount, latitude, longitude
  ].join('\t');
}
