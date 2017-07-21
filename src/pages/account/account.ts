import { Component, ViewChild } from '@angular/core';
import { Platform, LoadingController, NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import * as firebase from 'firebase/app';
import 'firebase/storage';

import { User } from '../../providers/providers';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {

  @ViewChild('avatar') avatarInput;

  public avatarPhoto: string;
  public selectedPhoto: Blob;
  public attributes: any;
  public sub: string = null;

  constructor(public platform: Platform,
              public navCtrl: NavController,
              public user: User,
              public camera: Camera,
              public loadingCtrl: LoadingController) {
    this.attributes = [];
    this.avatarPhoto = user.getUser().photoURL;
    this.selectedPhoto = null;
    this.sub = user.getUser().uid;
    this.attributes = [
      { name: 'displayName', value: user.getUser().displayName },
      { name: 'email', value: user.getUser().email },
      { name: 'emailVerified', value: user.getUser().emailVerified },
      { name: 'photoURL', value: user.getUser().photoURL },
      { name: 'uid', value: user.getUser().uid }
    ];
    this.refreshAvatar();
  }

  refreshAvatar() {
    let storageRef   = firebase.storage().ref();
    let mountainsRef = storageRef.child('protected/' + this.sub + '/avatar.jpg');

    mountainsRef.getDownloadURL().then((url) => {
       this.avatarPhoto = url;
    });
  }

  dataURItoBlob(dataURI) {
    // code adapted from: http://stackoverflow.com/questions/33486352/cant-upload-image-to-aws-s3-from-ionic-camera
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  };

  selectAvatar() {
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 200,
      targetWidth: 200,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    if (this.platform.is('cordova')) {
      this.camera.getPicture(options).then((imageData) => {
        let loading = this.loadingCtrl.create({
          content: 'Please wait...'
        });
        loading.present();
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        this.selectedPhoto  = this.dataURItoBlob('data:image/jpeg;base64,' + imageData);
        this.upload(loading);
      }, (err) => {
        // Handle error
      });
    } else {
      this.avatarInput.nativeElement.click();
    }
  }

  uploadFile($event) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.selectedPhoto = $event.target.files[0];
    this.upload(loading);
  }

  upload(loading: any) {
    if (this.selectedPhoto) {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let storageRef   = firebase.storage().ref();
      let mountainsRef = storageRef.child('protected/' + this.sub + '/avatar.jpg');

      const uploadTask = mountainsRef.put(this.selectedPhoto);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on('state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          console.log('Upload is ' + progress + '% done');

          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;
          }
        }, (error) => {
          // Handle unsuccessful uploads
          console.log('upload failed....', error);
          loading.dismiss();
        }, () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          let downloadURL = uploadTask.snapshot.downloadURL;

          this.attributes.photoURL = downloadURL;
          this.refreshAvatar();

          console.log('upload complete');
          loading.dismiss();
        }
      );
    }
  }
}
