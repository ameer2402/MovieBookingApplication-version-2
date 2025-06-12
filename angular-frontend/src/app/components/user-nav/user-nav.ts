import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-nav',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './user-nav.html',
  styleUrls: ['./user-nav.css']
})
export class UserNavComponent implements OnInit {
  constructor() { }
  ngOnInit(): void { }
}