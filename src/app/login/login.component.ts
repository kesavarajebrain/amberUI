import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonService } from './services/common.service'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm', { static: false }) loginForm: NgForm;
  @ViewChild('userloginForm', { static: false }) userloginForm: NgForm;

  public loginData: any = {}
  public loginuserData: any = {}
  showLogDiv: boolean;
  constructor(private _snackBar: MatSnackBar, private route: Router, private common_service: CommonService) { }

  ngOnInit() {
    this.showLogDiv = false;
  }

  login() {
    if (this.loginForm.invalid) {
      this._snackBar.open('Please fill all the fields!', '', {
        duration: 2000,
        verticalPosition: 'top'
      });
    } else {
      console.log(this.loginData)
      this.common_service.addUser(this.loginData).subscribe(data => {
        console.log(data)
        if (data.statusCode == 200) {
          this._snackBar.open(data.msg, '', {
            duration: 2000,
            verticalPosition: 'top'
          });
          localStorage.setItem('LoggedUser', JSON.stringify(data.data))
          this.route.navigate(['/dashboard'])
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

  loginUser() {
    if (this.userloginForm.invalid) {
      this._snackBar.open('Please fill all the fields!', '', {
        duration: 2000,
        verticalPosition: 'top'
      });
    } else {
      this.common_service.loginUser(this.loginuserData).subscribe(data => {
        if (data.statusCode == 200) {
          this._snackBar.open(data.msg, '', {
            duration: 2000,
            verticalPosition: 'top'
          });
          localStorage.setItem('LoggedUser', JSON.stringify(data.data))
          this.route.navigate(['/dashboard'])
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

  logDiv() {
    this.showLogDiv = true;
  }

  signDiv() {
    this.showLogDiv = false;
  }
}
