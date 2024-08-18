import { Client, Databases, Account } from 'appwrite';
import { config } from './config.js';

const client = new Client()
    .setEndpoint(config.APPWRITE_ENDPOINT)
    .setProject(config.APPWRITE_PROJECT_ID);

const databases = new Databases(client, config.DATABASE_ID);
const account = new Account(client);


export { client, databases, account };
