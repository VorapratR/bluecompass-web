import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { async } from '@angular/core/testing';
import { element } from 'protractor';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { timingSafeEqual } from 'crypto';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit, OnDestroy {

  constructor(
    private userService: UserService,
    private formbuilder: FormBuilder,
    private navCtrl: NavController,
    public loadingController: LoadingController,
    public toastController: ToastController
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
  msg = '';
  // errorMsg = '';

  ngOnInit() {
    this.getUser();
    this.users.subscribe(users => {
      users.map( user => {
        this.userBuf.push(user);
      });
      console.log(this.userBuf);
    });
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
    });
    toast.present();
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
    this.userBuf.map( user => {
      this.userService.updateRole(user).then(() => {
        this.msg = 'บันทึกสำเร็จ';
      }, err => {
        this.msg = 'เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง';
        console.log(err);
      });
    });
    this.navCtrl.navigateForward('/main');
  }

  ngOnDestroy() {
    this.userBuf = [];
  }

  ionViewWillLeave() {
    this.userBuf = [];
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
