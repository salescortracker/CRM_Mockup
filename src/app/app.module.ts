import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { UserManagementComponent } from './features/users/user-management/user-management.component';
import { SettingsComponent } from './features/admin/settings/settings.component';
import { ForbiddenComponent } from './shared/components/forbidden/forbidden.component';
import { RoleGuard } from './core/guards/role.guard';
import { UserService } from './services/user.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContactListComponent } from './features/contacts/contact-list/contact-list.component';
import { LoginComponent } from './login/login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';
import { DealListComponent } from './features/deal-list/deal-list.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { BaseChartDirective } from 'ng2-charts';
import { AddContactComponent } from './features/contacts/add-contact/add-contact.component';
import { LeadManagementComponent } from './features/leads/lead-management/lead-management.component';
import { CompanyManagementComponent } from './features/companies/company-management/company-management.component';
// import { DealsComponent } from './features/deals/add-deal.component';
import { AddLeadsComponent } from './features/leads/add-leads/add-leads.component';
import { AddDealsComponent } from './features/deals/add-deals.component';
import { ActivityComponent } from './features/activity/activity.component';
import { PipelineComponent } from './features/pipeline/pipeline.component';
import { PipelineKanbanComponent } from './features/pipeline/pipeline-kanban.component';
import { TasksComponent } from './features/tasks/tasks.component';
import { ReportsComponent } from './features/reports/reports.component';
import { ContactMergeComponent } from './features/contacts/contact-merge/contact-merge.component';
import { BulkImportComponent } from './features/contacts/bulk-import/bulk-import.component';
import { DealProductsComponent } from './features/deals/deal-products/deal-products.component';
import { DealNegotiationComponent } from './features/deals/deal-negotiation/deal-negotiation.component';
import { CompanyDetailsComponent } from './features/companies/company-details/company-details.component';
import { CampaignManagementComponent } from './features/campaigns/campaign-management.component';
import { EngagementCenterComponent } from './features/engagement/engagement-center/engagement-center.component';
@NgModule({
  declarations: [
    AppComponent,
    ContactListComponent,
    LoginComponent,
    DashboardComponent,
    DealListComponent,
    NavbarComponent,
    AddContactComponent,
    LeadManagementComponent,
    CompanyManagementComponent,
    // DealsComponent,
    AddLeadsComponent,
    AddDealsComponent,
    UserManagementComponent,
    SettingsComponent,
    ForbiddenComponent,
    ActivityComponent,
    PipelineComponent,
    PipelineKanbanComponent,
    TasksComponent,
    ReportsComponent,
    CampaignManagementComponent,
    ContactMergeComponent,
    BulkImportComponent,
    DealProductsComponent,
    DealNegotiationComponent,
    CompanyDetailsComponent,
    EngagementCenterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BaseChartDirective
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    RoleGuard,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
