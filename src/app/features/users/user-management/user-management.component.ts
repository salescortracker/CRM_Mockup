import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

type UserRole = 'super-admin' | 'admin' | 'user';

interface CrmUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: string;
  phone: string;
  active: boolean;
  permissionGroup: string;
  ownedDeals: number;
  openTasks: number;
  pipelineValue: number;
}

@Component({
  selector: 'app-user-management',
  standalone: false,
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: CrmUser[] = [];
  selectedUser: CrmUser | null = null;
  newUser: Partial<CrmUser> = {};
  editingUserId?: string;
  activityMessage = '';

  roles: UserRole[] = ['super-admin', 'admin', 'user'];
  permissionGroups = ['Executive Admin', 'Sales Manager', 'Sales Rep', 'Read Only'];

  fieldAccessOptions = [
    { label: 'Can edit deal amount', value: 'editDealAmount', enabled: true },
    { label: 'Can change pipeline stage', value: 'changePipelineStage', enabled: true },
    { label: 'Can access sales credit review', value: 'creditReviewAccess', enabled: true },
    { label: 'Can change contact ownership', value: 'changeContactOwner', enabled: false }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.users = [
      { id: 'user-0', email: 'admin@example.com', firstName: 'Admin', lastName: 'User', role: 'super-admin', department: 'Operations', phone: '+1 555-100-0000', active: true, permissionGroup: 'Executive Admin', ownedDeals: 8, openTasks: 4, pipelineValue: 380000 },
      { id: 'user-1', email: 'rohit.kumar@example.com', firstName: 'Rohit', lastName: 'Kumar', role: 'admin', department: 'Sales', phone: '+1 555-100-1001', active: true, permissionGroup: 'Sales Manager', ownedDeals: 2, openTasks: 2, pipelineValue: 122000 },
      { id: 'user-2', email: 'jane.doe@example.com', firstName: 'Jane', lastName: 'Doe', role: 'user', department: 'Sales', phone: '+1 555-100-1002', active: true, permissionGroup: 'Sales Rep', ownedDeals: 2, openTasks: 1, pipelineValue: 56000 },
      { id: 'user-4', email: 'maria.lopez@example.com', firstName: 'Maria', lastName: 'Lopez', role: 'user', department: 'Solutions', phone: '+1 555-100-1004', active: true, permissionGroup: 'Sales Rep', ownedDeals: 2, openTasks: 2, pipelineValue: 100000 },
      { id: 'user-5', email: 'nate.hill@example.com', firstName: 'Nate', lastName: 'Hill', role: 'user', department: 'Customer Success', phone: '+1 555-100-1005', active: false, permissionGroup: 'Read Only', ownedDeals: 1, openTasks: 1, pipelineValue: 64000 }
    ];
    this.selectedUser = this.users[0];
  }

  selectUser(user: CrmUser): void {
    this.selectedUser = user;
  }

  saveUser(): void {
    if (!this.newUser.email || !this.newUser.firstName || !this.newUser.role) {
      this.showActivity('Please fill required user fields.');
      return;
    }

    const user: CrmUser = {
      id: `user-${Date.now()}`,
      email: this.newUser.email,
      firstName: this.newUser.firstName,
      lastName: this.newUser.lastName || '',
      role: this.newUser.role,
      department: this.newUser.department || 'Sales',
      phone: this.newUser.phone || '',
      active: true,
      permissionGroup: this.newUser.permissionGroup || 'Sales Rep',
      ownedDeals: 0,
      openTasks: 0,
      pipelineValue: 0
    };
    this.users.unshift(user);
    this.selectedUser = user;
    this.resetForm();
    this.showActivity('User added.');
  }

  editUser(user: CrmUser): void {
    this.newUser = { ...user };
    this.editingUserId = user.id;
    this.selectedUser = user;
  }

  updateUser(): void {
    if (!this.editingUserId) {
      return;
    }
    const index = this.users.findIndex((user) => user.id === this.editingUserId);
    if (index >= 0) {
      this.users[index] = { ...this.users[index], ...this.newUser, id: this.editingUserId } as CrmUser;
      this.selectedUser = this.users[index];
      this.showActivity('User updated.');
    }
    this.resetForm();
  }

  toggleUser(user: CrmUser): void {
    user.active = !user.active;
    this.selectedUser = user;
    this.showActivity(`${user.firstName} ${user.lastName} ${user.active ? 'activated' : 'deactivated'}.`);
  }

  assignPermissionGroup(user: CrmUser, group: string): void {
    user.permissionGroup = group;
    this.selectedUser = user;
    this.showActivity(`${group} assigned to ${user.firstName}.`);
  }

  deleteUser(id: string): void {
    this.users = this.users.filter((user) => user.id !== id);
    this.selectedUser = this.users[0] || null;
    this.showActivity('User removed from demo list.');
  }

  resetForm(): void {
    this.newUser = {};
    this.editingUserId = undefined;
  }

  openDeals(): void {
    this.router.navigate(['/deals']);
  }

  openTasks(): void {
    this.router.navigate(['/tasks']);
  }

  getRoleClass(role: UserRole): string {
    return `role-${role}`;
  }

  private showActivity(message: string): void {
    this.activityMessage = message;
    setTimeout(() => this.activityMessage = '', 4000);
  }
}
