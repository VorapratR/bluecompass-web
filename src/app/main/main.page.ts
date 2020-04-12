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
  public uSub: Subscription;
  public user: Observable<User>;
  public currentUser: User;
  public isAdmin: boolean;
  public isContributor: boolean;
  public allLocations: Array<Location> = [];
  public filterLocations: Array<Location>  = [];
  public lastPage  = false;
  public textStatus = 'รายการจุดเครื่องหมาย';
   searchInput = '';

  constructor(
    public menuCtrl: MenuController,
    private bluecompassService: BluecompassService,
    private afAuth: AngularFireAuth,
    private userService: UserService,
    public loadingController: LoadingController
  ) {
    this.staticNodeList = true;
    if (!this.locations || !this.imgs) {
      this.presentLoading();
    }

  }

  inputSearch(event) {
    this.textStatus = 'ผลการค้นหา';
    this.searchInput = event.target.value;
    this.setFilteredLocations();
  }
  setFilteredLocations() {
    this.filterLocations = this.allLocations.filter((item) => {
      return item.id.toLowerCase().indexOf(this.searchInput.toLowerCase()) > -1;
    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'กรุณารอสักครู่...',
      duration: 2000
    });
    await loading.present();
    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  async ngOnInit() {
    await this.loadUser();
    await this.loadLocation();
  }

  async loadLocation() {
    this.locations = this.bluecompassService.getAllLocations();
    this.locations.subscribe(location => {
      location.forEach(element => {
        this.neighor = Object.keys(element.neighbor);
      });
    });

    this.bluecompassService.getAllLocations().subscribe(
      results => {
        // console.log(results);
        this.allLocations = results;
        this.filterLocations = results;
      }
    );

    // console.log(this.locations);
    this.imgs = this.bluecompassService.getAllImage();
    // console.log('location done');
  }

  async loadUser() {
    this.uSub = this.userService.getById(this.afAuth.auth.currentUser.uid).subscribe(user => {
      this.currentUser = user;
      this.isAdmin = this.userService.isAdmin(this.currentUser);
      this.isContributor = this.userService.isContributor(this.currentUser);
    });
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
