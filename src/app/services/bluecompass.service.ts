import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { element } from 'protractor';

export interface Location {
  id?: string;
  neighbor: {};
  neighborList: string;
  x_point: number;
  y_point: number;
  floor: number;
  name: string;
}

export interface Image {
  data: string;
  name: string;
  tag: string;
}

@Injectable({
  providedIn: 'root'
})

export class BluecompassService {
  private locations: Observable<Location[]>;
  private imgs: Observable<Image[]>;
  private locationCollection: AngularFirestoreCollection<Location>;
  private imgCollection: AngularFirestoreCollection<Image>;
  constructor(private afs: AngularFirestore) {
    this.locationCollection = this.afs.collection<Location>('location');
    this.locations = this.locationCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const uid = a.payload.doc.id;
          // console.log(id);
          console.log({ uid, ...data });
          return { uid, ...data };
        });
      })
    );

    this.imgCollection = this.afs.collection<Image>('img');
    this.imgs = this.imgCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          // console.log({ id, ...data });
          return { id, ...data };
        });
      })
    );
  }

  getAllLocations(): Observable<Location[]> {
    return this.locations;
  }

  getAllImage(): Observable<Image[]> {
    return this.imgs;
  }

  getLocationByID(id: string) {
    return this.locationCollection.doc<Location>(id).valueChanges().pipe(
      take(1),
      map(location => {
        return location;
      })
    );
  }

  addLocation(location: Location): Promise<DocumentReference> {
    return this.locationCollection.add(location);
  }

  addImg(img: Image): Promise<DocumentReference> {
    return this.imgCollection.add(img);
  }

  updateLocation(location: Location): Promise<void> {
    return this.locationCollection.doc(location.id).update({
      name: location.name, floor: location.floor,
      x_point: location.x_point, y_point: location.y_point
    });
  }

  deletelocation(id: string): Promise<void> {
    return this.locationCollection.doc(id).delete();
  }
}
