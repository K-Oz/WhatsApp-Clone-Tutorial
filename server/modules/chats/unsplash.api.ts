import { Injectable, ProviderScope } from '@graphql-modules/di';
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest';
import { resolve } from 'path';
import { trackProvider } from '@safe-api/middleware';
import { RandomPhoto } from '../../types/unsplash';
import { unsplashAccessKey } from '../../env';

interface RandomPhotoInput {
  query: string;
  orientation: 'landscape' | 'portrait' | 'squarish';
}

@Injectable({
  scope: ProviderScope.Application,
})
export class UnsplashApi extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.unsplash.com/';
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set('Authorization', unsplashAccessKey);
  }

  async getRandomPhoto() {
    const trackedRandomPhoto = await trackProvider(
      ({ query, orientation }: RandomPhotoInput) =>
        this.get<RandomPhoto>('photos/random', { query, orientation }),
      {
        provider: 'Unsplash',
        method: 'RandomPhoto',
        location: resolve(__dirname, '../../logs/main'),
      }
    );

    try {
      return (
        await trackedRandomPhoto({
          query: 'portrait',
          orientation: 'squarish',
        })
      ).urls.small;
    } catch (err) {
      console.error('Cannot retrieve random photo:', err);
      return null;
    }
  }
}
