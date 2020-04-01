import { Component, OnInit } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'หน้าหลัก',
      url: '/main',
      icon: 'business'
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

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private navCtrl: NavController,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  test() {
    console.log('test');
  }

  logout() {
    this.authService.logoutUser()
      .then(res => {
        // console.log(this.afAuth.auth.currentUser);
        this.navCtrl.navigateBack('login');
      });
  }
  ngOnInit() {
  }
}
