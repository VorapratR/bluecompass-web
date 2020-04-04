import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform, NavController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { Subscription, Observable } from 'rxjs';
import { User } from './models/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from './services/user.service';
import { retry } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'หน้าหลัก',
      url: '/main',
      icon: 'business',
    },
    {
      title: 'เพิ่มข้อมูล',
      url: '/add',
      icon: 'add-circle'
    },
    {
      title: 'รายชื่อผู้ใช้',
      url: '/users',
      icon: 'people-circle-outline'
    }
  ];
  public uSub: Subscription;
  public user: Observable<User>;
  public currentUser: User;
  public isAdmin: boolean;
  public isContributor: boolean;

  constructor(
    private platform: Platform,
    public menuCtrl: MenuController,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private userService: UserService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logout() {
    this.authService.logoutUser()
      .then(res => {
        // console.log(this.afAuth.auth.currentUser);
        this.currentUser = null;
        this.navCtrl.navigateBack('login');
      });

  }

  ngOnInit() {
  }

  getCurrentUser() {
    if (this.afAuth.auth.currentUser !== null && !this.currentUser) {
      console.log('x');
      this.uSub = this.userService.getById(this.afAuth.auth.currentUser.uid).subscribe(user => {
        this.currentUser = user;
        this.isAdmin = this.userService.isAdmin(this.currentUser);
        this.isContributor = this.userService.isContributor(this.currentUser);
        console.log(this.currentUser);
      });
    }
    return this.currentUser ? true : false;
  }

  ngOnDestroy() {
    if (this.uSub) {
      this.uSub.unsubscribe();
    }
  }

}
