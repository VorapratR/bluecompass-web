import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { async } from '@angular/core/testing';
import { element } from 'protractor';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit, OnDestroy {

  constructor(
    private userService: UserService,
    private formbuilder: FormBuilder,
    public loadingController: LoadingController
  ) {
    if (!this.users || this.userBuf === []) {
      this.presentLoading();
    }
  }

  rolesForm: FormGroup;

  roles: any[] = [
    {
      value: 'guest',
      label: 'guest'
    },
    {
      value: 'admin',
      label: 'ผู้ดูแลระบบ'
    },
    {
      value: 'contributor',
      label: 'เจ้าหน้าที่'
    }
  ];

  users: Observable<User[]>;
  formValue = {};
  usersObj: {};
  userBuf = [];
  ngOnInit() {
    this.getUser();
    this.users.subscribe(users => {
      users.map( user => {
        this.userBuf.push(user);
      });
      console.log(this.userBuf);
    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();
    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  submitData() {
    this.users.subscribe( users => {
      users.map( user => {
        console.log(user.displayName, user.roles);
      });
    });
  }

  ngOnDestroy() {
    // this.users.unsubscribe();
  }

  async getUser() {
    this.users = this.userService.getAll();
  }

  rolesChange(value, id) {
    console.log(value, id);
    const indexOfChangeUser = this.userBuf.map( user => {
      return user;
      }).findIndex(user => user.id === id);
    this.userBuf[indexOfChangeUser].roles = value;
  }

}
