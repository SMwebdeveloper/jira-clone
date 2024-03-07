import { Client, Account, ID } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('65e8acccc26a9cae7c37');

export const ACCOUNT = new Account(client)
export const UNIQUE_ID = ID.unique()
