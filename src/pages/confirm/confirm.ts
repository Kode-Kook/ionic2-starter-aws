import { Component } from '@angular/core';

import { LoadingController, ToastController, NavController, NavParams } from 'ionic-angular';

import { User } from '../../providers/user';

@Component({
  selector: 'page-confirm',
  templateUrl: 'confirm.html'
})
export class ConfirmPage {

  public code: string;
  public username: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public user: User,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController) {
    this.username = navParams.get('username');
  }

  resendEmail() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this.user.resendRegistrationEmail(this.username)
      .then((result) => {
        let toast = this.toastCtrl.create({
          message: 'Please check your email.',
          duration: 3000
        });

        loading.dismiss();
        toast.present();
      }).catch((err) => {
        let toast = this.toastCtrl.create({
          message: err,
          duration: 3000,
          position: 'top'
        });

        loading.dismiss();
        toast.present();
      });
  }

  goBack() {
    this.navCtrl.pop();
  }
}
