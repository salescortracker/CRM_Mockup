// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-lead-management',
//   standalone: false,
//   templateUrl: './lead-management.component.html',
//   styleUrl: './lead-management.component.css'
// })
// export class LeadManagementComponent {
// mainTab: string = 'creation';

//   lead: any = {};
//   leads: any[] = [];

//   queue = [
//     { name: 'Kumar', status: 'New', assigned: 'Admin' }
//   ];

//   social: any = {};
//   socialLeads: any[] = [];

//   setMainTab(tab: string) {
//     this.mainTab = tab;
//   }

//   addLead() {
//     this.leads.push({ ...this.lead });
//     this.lead = {};
//   }

//   addSocialLead() {
//     this.socialLeads.push({ ...this.social });
//     this.social = {};
//   }
// }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { Lead } from '../../../core/models/contact';
import { AddLeadsComponent } from '../add-leads/add-leads.component';

@Component({
  selector: 'app-lead-management',
  standalone: false,
  templateUrl: './lead-management.component.html',
  styleUrls: ['./lead-management.component.css'],
})
export class LeadManagementComponent implements OnInit {
  leads: Lead[] = [];
  lead: any = {};
  // leads: any[] = [];
  loading = true;
  currentPage = 1;
  pageSize = 20;
  totalRecords = 0;
  searchQuery = '';
  selectedLeads: Set<string> = new Set();
  selectedLead: Lead | null = null;
  activeQuickFilter = 'all';
  activityMessage = '';
  routeLeadId: string | null = null;
  editMode = false;
  private addModalOpenedFromRoute = false;

  leadStats = {
    totalLeads: 0,
    highScore: 0,
    mediumScore: 0,
    lowScore: 0,
    avgMonthlyLeads: 0,
    averageScore: 0,
    newLeadsThisMonth: 0,
    convertedThisMonth: 0,
    conversionRate: 0,
  };

  filters = {
    leadStatus: '',
    leadSource: '',
    territory: '',
    assignment: '',
    scoreRange: '',
  };

  leadSources = ['Website', 'Email', 'Referral', 'Cold Call', 'Ad', 'Facebook Ads', 'LinkedIn Ads', 'IndiaMART', 'Other'];
  territories = ['North', 'South', 'East', 'West', 'Central'];
  assignmentOptions = [
    { label: 'All', value: '' },
    { label: 'Unassigned', value: 'unassigned' },
    { label: 'Assigned', value: 'assigned' },
  ];

  leadStatuses = [
    'New',
    'Contacted',
    'Qualified',
    'Unqualified',
    'Converted',
    'Not Interested',
  ];

  scoreRanges = [
    { label: 'High Score (80+)', value: 'high' },
    { label: 'Medium Score (50-79)', value: 'medium' },
    { label: 'Low Score (<50)', value: 'low' },
  ];

  assignmentUsers = [
    'Rohit Kumar',
    'Priya Nair',
    'Deepak Sharma',
    'Anita Patel',
    'Mohit Singh',
  ];

  selectedAssignmentLeadId: string | null = null;
  selectedAssignmentUser = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.routeLeadId = this.route.snapshot.paramMap.get('id');
    this.editMode = this.route.snapshot.routeConfig?.path === 'leads/:id/edit';
    this.loadLeads();
    this.loadLeadStats();

