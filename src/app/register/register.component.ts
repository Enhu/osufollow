import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { APIService } from '../_services/api.service';
import { ToastrService } from 'ngx-toastr';
import {AbstractControl} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  submitted = false;
  loading = false;
  registerForm: FormGroup;
  constructor(private toastr: ToastrService, private formBuilder: FormBuilder, private apiService : APIService,  private router: Router) { }

  ngOnInit() {
    //takes data from the form and validates the inputs
    this.registerForm = this.formBuilder.group({
      avatar: [''],
      username: ['', Validators.required],
      osuId: [''],
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
  },{
      validator: this.MatchPassword
  });
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
  
  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }


  showFailure(){
    this.toastr.error('Username or email are already taken.', 'Error', { timeOut: 6000 } )
  }

  showSuccess() {
    this.toastr.success('Please log in using your credentials.', 'Success!', { timeOut: 6000 } );
  }

  onSubmit(){
  this.submitted = true;
  this.loading = true;
  //if the registration is invalid, it voids out
  if (this.registerForm.invalid) {
      this.loading = false;
      return;
   }

  //do the post request and go back to the log in page
   this.apiService.registerUser(this.registerForm.value)
    .subscribe(
      data => {
        /*var response = JSON.parse(data);
        if(response.userExists){
          this.showSuccess();
          this.router.navigate(['/login'])
        }
        else
        {
          this.showFailure();
          return;
        }*/
      },
      error => {
        console.log(error);
      }
    )
  }

}
