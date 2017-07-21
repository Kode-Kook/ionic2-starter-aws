import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';

import { FirebaseConfig } from './app.config';
import { MyApp } from './app.component';
import { User } from '../providers/user';

import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ConfirmPage } from '../pages/confirm/confirm';
import { RequestPasswordPage } from '../pages/requestPassword/requestPassword';
import { SettingsPage } from '../pages/settings/settings';
import { AboutPage } from '../pages/about/about';
import { AccountPage } from '../pages/account/account';
import { TabsPage } from '../pages/tabs/tabs';
import { TasksPage } from '../pages/tasks/tasks';
import { TasksCreatePage } from '../pages/tasks-create/tasks-create';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    ConfirmPage,
    RequestPasswordPage,
    SettingsPage,
    AboutPage,
    AccountPage,
    TabsPage,
    TasksPage,
    TasksCreatePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(new FirebaseConfig().load()),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    ConfirmPage,
    RequestPasswordPage,
    SettingsPage,
    AboutPage,
    AccountPage,
    TabsPage,
    TasksPage,
    TasksCreatePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    User
  ]
})
export class AppModule {}
