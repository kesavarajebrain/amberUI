import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonService } from '../login/services/common.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
declare var require: any;
const Swal = require('sweetalert2');

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  welcome: string;
  displayedColumns: string[] = ['slno', 'trainName', 'trainRoute', 'status', 'action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  seatData: any = {};
  seatData1:any = {};
  constructor(private _snackBar: MatSnackBar, private route: Router, private common_service: CommonService) { }

  ngOnInit() {
    var User_name = JSON.parse(localStorage.getItem('LoggedUser')).userName;
    var date = new Date();
    var hour = date.getHours();
    if (hour < 12) {
      this.welcome = "Good morning" + " " + User_name + "!";
    } else if (hour < 16) {
      this.welcome = "Good afternoon" + " " + User_name + "!";
    } else if (hour < 20) {
      this.welcome = "Good evening" + " " + User_name + "!";
    } else {
      this.welcome = "Welcome back" + " " + User_name + "!";
    }

    this.bookingHistory();
  }

  bookingHistory() {
    var User_name = JSON.parse(localStorage.getItem('LoggedUser'))._id;
    var User = {
      _id: User_name
    }
    this.common_service.bookingHistory(User).subscribe(data => {
      console.log(data)
      if (data.statusCode == 200) {
        this.dataSource = new MatTableDataSource(data.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.data = data.data;
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


  logout() {
    localStorage.removeItem('LoggedUser');
    this.route.navigate(['/login'])
  }

  cancelTicket(data) {
    console.log(data.trainId)
    this.updateSeats(data);
    this.seatData.trainId = data.trainId;
    this.common_service.getSeat(this.seatData).subscribe(trdata => {
      if (trdata.statusCode == 200) {
        console.log(trdata.data)
        this.seatData = {
          trainId:trdata.data[0]._id,
          available:trdata.data[0].available,
          booked:trdata.data[0].booked,

        }
        console.log(this.seatData)
        this.seatData1 = {
          trainId:trdata.data[0]._id,
          available:trdata.data[0].available + 1,
          booked:trdata.data[0].booked - 1,

        }
        console.log(this.seatData1)
        this.common_service.updateSeat(this.seatData1).subscribe(data => {
          console.log(data)
          if (data.statusCode == 200) {
            console.log(data)
            this.bookingHistory();
            // this.updateSeats(data);
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
    },
      err => {
    
      })
  }


  // {

  // }

  updateSeats(data) {
    var b = {
      _id:data._id
    }
    this.common_service.cancelTicket(b).subscribe(data => {
      console.log(b)
      if (data.statusCode == 200) {
        Swal.fire({
          icon: 'error',
          title: 'Ticket Cancelled',
          text: 'Your ticket dully cancelled!',
        })
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
