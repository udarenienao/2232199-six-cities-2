import 'reflect-metadata';
import {Component} from './types/component.js';
import Application from './app/application.js';
import {Container} from 'inversify';
import { createApplicationContainer } from './app/container.js';
import { createUserContainer } from './modules/user/container.js';
import { createOfferContainer } from './modules/offer/container.js';
import { createCommentContainer } from './modules/comment/container.js';


const mainContainer = Container.merge(
  createApplicationContainer(),
  createUserContainer(),
  createOfferContainer(),
  createCommentContainer());
const application = mainContainer.get<Application>(Component.Application);
await application.init();
