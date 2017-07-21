import { Injectable } from '@angular/core';
import { Config } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class User {
  private user: any;
  public loggedIn: boolean = false;

  constructor(public config: Config,
    private afAuth: AngularFireAuth) {
    this.user = null;
  }

  getUser() {
    return this.user;
  }

  getUsername() {
    return this.getUser().email;
  }

  login(username, password) {
    return new Promise((resolve, reject) => {
      let credential = firebase.auth.EmailAuthProvider.credential(
          username,
          password
      );

      this.afAuth.auth.signInAndRetrieveDataWithCredential(credential)
        .then((userCredential) => {
          console.log("Sign In Success", userCredential);

          if (userCredential.user.emailVerified === false) {
            reject({
              message: "User is not confirmed."
            });
          }

          this.isAuthenticated().then(() => {
            resolve();
          }).catch((error) => {
            console.log('auth session failed');
            reject(error);
          });
        }, (error) => {
          console.log('authentication failed');
          reject(error);
        });
    });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  register(username, password, attributes) {
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(username, password)
        .then((user) => {
          user.sendEmailVerification();
          user.updateProfile(attributes)
            .then(() => {
              resolve(user);
            }, (error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  resendRegistrationEmail(username) {
    return new Promise((resolve, reject) => {
      let user = firebase.auth().currentUser;
      user.sendEmailVerification()
        .then(function() {
          resolve();
        }, function(error) {
          console.log('could not resend code..', error);
          reject(error);
        });
    });
  }

  requestPassword(username) {
    return new Promise((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(username)
        .then(function() {
          resolve();
        }, function(error) {
          console.log('could not resend code..', error);
          reject(error);
        });
    });
  }

  isAuthenticated() {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user != null) {
          this.user = user;
          resolve()
        } else {
          reject()
        }
      });
    });
  }
}
