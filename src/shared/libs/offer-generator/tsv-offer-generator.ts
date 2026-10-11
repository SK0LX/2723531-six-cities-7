import type { OfferGenerator } from './offer-generator.interface.js';
import type { MockServerData } from '../../types/index.js';
import { AMENITIES, HOUSING_TYPES, USER_TYPES } from '../../types/index.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/index.js';

const MIN_PRICE = 100;
const MAX_PRICE = 100000;
const MIN_RATING = 1;
const MAX_RATING = 5;
const MIN_BEDROOMS = 1;
const MAX_BEDROOMS = 8;
const MIN_GUESTS = 1;
const MAX_GUESTS = 10;
const PHOTO_COUNT = 6;
const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;
const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {
    if (Object.values(mockData).some((items) => items.length === 0)) {
      throw new Error('Mock data arrays must not be empty.');
    }

    if (mockData.offerImages.length < PHOTO_COUNT) {
      throw new Error('Mock data must contain at least 6 offer images.');
    }

    if (
      mockData.users.length !== mockData.emails.length ||
      mockData.users.length !== mockData.passwords.length
    ) {
      throw new Error('Each mock user must have an email and a password at the same index.');
    }
  }

  public generate(): string {
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const location = getRandomItem(this.mockData.locations);
    const availableImages = [...this.mockData.offerImages];
    const images = Array.from({ length: PHOTO_COUNT }, () => {
      const index = generateRandomValue(0, availableImages.length - 1);
      const [image] = availableImages.splice(index, 1);
      return image;
    });
    const previewImage = getRandomItem(images);
    const amenities = getRandomItems([...AMENITIES]);

    if (amenities.length === 0) {
      amenities.push(getRandomItem([...AMENITIES]));
    }

    const isPremium = getRandomItem([true, false]);
    const isFavorite = false;
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1);
    const type = getRandomItem([...HOUSING_TYPES]);
    const bedrooms = generateRandomValue(MIN_BEDROOMS, MAX_BEDROOMS);
    const maxAdults = generateRandomValue(MIN_GUESTS, MAX_GUESTS);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const authorIndex = generateRandomValue(0, this.mockData.users.length - 1);
    const author = this.mockData.users[authorIndex];
    const email = this.mockData.emails[authorIndex];
    const avatar = this.mockData.avatars[authorIndex % this.mockData.avatars.length];
    const password = this.mockData.passwords[authorIndex];
    const userType = USER_TYPES[authorIndex % USER_TYPES.length];
    const commentCount = 0;
    const daysAgo = generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY);
    const createdDate = new Date(Date.now() - daysAgo * MILLISECONDS_IN_DAY).toISOString();

    return [
      title, description, createdDate, location.city, previewImage, images.join(';'),
      isPremium, isFavorite, rating, type, bedrooms, maxAdults, price, amenities.join(';'),
      author, email, avatar, password, userType, commentCount,
      location.latitude, location.longitude,
    ].join('\t');
  }
}