    if (this.route.snapshot.data['openNewLeadModal']) {
      setTimeout(() => this.openNewLeadModal(true));
    }
  }

  loadLeads(): void {
    this.loading = true;
    const requestFilters = {
      ...this.filters,
      searchQuery: this.searchQuery,
      quickFilter: this.activeQuickFilter === 'all' ? '' : this.activeQuickFilter,
    };

    this.apiService
      .getLeads(this.currentPage, this.pageSize, requestFilters)
      .subscribe(
        (response) => {
          if (response.success) {
            this.leads = response.data;
            this.totalRecords = response.pagination?.total || 0;
            this.selectLeadFromRoute();
            this.syncSelectedLead();
          }
          this.loading = false;
        },
        (error) => {
          console.error('Error loading leads', error);
          this.loading = false;
        }
      );
  }

  loadLeadStats(): void {
    this.apiService.getLeadStats().subscribe(
      (response) => {
        if (response.success) {
          this.leadStats = response.data;
        }
      },
      (error) => console.error('Error loading lead stats', error)
    );
  }

  openNewLeadModal(fromRoute = false): void {
    if (fromRoute && this.addModalOpenedFromRoute) {
      return;
    }
    this.addModalOpenedFromRoute = fromRoute;

    const modalRef = this.modalService.open(
      AddLeadsComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.result.then(
      (result) => {
        if (result) {
          this.loadLeads();
          this.loadLeadStats();
          this.selectedLead = result;
          this.showActivity(`${result.firstName} ${result.lastName} was added to the lead queue.`);
          if (fromRoute) {
            this.router.navigate(['/leads', result.id]);
          }
        }
      },
      (reason) => {
        if (fromRoute) {
          this.router.navigate(['/leads']);
        }
      }
    );
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadLeads();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadLeads();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.activeQuickFilter = 'all';
    this.filters = {
      leadStatus: '',
      leadSource: '',
      territory: '',
      assignment: '',
      scoreRange: '',
    };
    this.loadLeads();
  }

  applyQuickFilter(filter: string): void {
    this.activeQuickFilter = filter;
    this.currentPage = 1;
    this.loadLeads();
  }

  get unassignedLeads(): Lead[] {
    return this.leads.filter((lead) => lead.leadQueueStatus === 'unassigned');
  }

  get agedLeads(): Lead[] {
    return this.leads.filter(
      (lead) =>
        lead.leadQueueStatus === 'unassigned' &&
        lead.lastContactDate &&
        this.calculateLeadAge(lead.lastContactDate) >= 4
    );
  }

  calculateLeadAge(date: Date): number {
    const diff = Date.now() - new Date(date).getTime();
    return Math.round(diff / (1000 * 60 * 60 * 24));
  }

  assignmentByTerritory(territory?: string): string {
    const map: Record<string, string> = {
      North: 'Rohit Kumar',
      South: 'Priya Nair',
      East: 'Deepak Sharma',
      West: 'Anita Patel',
      Central: 'Mohit Singh',
    };
    return map[territory || ''] || 'TBD Sales';
  }

  autoAssignLeads(): void {
    const updates = this.leads
      .filter((lead) => lead.leadQueueStatus === 'unassigned')
      .map((lead) => ({
        ...lead,
        leadQueueStatus: 'assigned' as const,
        assignedTo: this.assignmentByTerritory(lead.territory),
        assignedAt: new Date(),
        autoAssigned: true,
      }));

    updates.forEach((lead) => {
      this.apiService.updateLead(lead.id, lead).subscribe();
    });

    this.leads = this.leads.map((lead) => {
      if (lead.leadQueueStatus === 'unassigned') {
        return updates.find((item) => item.id === lead.id) || lead;
      }
      return lead;
    });
    this.syncSelectedLead();
    this.showActivity(`${updates.length} unassigned lead${updates.length === 1 ? '' : 's'} auto-assigned by territory.`);
  }

  openLeadAssignment(lead: Lead): void {
    if (lead.leadQueueStatus !== 'unassigned') {
      return;
    }

    this.selectedAssignmentLeadId = lead.id;
    this.selectedAssignmentUser = '';
  }

  confirmLeadAssignment(): void {
    const lead = this.leads.find((item) => item.id === this.selectedAssignmentLeadId);
    if (!lead) {
      return;
    }

    if (!this.selectedAssignmentUser) {
      alert('Please choose a user to assign this lead to.');
      return;
    }

    this.patchLead(lead.id, {
      leadQueueStatus: 'assigned',
      assignedTo: this.selectedAssignmentUser,
      assignedAt: new Date(),
      autoAssigned: false,
    });
    this.showActivity(`Assigned ${lead.firstName} ${lead.lastName} to ${this.selectedAssignmentUser}.`);
    this.cancelLeadAssignmentSelection();
  }

  cancelLeadAssignmentSelection(): void {
    this.selectedAssignmentLeadId = null;
    this.selectedAssignmentUser = '';
  }

  assignLead(lead: Lead): void {
    if (lead.leadQueueStatus !== 'unassigned') {
      return;
    }

    const assignedTo = this.assignmentByTerritory(lead.territory);
    this.patchLead(lead.id, {
      leadQueueStatus: 'assigned',
      assignedTo,
      assignedAt: new Date(),
      autoAssigned: true,
    });
    this.showActivity(`Assigned ${lead.firstName} ${lead.lastName} to ${assignedTo}.`);
  }

  recycleLead(lead: Lead): void {
    this.patchLead(lead.id, {
      leadQueueStatus: 'assigned',
      assignedTo: 'Reassigned Team',
      assignedAt: new Date(),
      leadStatus: 'Contacted',
    });
    this.showActivity(`${lead.firstName} ${lead.lastName} was recycled and reassigned.`);
  }

  scheduleFollowUp(lead: Lead): void {
    const nextFollowupDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    this.patchLead(lead.id, {
      nextFollowupDate,
      leadStatus: lead.leadStatus === 'New' ? 'Contacted' : lead.leadStatus,
    });
    this.showActivity(`Follow-up scheduled for ${lead.firstName} ${lead.lastName} on ${nextFollowupDate.toLocaleDateString()}.`);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadLeads();
  }

  getLeadScoreBadge(score: number): string {
    if (score >= 80) return 'danger';
    if (score >= 50) return 'warning';
    return 'secondary';
  }

  getLeadScoreStars(score: number): number {
    return Math.ceil(score / 20);
  }

  getStatusBadgeColor(status: string): string {
    switch (status) {
      case 'New':
        return 'info';
      case 'Contacted':
        return 'primary';
      case 'Qualified':
        return 'success';
      case 'Unqualified':
        return 'danger';
      case 'Converted':
        return 'success';
      case 'Not Interested':
        return 'dark';
      default:
        return 'secondary';
    }
  }

  editLead(id: string): void {
    const lead = this.leads.find((item) => item.id === id);
    if (lead) {
      this.selectedLead = lead;
      this.editMode = true;
      this.router.navigate(['/leads', id, 'edit']);
      this.showActivity(`Edit mode opened for ${lead.firstName} ${lead.lastName}.`);
    }
  }

  viewLead(id: string): void {
    const lead = this.leads.find((item) => item.id === id);
    if (lead) {
      this.selectedLead = lead;
      this.editMode = false;
      this.router.navigate(['/leads', id]);
      this.showActivity(`Opened profile for ${lead.firstName} ${lead.lastName}.`);
    }
  }

  logCall(lead: Lead): void {
    this.patchLead(lead.id, {
      leadStatus: lead.leadStatus === 'New' ? 'Contacted' : lead.leadStatus,
      contactCount: (lead.contactCount || 0) + 1,
      lastContactDate: new Date(),
      scoreReason: 'Call logged. Interest and buying intent confirmed.',
      leadScore: Math.min(100, lead.leadScore + 5),
    });
    this.showActivity(`Call logged for ${lead.firstName} ${lead.lastName}.`);
  }

  sendEmail(lead: Lead): void {
    this.patchLead(lead.id, {
      leadStatus: lead.leadStatus === 'New' ? 'Contacted' : lead.leadStatus,
      emailOpens: (lead.emailOpens || 0) + 1,
      lastContactDate: new Date(),
      scoreReason: 'Email sent from the lead workspace.',
      leadScore: Math.min(100, lead.leadScore + 3),
    });
    this.showActivity(`Email touchpoint recorded for ${lead.firstName} ${lead.lastName}.`);
  }

  qualifyLead(lead: Lead): void {
    this.patchLead(lead.id, {
      leadStatus: 'Qualified',
      leadScore: Math.max(lead.leadScore, 82),
      scoreReason: 'Qualified after fit, interest, and timing review.',
      lastContactDate: new Date(),
    });
    this.showActivity(`${lead.firstName} ${lead.lastName} moved to Qualified.`);
  }

  convertLead(id: string): void {
    this.apiService.convertLeadToContact(id).subscribe(
      (response) => {
        if (response.success) {
          const convertedLead = response.data.lead as Lead | undefined;
          if (convertedLead) {
            this.updateLeadInView(convertedLead);
            this.selectedLead = convertedLead;
            this.showActivity(`${convertedLead.firstName} ${convertedLead.lastName} converted to contact ${response.data.contactId}.`);
          }
          this.loadLeadStats();
        }
      },
      (error) => console.error('Error converting lead', error)
    );
  }

  deleteLead(id: string): void {
    if (confirm('Are you sure you want to delete this lead?')) {
      this.apiService.deleteLead(id).subscribe(
        (response) => {
          if (response.success) {
            this.loadLeads();
            if (this.selectedLead?.id === id) {
              this.selectedLead = null;
            }
          }
        },
        (error) => console.error('Error deleting lead', error)
      );
    }
  }

  selectLead(id: string, event: any): void {
    if (event.target.checked) {
      this.selectedLeads.add(id);
    } else {
      this.selectedLeads.delete(id);
    }
  }

  selectAll(event: any): void {
    if (event.target.checked) {
      this.leads.forEach((lead) => this.selectedLeads.add(lead.id));
    } else {
      this.selectedLeads.clear();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  getFormattedDate(date?: Date): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  }

  getLeadAgeLabel(lead: Lead): string {
    if (!lead.lastContactDate) {
      return 'No contact yet';
    }
    const days = this.calculateLeadAge(lead.lastContactDate);
    return days === 0 ? 'Contacted today' : `${days} day${days === 1 ? '' : 's'} since last contact`;
  }

  openConvertedContact(lead: Lead): void {
    if (lead.convertedContactId) {
      this.router.navigate(['/contacts', lead.convertedContactId]);
    }
  }

  private patchLead(id: string, changes: Partial<Lead>): void {
    const existing = this.leads.find((lead) => lead.id === id);
    if (!existing) {
      return;
    }

    const updatedLead = {
      ...existing,
      ...changes,
      updatedAt: new Date(),
    };

    this.apiService.updateLead(id, updatedLead).subscribe((response) => {
      if (response.success) {
        this.updateLeadInView(response.data);
        this.loadLeadStats();
      }
    });
  }

  private updateLeadInView(updatedLead: Lead): void {
    this.leads = this.leads.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead));
    if (this.selectedLead?.id === updatedLead.id) {
      this.selectedLead = updatedLead;
    }
  }

  private syncSelectedLead(): void {
    if (!this.selectedLead) {
      return;
    }

    this.selectedLead = this.leads.find((lead) => lead.id === this.selectedLead?.id) || this.selectedLead;
  }

  private selectLeadFromRoute(): void {
    if (!this.routeLeadId) {
      return;
    }

    const routeLead = this.leads.find((lead) => lead.id === this.routeLeadId);
    if (routeLead) {
      this.selectedLead = routeLead;
      this.showActivity(this.editMode ? `Edit mode opened for ${routeLead.firstName} ${routeLead.lastName}.` : `Opened profile for ${routeLead.firstName} ${routeLead.lastName}.`);
    }
  }

  private showActivity(message: string): void {
    this.activityMessage = message;
    setTimeout(() => {
      this.activityMessage = '';
    }, 4500);
  }
}

