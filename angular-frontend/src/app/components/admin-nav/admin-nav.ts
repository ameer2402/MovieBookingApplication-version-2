import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router'; // For routerLink

@Component({
  selector: 'app-admin-nav',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin-nav.html',
  styleUrls: ['./admin-nav.css']
})
export class AdminNavComponent implements OnInit {
  constructor() { }
  ngOnInit(): void { }
}