import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {CommonService } from './services/common.service'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm', { static: false }) loginForm: NgForm;
  public loginData : any = {}
  constructor(private _snackBar: MatSnackBar, private route : Router, private common_service:CommonService) { }

  ngOnInit() {
  }

  login() {
    if(this.loginForm.invalid){
      this._snackBar.open('Please fill all the fields!', '', {
        duration: 2000,
        verticalPosition: 'top'
      });
    }else{
      console.log(this.loginData)
      this.common_service.addUser(this.loginData).subscribe(data=>{
        console.log(data)
      },
      err=>{

      })
    }
  }

}
