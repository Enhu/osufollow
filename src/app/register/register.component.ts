import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import  APIService from '../api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor( private formBuilder: FormBuilder, private apiService : APIService,  private router: Router) { }

  ngOnInit() {
    //takes data from the form and validates the inputs
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      osuId: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
  });
  
  }

  // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

  onSubmit(){

  //if the registration is invalid, it voids out
  if (this.registerForm.invalid) {
      return;
   }

  //do the post request and go back to the log in page
   this.apiService.registerUser(this.registerForm.value)
    .subscribe(
      data => {
        this.router.navigate(['/login'])
      },
      error => {
        console.log(error);
      }
    )
  }

}
