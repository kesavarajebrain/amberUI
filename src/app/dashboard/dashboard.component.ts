import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonService } from '../login/services/common.service';
declare var require: any;
const Swal = require('sweetalert2');

interface FromDesination {
  value: string;
  viewValue: string;
}
interface ToDesination {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  welcome: any
  @ViewChild('searchForm', { static: false }) searchForm: NgForm;
  public searchData: any = {}
  startPoint: FromDesination[] = [
    { value: 'Madurai', viewValue: 'Madurai' },
    { value: 'Tiruchirappalli', viewValue: 'Tiruchirappalli' },
    { value: 'Thanjavur', viewValue: 'Thanjavur' },
  ];
  endPoint: ToDesination[] = [
    { value: 'Coimbatore', viewValue: 'Coimbatore' },
    { value: 'Chennai', viewValue: 'Chennai' },
    { value: 'Kanyakumari', viewValue: 'Kanyakumari' }
  ];
  showTrainsDiv: boolean;
  trainData: any;
  bookingData: any = {};
  seatData: any = {
    available: Number,
  }
  hideBooking: boolean;
  constructor(private _snackBar: MatSnackBar, private route: Router, private common_service: CommonService) { }

  ngOnInit() {
    var User_name = JSON.parse(localStorage.getItem('LoggedUser')).userName;
    var date = new Date();
    var hour = date.getHours();
    this.showTrainsDiv = false;
    if (hour < 12) {
      this.welcome = "Good morning" + " " + User_name + "!";
    } else if (hour < 16) {
      this.welcome = "Good afternoon" + " " + User_name + "!";
    } else if (hour < 20) {
      this.welcome = "Good evening" + " " + User_name + "!";
    } else {
      this.welcome = "Welcome back" + " " + User_name + "!";
    }
  }

  searchTrains() {
    if (this.searchForm.invalid) {
      this._snackBar.open('Please select destination!', '', {
        duration: 2000,
        verticalPosition: 'top'
      });
    } else {
      console.log(this.searchData)
      var route = this.searchData.startpoint + " - " + this.searchData.endpoint;
      var routeObj = {
        route: route
      }
      console.log(routeObj)
      this.common_service.searchTrain(routeObj).subscribe(data => {
        console.log(data)
        if (data.statusCode == 200) {
          if (data.data.length == 1) {
            this.hideBooking = true;
            this.showTrainsDiv = true;
            this.trainData = data.data[0];
            if(this.trainData.totalseats == this.trainData.booked){
              this.hideBooking = false;
            }
          } else {
            this.showTrainsDiv = false;
            this._snackBar.open('No trains available this route!', '', {
              duration: 2000,
              verticalPosition: 'top'
            });
          }
        }
        if (data.statusCode == 400) {
          this._snackBar.open(data.msg, '', {
            duration: 2000,
            verticalPosition: 'top'
          });
        }
      },
        err => {

        })
    }
  }

  bookSeat(data) {
    this.bookingData.trainName = data.trainName;
    this.bookingData.trainNo = data.trainNo;
    this.bookingData.trainRoute = data.trainRoute;
    this.bookingData.available = data.available;  
    this.bookingData.booked = data.booked;
    this.bookingData.trainId = data._id;
    this.bookingData.status = "Booked";
    this.bookingData.userId = JSON.parse(localStorage.getItem('LoggedUser'))._id;

    this.seatData.available = data.available - 1;
    this.seatData.booked = data.booked + 1;
    this.seatData.trainId = data._id;
    this.common_service.updateSeat(this.seatData).subscribe(data => {
      console.log(data)
      this.updateSeat(this.bookingData);
    },
      err => {

      })
  }

  updateSeat(data) {
    console.log(data)
    this.common_service.bookTrain(data).subscribe(data => {
      console.log(data)
      if (data.statusCode == 200) {
        Swal.fire(
          'Seat Booked!',
          'Your Booking is confirmed!',
          'success'
        )
        this.searchTrains();
      }
    },
      err => {

      })
  }

  logout(){
    localStorage.removeItem('LoggedUser');
    this.route.navigate(['/login'])
  }
}
