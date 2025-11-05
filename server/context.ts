import { ModuleContext } from '@graphql-modules/core';
import { UnsplashApi } from './modules/chats/unsplash.api';

export type MyContext = ModuleContext & {
  dataSources: {
    unsplashApi: UnsplashApi;
  };
};
