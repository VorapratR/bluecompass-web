import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit, OnDestroy, OnChanges {

  constructor(
    private afAuth: AngularFireAuth,
    private authGuardService: AuthGuardService,
    private userService: UserService,
  ) { }

  user: any;
  uSub: Subscription;

  ngOnInit() {

  }

  ngOnChanges() {
    // console.log(this.user.displayName);
  }

  ngOnDestroy() {
    if (this.uSub) {
      this.uSub.unsubscribe();
    }
  }

}
