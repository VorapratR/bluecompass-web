import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export interface Location {
  id?: string;
  neighbor: {};
  x: number;
  y: number;
  floor: number;
  name: string;
}

export interface Image {
  url: string;
}
export class BluecompassService {
  private locations: Observable<Location[]>;
  private img: Observable<Image[]>;
  private locationCollection: AngularFirestoreCollection<Location>;
  private imgCollection: AngularFirestoreCollection<Image>;
  constructor(private afs: AngularFirestore) {
    this.locationCollection = this.afs.collection<Location>('location');
    this.locations = this.locationCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );

    this.imgCollection = this.afs.collection<Image>('img');
    this.img = this.imgCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getAllLocations(): Observable<Location[]> {
    return this.locations;
  }

  getLocationByID(id: string): Observable<Location> {
    return this.locationCollection.doc<Location>(id).valueChanges().pipe(
      take(1),
      map(idea => {
        idea.id = id;
        return idea;
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
    return this.locationCollection.doc(location.id).update({ name: location.name, floor: location.floor, x: location.x, y: location.y });
  }

  deletelocation(id: string): Promise<void> {
    return this.locationCollection.doc(id).delete();
  }
}
