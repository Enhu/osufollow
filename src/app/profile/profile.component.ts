import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { AppComponent } from '../app.component';
import {AbstractControl} from '@angular/forms';
import APIService from  '../_services/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  submitted = false;
  loading = false;
  profileForm: FormGroup;
  username: string;
  osuId: string;
  email: string;
  

  constructor(private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private  apiService:  APIService,
    private appComponent: AppComponent) { }

  
  ngOnInit() {
    let currentUser =  JSON.parse(localStorage.getItem('currentUser'));
    this.username = currentUser.user;
    this.osuId = currentUser.osuId;
    this.email = currentUser.email;

    this.profileForm = this.formBuilder.group({
      username: [''],
      osuId: [''],
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    },{
      validator: this.MatchPassword
  }); 

    this.profileForm.controls['username'].disable();
    
  }
  
  MatchPassword(AC: AbstractControl) {
    let password = AC.get('password').value; 
    let confirmPassword = AC.get('confirmPassword').value;
     if(password != confirmPassword) {
         AC.get('confirmPassword').setErrors( {MatchPassword: true} )
     } else {
        AC.get('confirmPassword').setErrors(null)
        return null
     }
 }

  showSuccess() {
    this.toastr.success('Please log in again using your new credentials.', 'Success!', { timeOut: 6000 } );
  }

  get f() { return this.profileForm.controls; }

  onSubmit() {
    this.submitted = true;   
    // stop here if form is invalid
    if (this.profileForm.invalid) {
        return;
    }
    this.apiService.updateUser(this.profileForm.getRawValue())
        .pipe(first())
        .subscribe(
            data => {
                    this.authenticationService.logout();
                    this.showSuccess();
                    this.appComponent.loggedIn = false;
                    this.router.navigateByUrl('/login');
            },
            error => {
              
            });
  }
}
