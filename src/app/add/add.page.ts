import { BluecompassService, Location, Image } from './../services/bluecompass.service';
import { Component, OnInit} from '@angular/core';
import { element } from 'protractor';
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
  };
  locations: Location[] = [];
  img: Image;

  constructor(private bluecompassService: BluecompassService) {}

  ngOnInit() {}

  addNode() {
    this.locations.push(this.location);
  }

  submitForm() {
    this.locations.forEach((node, i) => {
      node.id = `${this.buildingID}_${this.buildingFloor}-${i}`;
      node.name = this.nodeNameBuffer[i];
      node.x_point = this.nodeXpointBuffer[i];
      node.y_point = this.nodeYpointBuffer[i];
      node.floor = this.buildingFloor;
      const perNeighbor = {};
      this.nodeNeighborBuffer[i].split(',').forEach(neighbor => {
        perNeighbor[neighbor] = 1;
      });
      node.neighbor = perNeighbor;
    });
    this.img = {
      data : this.previewUrl,
      name : this.buildingName
    };
    this.addLocationImage();
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
    this.locations.forEach(location => {
      console.log(location);
      if (location.id) {
        this.bluecompassService.addLocation(location).then(() => {
          console.log('Location added');
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
        }, err => {
          console.log('There was a problem adding your Img:(');
        });
      } else {
        console.log('No Image');
    }
  }
}
