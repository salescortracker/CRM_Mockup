import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = true; // Set to true for demo

  currentUser: any = {
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
  };

  menuItems = [
    { label: 'Dashboard', route: '/dashboard', icon: 'fa-chart-line', roles: ['admin', 'super-admin', 'user'] },
    { label: 'Campaigns', route: '/campaigns', icon: 'fa-bullhorn', roles: ['admin', 'super-admin'] },
    { label: 'Engagement', route: '/engagement', icon: 'fa-bullhorn', roles: ['admin', 'super-admin', 'user'] },
    { label: 'Leads', route: '/leads', icon: 'fa-star', roles: ['admin', 'super-admin', 'user'] },
    { label: 'Contacts', route: '/contacts', icon: 'fa-users', roles: ['admin', 'super-admin', 'user'] },
    { label: 'Companies', route: '/companies', icon: 'fa-building', roles: ['admin', 'super-admin'] },
    { label: 'Deals', route: '/deals', icon: 'fa-handshake', roles: ['admin', 'super-admin', 'user'] },
    { label: 'Pipeline', route: '/pipeline', icon: 'fa-stream', roles: ['admin', 'super-admin'] },
    { label: 'Tasks', route: '/tasks', icon: 'fa-tasks', roles: ['admin', 'super-admin', 'user'] },
    { label: 'Activity', route: '/activity', icon: 'fa-list', roles: ['admin', 'super-admin', 'user'] },
    { label: 'Reports', route: '/reports', icon: 'fa-chart-pie', roles: ['admin', 'super-admin'] },
    { label: 'Users', route: '/users', icon: 'fa-user-shield', roles: ['super-admin'] }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  shouldShowMenu(item: any): boolean {
    return this.authService.hasAnyRole(item.roles);
  }

  ngOnInit(): void {
    // Set demo user for development
    this.authService.setCurrentUser(this.currentUser);
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    // Only check authentication status on browser platform
    if (isPlatformBrowser(this.platformId) && this.authService) {
      // Subscribe to auth changes - this is the source of truth
      this.authService.currentUser$.subscribe(user => {
        this.isLoggedIn = !!user;
        if (user) {
          this.currentUser = user;
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    // Navigate after a small delay to ensure auth state is updated
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 100);
  }
}
