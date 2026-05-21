import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DealListComponent } from './features/deal-list/deal-list.component';
import { ContactListComponent } from './features/contacts/contact-list/contact-list.component';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';
import { LoginComponent } from './login/login/login.component';
import { AddContactComponent } from './features/contacts/add-contact/add-contact.component';
import { AddLeadsComponent } from './features/leads/add-leads/add-leads.component';
import { LeadManagementComponent } from './features/leads/lead-management/lead-management.component';
import { CompanyManagementComponent } from './features/companies/company-management/company-management.component';
import { CompanyDetailsComponent } from './features/companies/company-details/company-details.component';
import { AddDealsComponent } from './features/deals/add-deals.component';
import { DealProductsComponent } from './features/deals/deal-products/deal-products.component';
import { DealNegotiationComponent } from './features/deals/deal-negotiation/deal-negotiation.component';
import { RoleGuard } from './core/guards/role.guard';
import { UserManagementComponent } from './features/users/user-management/user-management.component';
import { SettingsComponent } from './features/admin/settings/settings.component';
import { ForbiddenComponent } from './shared/components/forbidden/forbidden.component';
import { ActivityComponent } from './features/activity/activity.component';
import { PipelineComponent } from './features/pipeline/pipeline.component';
import { PipelineKanbanComponent } from './features/pipeline/pipeline-kanban.component';
import { CampaignManagementComponent } from './features/campaigns/campaign-management.component';
import { TasksComponent } from './features/tasks/tasks.component';
import { ReportsComponent } from './features/reports/reports.component';
import { EngagementCenterComponent } from './features/engagement/engagement-center/engagement-center.component';
import { ContactMergeComponent } from './features/contacts/contact-merge/contact-merge.component';
import { BulkImportComponent } from './features/contacts/bulk-import/bulk-import.component';

const routes: Routes = [ 
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'contacts',
    component: ContactListComponent,
    canActivate: [RoleGuard],
    data: { requiredRoles: ['admin', 'super-admin', 'user'] }
  },
  {
    path: 'contacts/:id',
    component: ContactListComponent,
  },
  {
    path: 'contacts/:id/edit',
    component: ContactListComponent,
  },
  {
    path: 'deals',
    component: DealListComponent,
    canActivate: [RoleGuard],
    data: { requiredRoles: ['admin', 'super-admin', 'user'] }
  },
  { 
    path: 'deals/new', 
    component: AddDealsComponent 
  },
  {
    path: 'deals/:id',
    component: DealListComponent,
  },
  {
    path: 'deals/:id/edit',
    component: DealListComponent,
  },
  // {
  //   path: 'deals',
  //   component: DealListComponent,
  // }, 
  {
    path: 'contacts/add',
    component: ContactListComponent,
    data: { openNewContactModal: true }
  },
  {
    path: 'contacts/merge',
    component: ContactMergeComponent,
    canActivate: [RoleGuard],
    data: { requiredRoles: ['admin', 'super-admin'] }
  },
  {
    path: 'contacts/bulk-import',
    component: BulkImportComponent,
    canActivate: [RoleGuard],
    data: { requiredRoles: ['admin', 'super-admin'] }
  },
  {
    path: 'leads',
    component: LeadManagementComponent,
    canActivate: [RoleGuard],
    data: { requiredRoles: ['admin', 'super-admin', 'user'] }
  },
  {
    path: 'leads/add',
    component: LeadManagementComponent,
    data: { openNewLeadModal: true }
  },
  {
    path: 'leads/:id',
    component: LeadManagementComponent,
  },
  {
    path: 'leads/:id/edit',
    component: LeadManagementComponent,
  },
  {
    path: 'companies',
    component: CompanyManagementComponent,
    canActivate: [RoleGuard],
    data: { requiredRoles: ['admin', 'super-admin'] }
  },
  {
    path: 'companies/:id/details',
    component: CompanyDetailsComponent,
    canActivate: [RoleGuard],
    data: { requiredRoles: ['admin', 'super-admin'] }
  },
  {
    path: 'deals/:id/products',
    component: DealProductsComponent,
    canActivate: [RoleGuard],
    data: { requiredRoles: ['admin', 'super-admin', 'user'] }
  },
  {
    path: 'deals/:id/negotiate',
    component: DealNegotiationComponent,
    canActivate: [RoleGuard],
    data: { requiredRoles: ['admin', 'super-admin', 'user'] }
  },
  // {
  // path: 'companies',
  // component: CompanyManagementComponent,
  // },
    {
    path: 'companies/:id',
    component: CompanyManagementComponent,
  },
  {
    path: 'companies/:id/edit',
    component: CompanyManagementComponent,
  },
  {
    path: 'users',
    component: UserManagementComponent,
    canActivate: [RoleGuard],
    data: { requiredRoles: ['super-admin'] }
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [RoleGuard],
    data: { requiredRoles: ['super-admin'] }
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent
  },
  {
    path: 'profile',
    redirectTo: 'settings',
    pathMatch: 'full'
  },
  {
    path: 'activity',
    component: ActivityComponent,
    canActivate: [RoleGuard],
    data: { requiredRoles: ['admin', 'super-admin', 'user'] }
  },
  {
    path: 'pipeline',
    component: PipelineKanbanComponent,
    canActivate: [RoleGuard],
    data: { requiredRoles: ['admin', 'super-admin'] }
  },
  {
    path: 'campaigns',
    component: CampaignManagementComponent,
    canActivate: [RoleGuard],
    data: { requiredRoles: ['admin', 'super-admin'] }
  },
  {
    path: 'tasks',
    component: TasksComponent,
    canActivate: [RoleGuard],
    data: { requiredRoles: ['admin', 'super-admin', 'user'] }
  },
  {
    path: 'reports',
    component: ReportsComponent,
    canActivate: [RoleGuard],
    data: { requiredRoles: ['admin', 'super-admin'] }
  },
  {
    path: 'engagement',
    component: EngagementCenterComponent,
    canActivate: [RoleGuard],
    data: { requiredRoles: ['admin', 'super-admin', 'user'] }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
