import {AMENITIES, CITIES, HOUSING_TYPES, USER_TYPES} from '../types/index.js';
import type {Offer} from '../types/index.js';

function parseNumber(value: string, field: string): number {
  const parsedValue = Number(value);

  if (value === '' || !Number.isFinite(parsedValue)) {
    throw new Error(`Invalid number for ${field}: ${value}`);
  }

  return parsedValue;
}

function parseBoolean(value: string, field: string): boolean {
  if (value !== 'true' && value !== 'false') {
    throw new Error(`Invalid boolean for ${field}: ${value}`);
  }

  return value === 'true';
}

function parseEnum<T extends string>(value: string, allowedValues: readonly T[], field: string): T {
  const parsedValue = allowedValues.find((item) => item === value);

  if (parsedValue === undefined) {
    throw new Error(`Invalid value for ${field}: ${value}`);
  }

  return parsedValue;
}

export function createOffer(line: string): Offer {
  const columns = line.split('\t').map((value) => value.trim());

  if (columns.length !== 22) {
    throw new Error('Each offer must contain 22 columns.');
  }

  const [
    title, description, date, city, previewImage, images,
    isPremium, isFavorite, rating, housingType, bedrooms, maxAdults,
    price, amenities, name, email, avatarPath, password,
    userType, commentCount, latitude, longitude,
  ] = columns;

  const postDate = new Date(date);

  if (Number.isNaN(postDate.getTime())) {
    throw new Error(`Invalid publication date: ${date}`);
  }

  const photoPaths = images.split(';').map((image) => image.trim());

  if (photoPaths.length !== 6 || photoPaths.some((image) => image === '')) {
    throw new Error('Each offer must contain exactly 6 images.');
  }

  return {
    title,
    description,
    postDate,
    city: parseEnum(city, CITIES, 'city'),
    previewImage,
    images: photoPaths,
    isPremium: parseBoolean(isPremium, 'isPremium'),
    isFavorite: parseBoolean(isFavorite, 'isFavorite'),
    rating: parseNumber(rating, 'rating'),
    type: parseEnum(housingType, HOUSING_TYPES, 'housing type'),
    bedrooms: parseNumber(bedrooms, 'bedrooms'),
    maxAdults: parseNumber(maxAdults, 'maxAdults'),
    price: parseNumber(price, 'price'),
    amenities: amenities.split(';')
      .map((amenity) => parseEnum(amenity.trim(), AMENITIES, 'amenity')),
    user: {
      name,
      email,
      avatarPath: avatarPath || undefined,
      password,
      type: parseEnum(userType, USER_TYPES, 'user type'),
    },
    commentCount: parseNumber(commentCount, 'commentCount'),
    location: {
      latitude: parseNumber(latitude, 'latitude'),
      longitude: parseNumber(longitude, 'longitude'),
    },
  };
}
