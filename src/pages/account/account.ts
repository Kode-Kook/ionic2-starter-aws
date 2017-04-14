import { Component, ViewChild } from '@angular/core';

import { Config, NavController } from 'ionic-angular';

import { AWS, DynamoDB, User } from '../../providers/providers';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  
  @ViewChild('avatar') avatarInput;

  private s3: any;
  public avatarPhoto: string;
  public attributes: any;
  public sub: string = null;

  constructor(public navCtrl: NavController, public aws: AWS, public user: User, public db: DynamoDB, public config: Config) {
    let self = this;
    let AWS = aws.getAWS();
    this.attributes = [];
    this.s3 = new AWS.S3({
      'params': {
        'Bucket': config.get('aws_user_files_s3_bucket')
      },
      'region': config.get('aws_user_files_s3_bucket_region')
    });
    this.sub = (this.aws.getAWS().config.credentials as any).identityId;
    this.avatarPhoto = this.s3.getSignedUrl('getObject', {'Key': 'protected/' + self.sub + '/avatar'});
    user.getUser().getUserAttributes(function(err, data) {
      self.attributes = data;
    });
  }

  selectAvatar() {
    this.avatarInput.nativeElement.click();
  }

  upload() {
    let self = this;
    if (this.avatarInput.nativeElement.files[0]) {
      this.s3.upload({
        'Key': 'protected/' + self.sub + '/avatar',
        'Body': self.avatarInput.nativeElement.files[0],
        'ContentType': self.avatarInput.nativeElement.files[0].type
      }).promise().then((data) => {
        this.avatarPhoto = this.s3.getSignedUrl('getObject', {'Key': 'protected/' + self.sub + '/avatar'});
        console.log('upload complete:', data);
      }).catch((err) => {
        console.log('upload failed....', err);
      });
    }
      
  }
}
