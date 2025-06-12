import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router'; // For routerLink

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './error.html',
  styleUrls: ['./error.css']
})
export class ErrorComponent implements OnInit {
  constructor() { }
  ngOnInit(): void { }
}