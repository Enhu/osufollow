import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { $ } from 'protractor';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
    
  constructor(private router:Router){}

  value = '';
  onEnter(value: string) { 
    this.value = value;
    this.goStats();
  }
 
  goStats(){
    this.router.navigate(['/stats'], { queryParams: { id: this.value}});
  }

  ngOnInit() {
     
    
    
    
    }
}

