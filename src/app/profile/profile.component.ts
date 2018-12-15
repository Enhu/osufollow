import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { AppComponent } from '../app.component';
import {AbstractControl} from '@angular/forms';
import APIService from  '../_services/api.service';
import { FileValidator } from '../_helpers/file.validator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  genericImgSrc: any = "../../assets/img/genericAvatar.png"
  imageSrc: string;
  submitted = false;
  loading = false;
  profileForm: FormGroup;
  username: string;
  osuId: string;
  email: string;
  password: string;
  confirmPassword: string;
  

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
    this.password = 'password';
    this.confirmPassword = 'password';

    if(currentUser.avatar == ''){
      this.imageSrc = this.genericImgSrc;
    }else{
      this.imageSrc = currentUser.avatar;
    }
  
    this.profileForm = this.formBuilder.group({
      avatar: [''],
      username: [''],
      osuId: [''],
      email: ['', Validators.required],
      password: ['', [Validators.minLength(6), Validators.required]],
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

 previewImage(event) {
   if (event.target.files && event.target.files[0]) {

    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.toastr.error('Only images are supported.', 'Error', { timeOut: 6000 } );
      console.log("Only images are supported.");
      return;
    }
    
    if(event.target.files[0].size > 88000){
      this.toastr.error('File size is too big.', 'Error', { timeOut: 6000 } );
      console.log("Size too big.")
      return;   
    }

     var reader = new FileReader();
    
     reader.readAsDataURL(event.target.files[0]); // read file as data url

     reader.onload = (event : any) => { // called once readAsDataURL is completed
       this.imageSrc = event.target.result;
       this.profileForm.patchValue({
        avatar: reader.result
       })
     }
   }
 }

  showSuccess() {
    this.toastr.success('Please log in again using your new credentials.', 'Success!', { timeOut: 6000 } );
  }

  get f() { return this.profileForm.controls; }

  onSubmit() {
    let currentUser =  JSON.parse(localStorage.getItem('currentUser'));
    this.loading = true;
    this.submitted = true;   
    // stop here if form is invalid
    if (this.profileForm.invalid) {
        this.loading = false;
        return;
    }

    if(this.profileForm.value.avatar == ""){
      this.profileForm.patchValue({
        avatar: currentUser.avatar
      })
    }

    if(this.profileForm.value.password == "password"){
      this.profileForm.patchValue({
        password: currentUser.password
      })
    }

    if(this.profileForm.value.confirmPassword == "password"){
      this.profileForm.patchValue({
        password: currentUser.password
      })
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
