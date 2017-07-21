import { Component } from '@angular/core';

import { NavController, ModalController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { TasksCreatePage } from '../tasks-create/tasks-create';

import {  User } from '../../providers/providers';

@Component({
  selector: 'page-tasks',
  templateUrl: 'tasks.html'
})
export class TasksPage {

  public items: FirebaseListObservable<any>;
  public refresher: any;

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public db: AngularFireDatabase,
              public user: User) {

    this.refreshTasks();
  }

  refreshData(refresher) {
    this.refresher = refresher;
    this.refreshTasks()
  }

  refreshTasks() {
    this.items = this.db.list('/items');
  }

  addTask() {
    let addModal = this.modalCtrl.create(TasksCreatePage);
    addModal.onDidDismiss(item => {
      if (item) {
        item.userId = this.user.getUser().uid;
        item.created = (new Date().getTime() / 1000);

        this.items.push(item)
          .catch((err) => {
            console.log(err);
          });
      }
    })
    addModal.present();
  }

  deleteTask(task, index) {
    this.items.remove(task.$key)
      .catch((err) => {
        console.log(err);
      });
  }

}
