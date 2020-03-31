import { Observable, Subscription } from 'rxjs';
import { BluecompassService, Location, Image } from './../services/bluecompass.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {  MenuController, LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthGuardService } from '../services/auth-guard.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { async } from '@angular/core/testing';
@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit, OnDestroy {
  public staticNodeList = false;
  public staticImageList = false;
  public neighor = [];
  public locations: Observable<Location[]>;
  public imgs: Observable<Image[]>;
  public myImg: any;
  public users: Observable<User[]>;
  public uSub: Subscription;
  public currentUser: User;
  constructor(
    public menuCtrl: MenuController,
    private bluecompassService: BluecompassService,
    private afAuth: AngularFireAuth,
    private authGuardService: AuthGuardService,
    private userService: UserService,
    public loadingController: LoadingController
  ) {
    this.staticNodeList = true;
    if (!this.locations || !this.imgs) {
      this.presentLoading();
    }
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

  ngOnInit() {
    this.locations = this.bluecompassService.getAllLocations();
    this.locations.subscribe(location => {
      location.forEach(element => {
        this.neighor = Object.keys(element.neighbor);
      });
    });
    // console.log(this.locations);
    this.imgs = this.bluecompassService.getAllImage();


    // this below

    // console.log(this.afAuth.auth.currentUser.uid);
    // this.userService.getById(this.afAuth.auth.currentUser.uid).subscribe(user => {
    //   this.currentUser = user;
    // });
    // console.log(this.currentUser);
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);

  }

  staticToggle(event: any) {
    if (event.detail.value === 'node_list') {
      this.staticNodeList = true;
      this.staticImageList = false;
    } else {
      this.staticNodeList = false;
      this.staticImageList = true;
    }
  }

  ngOnDestroy() {
    if (this.uSub) {
      this.uSub.unsubscribe();
    }
  }
}
