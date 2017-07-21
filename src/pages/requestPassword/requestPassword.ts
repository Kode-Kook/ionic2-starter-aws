import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { User } from '../../providers/providers';

export class RequestPasswordDetails {
  username: string;
}

@Component({
  selector: 'page-requestPassword',
  templateUrl: 'requestPassword.html'
})
export class RequestPasswordPage {
  public requestPasswordDetails: RequestPasswordDetails;

  constructor(public navCtrl: NavController,
              public user: User,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController) {
    this.requestPasswordDetails = new RequestPasswordDetails();
  }

  requestPassword() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    let details = this.requestPasswordDetails;

    console.log('requestPassword..');

    this.user.requestPassword(details.username)
      .then((result) => {
        let toast = this.toastCtrl.create({
          message: 'Email sent.',
          duration: 3000
        });

        console.log('result:', result);
        loading.dismiss();
        toast.present();

        this.navCtrl.setRoot(LoginPage);
      }).catch((err) => {
        console.log('error', err);
        loading.dismiss();
      });
  }

  login() {
    this.navCtrl.push(LoginPage);
  }
}
