import { Injectable } from '@angular/core';

declare const firebase_api_key;
declare const firebase_auth_domain;
declare const firebase_database_url;
declare const firebase_project_id;
declare const firebase_storage_bucket;
declare const firebase_messaging_sender_id;

@Injectable()
export class FirebaseConfig {
  public load() {

    // Expects global const values defined by firebase-config.js
    const cfg = {
      "apiKey": firebase_api_key,
      "authDomain": firebase_auth_domain,
      "databaseURL": firebase_database_url,
      "projectId": firebase_project_id,
      "storageBucket": firebase_storage_bucket,
      "messagingSenderId": firebase_messaging_sender_id
    };

    return cfg;
  }
}
