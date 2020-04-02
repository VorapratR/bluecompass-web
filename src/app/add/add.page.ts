import { Router, ActivatedRoute } from '@angular/router';
import { BluecompassService, Location, Image } from './../services/bluecompass.service';
import { Component, OnInit} from '@angular/core';
import { element } from 'protractor';
import { Observable } from 'rxjs';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  nodes = [];
  neighborNode = [];

  buildingID: string;
  buildingFloor: number;
  buildingName: string;

  nodeNameBuffer: string[] = [];
  nodeXpointBuffer: number[] = [];
  nodeYpointBuffer: number[] = [];
  nodeIDBuffer: string[] = [];
  nodeNeighborBuffer: string[] = [];

  base64Image = '';
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;

  location: Location = {
    id: '',
    name: '',
    x_point: 0,
    y_point: 0,
    floor: 0,
    neighbor: {},
    neighborList: ''
  };
  locations: Location[] = [];
  img: Image;

  tmpLocation;
  tmp;
  editStage = false;

  constructor(
    private bluecompassService: BluecompassService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.getNodeById(this.activatedRoute.snapshot.paramMap.get('id'));
    }
  }

  ionViewWillEnter() {
    // this.url_id = this.activatedRoute.snapshot.paramMap.get('id');
    // console.log(this.url_id);
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.editStage = true;
    }
  }
  addNode() {
    this.locations.push(this.location);
  }
  delNode() {
    this.locations.pop();
  }

  getNodeById(id: string) {
    // console.log('in get node id');
    this.tmpLocation = this.bluecompassService.getLocationByID(id);
    console.log(this.tmpLocation);
    this.tmpLocation.forEach(location => {
      console.log(location);
    });

  }

  submitForm() {
    this.router.navigateByUrl(`/main`);
    this.locations.forEach((node, i) => {
      node.id = `${this.buildingID}${this.buildingFloor}_${i}`;
      node.name = this.nodeNameBuffer[i];
      node.x_point = this.nodeXpointBuffer[i];
      node.y_point = this.nodeYpointBuffer[i];
      node.floor = this.buildingFloor;
      node.neighborList = this.nodeNeighborBuffer[i].toString();
      const perNeighbor = {};
      this.nodeNeighborBuffer[i].split(',').forEach(neighbor => {
        perNeighbor[neighbor] = 1;
      });
      node.neighbor = perNeighbor;
    });
    this.img = {
      data : this.previewUrl,
      name : this.buildingName,
      tag: this.buildingID + this.buildingFloor,
    };
    if (this.locations.length && this.img.data) {
      this.addLocationImage();
    } else {
      console.log('Dont Have Data');
    }
  }

  fileProgress(fileInput: any) {
    this.fileData = fileInput.target.files[0];
    this.preview();
  }

  preview() {
    const mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (event) => {
      this.previewUrl = reader.result;
    };
  }

  addLocationImage() {
    const dataStatus = {
      location: false,
      img: false
    };
    console.log(this.img);
    this.locations.forEach(location => {
      console.log(location);
      if (location.id) {
        this.bluecompassService.addLocation(location).then(() => {
          console.log('Location added');
          dataStatus.location = true;
        }, err => {
          console.log('There was a problem adding your location:(');
        });
      } else {
        console.log('No location');
      }
    });
    if (this.img.data) {
      this.bluecompassService.addImg(this.img).then(() => {
          console.log('Img added');
          dataStatus.img = true;
        }, err => {
          console.log('There was a problem adding your Img:(');
        });
      } else {
        console.log('No Image');
    }
  }

  deleteIdea() {
    console.log('del');
  }

  updateIdea() {
    console.log('update');
  }
}
