import typegoose, {defaultClasses, getModelForClass, Ref, Severity} from '@typegoose/typegoose';
import {City} from '../../types/city.js';
import {HousingType} from '../../types/housing-type.js';
import {UserEntity} from '../user/entity.js';
import {Coordinates} from '../../types/coordinates.js';
import { Amenities } from '../../types/amenities.js';

const {prop, modelOptions} = typegoose;

export interface OfferEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})
export class OfferEntity extends defaultClasses.TimeStamps {

  @prop({
    required: true,
    type: () => String,
    enum: City
  })
  public city!: City;

  @prop({default: 0})
  public numberOfComments!: number;

  @prop()
  public rentalCost!: number;

  @prop({
    required: true,
    minlength: [20, 'Min length for description is 20'],
    maxlength: [1024, 'Max length for description is 1024']
  })
  public description!: string;

  @prop({
    required: true,
    type: () => String,
    enum: Amenities
  })
  public amenities!: Amenities[];

  @prop({required: true, default: false})
  public favorite!: boolean;

  @prop({
    required: true, min: [1, 'Min length for username is 1'],
    max: [10, 'Max length for username is 10']
  })
  public numberOfGuests!: number;

  @prop({
    required: true,
    type: () => String,
    enum: HousingType
  })
  public housingType!: HousingType;

  @prop({type: String, allowMixed: Severity.ALLOW})
  public propertyImages!: string[];

  @prop({
    required: true,
    minlength: [10, 'Min length for name is 10'],
    maxlength: [100, 'Max length for username is 15']
  })
  public name!: string;

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({required: true, default: false})
  public premium!: boolean;

  @prop({required: true, match: [/.*\.(?:jpg|png)/, 'Avatar must be jpg or png']})
  public previewImage!: string;

  @prop({required: true})
  public publicationDate!: Date;

  @prop({
    required: true, min: [1, 'Min length for rating is 1'],
    max: [5, 'Max length for rating is 5']
  })
  public rating!: number;

  @prop({
    required: true, min: [1, 'Min length for room count is 1'],
    max: [8, 'Max length for room count is 8']
  })
  public numberOfRooms!: number;

  @prop({
    required: true,
    allowMixed: Severity.ALLOW
  })
  public coordinates!: Coordinates;
}

export const OfferModel = getModelForClass(OfferEntity);
