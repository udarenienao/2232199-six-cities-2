import typegoose, {defaultClasses, getModelForClass, mongoose, Ref, Severity} from '@typegoose/typegoose';
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

  @prop({type: () => Number, default: 0})
  public numberOfComments!: number;

  @prop({
    type: () => Number,
    required: true,
    min: [100, 'Min cost is 100'],
    max: [100000, 'Max cost is 100000']
  })
  public rentalCost!: number;

  @prop({
    type: () => String,
    required: true,
    trim: true,
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

  @prop({
    type: () => Number,
    required: true,
    min: [1, 'Min count of guests is 1'],
    max: [10, 'Max count of guests is 10']
  })
  public numberOfGuests!: number;

  @prop({
    required: true,
    type: () => String,
    enum: HousingType
  })
  public housingType!: HousingType;

  @prop({
    type: () => [String],
    minCount: [6, 'Images should be 6'],
    maxCount: [6, 'Images should be 6']})
  public propertyImages!: string[];

  @prop({
    required: true,
    trim: true,
    type: () => String,
    minlength: [10, 'Min length for name is 10'],
    maxlength: [100, 'Max length for name is 15']
  })
  public name!: string;

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({type: () => Boolean, required: true, default: false})
  public premium!: boolean;

  @prop({type: () => String, required: true, match: [/.*\.(?:jpg|png)/, 'Avatar must be jpg or png']})
  public previewImage!: string;

  @prop({type: () => Date, required: true})
  public publicationDate!: Date;

  @prop({
    type: () => Number,
    required: true,
    min: [1, 'Min length for rating is 1'],
    max: [5, 'Max length for rating is 5']
  })
  public rating!: number;

  @prop({
    type: () => Number,
    required: true,
    min: [1, 'Min length for room count is 1'],
    max: [8, 'Max length for room count is 8']
  })
  public numberOfRooms!: number;

  @prop({
    type: () => mongoose.Schema.Types.Mixed,
    required: true,
    allowMixed: Severity.ALLOW
  })
  public coordinates!: Coordinates;
}

export const OfferModel = getModelForClass(OfferEntity);
