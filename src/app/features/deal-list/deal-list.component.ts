import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Deal } from '../../core/models/contact';
import { ApiService } from '../../services/api.service';
import { AddDealsComponent } from '../deals/add-deals.component';

type DealView = Deal & { company?: { id?: string; name?: string }; contact?: any };

@Component({
  selector: 'app-deal-list',
  standalone: false,
  templateUrl: './deal-list.component.html',
  styleUrls: ['./deal-list.component.css']
})
export class DealListComponent implements OnInit {
  deals: DealView[] = [];
  selectedDeal: DealView | null = null;
  loading = false;
  currentPage = 1;
  pageSize = 20;
  totalRecords = 0;
  viewMode: 'table' | 'kanban' = 'table';
  activityMessage = '';

  filters = {
    stage: '',
    owner: '',
    minAmount: '',
    maxAmount: '',
  };

  pipelineStages = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadDeals();
  }

  loadDeals(): void {
    this.loading = true;
    this.apiService.getDeals(this.currentPage, this.pageSize, this.filters).subscribe(
      (response) => {
        if (response.success) {
          this.deals = response.data;
          this.totalRecords = response.pagination?.total || this.deals.length;
          this.selectDealFromRoute();
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error loading deals', error);
        this.loading = false;
      }
    );
  }

  get filteredDeals(): DealView[] {
    return this.deals;
  }

  get totalPipelineValue(): number {
    return this.deals.reduce((sum, deal) => sum + (Number(deal.amount) || 0), 0);
  }

  get weightedPipelineValue(): number {
    return this.deals.reduce((sum, deal) => sum + ((Number(deal.amount) || 0) * (Number(deal.probability) || 0) / 100), 0);
  }

  openNewDealModal(): void {
    this.openDealModal();
  }

  openDealModal(deal?: DealView): void {
    const modalRef = this.modalService.open(AddDealsComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });

    if (deal) {
      modalRef.componentInstance.existingDeal = deal;
    }

    modalRef.result.then(
      (result) => {
        if (result) {
          this.loadDeals();
          this.selectedDeal = result;
          this.showActivity(deal ? `${result.name} was updated.` : `${result.name} was created.`);
        }
      },
      () => {}
    );
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadDeals();
  }

  switchViewMode(mode: 'table' | 'kanban'): void {
    this.viewMode = mode;
  }

  selectDeal(deal: DealView): void {
    this.selectedDeal = deal;
    this.router.navigate(['/deals', deal.id]);
  }

  closeDealProfile(): void {
    this.selectedDeal = null;
    this.router.navigate(['/deals']);
  }

  editDeal(id: string, event?: Event): void {
    event?.stopPropagation();
    const deal = this.deals.find((item) => item.id === id);
    if (deal) {
      this.openDealModal(deal);
    }
  }

  viewDeal(id: string): void {
    const deal = this.deals.find((item) => item.id === id);
    if (deal) {
      this.selectDeal(deal);
    }
  }

  viewProducts(id: string, event?: Event): void {
    event?.stopPropagation();
    this.router.navigate(['/deals', id, 'products']);
  }

  negotiateDeal(id: string, event?: Event): void {
    event?.stopPropagation();
    this.router.navigate(['/deals', id, 'negotiate']);
  }

  openCompany(deal: DealView, event?: Event): void {
    event?.stopPropagation();
    if (deal.companyId) {
      this.router.navigate(['/companies', deal.companyId]);
    }
  }

  deleteDeal(id: string, event?: Event): void {
    event?.stopPropagation();
    if (confirm('Delete this deal?')) {
      this.apiService.deleteDeal(id).subscribe(
        () => {
          if (this.selectedDeal?.id === id) {
            this.selectedDeal = null;
          }
          this.loadDeals();
          this.showActivity('Deal deleted.');
        },
        (error) => console.error('Error deleting deal', error)
      );
    }
  }

  markWon(deal: DealView): void {
    this.apiService.closeDeal(deal.id, {
      status: 'closed_won',
      reason: 'Client approved the proposal',
      notes: 'Deal marked won from the deal profile.'
    }).subscribe((response) => {
      if (response.success) {
        this.selectedDeal = response.data;
        this.loadDeals();
        this.showActivity(`${deal.name} marked as won.`);
      }
    });
  }

  markLost(deal: DealView): void {
    this.apiService.closeDeal(deal.id, {
      status: 'closed_lost',
      reason: 'Client declined the proposal',
      notes: 'Deal marked lost from the deal profile.'
    }).subscribe((response) => {
      if (response.success) {
        this.selectedDeal = response.data;
        this.loadDeals();
        this.showActivity(`${deal.name} marked as lost.`);
      }
    });
  }

  getDealsByStage(stage: string): DealView[] {
    return this.deals.filter((deal) => deal.stage === stage);
  }

  getStageCount(stage: string): number {
    return this.getDealsByStage(stage).length;
  }

  getStageValue(stage: string): number {
    return this.getDealsByStage(stage).reduce((sum, deal) => sum + (Number(deal.amount) || 0), 0);
  }

  getStatusLabel(status: string | undefined): string {
    return (status || 'open').replace(/_/g, ' ');
  }

  getStatusClass(status: string | undefined): string {
    const classes: Record<string, string> = {
      open: 'status-open',
      negotiation: 'status-negotiation',
      proposal_sent: 'status-proposal',
      quote_pending: 'status-quote',
      closed_won: 'status-won',
      closed_lost: 'status-lost',
    };
    return classes[status || 'open'] || 'status-open';
  }

  getCompanyName(deal: DealView): string {
    return deal.company?.name || deal.companyId || 'Company account';
  }

  getDealTimeline(deal: DealView): Array<{ title: string; detail: string; time: string; icon: string }> {
    return [
      ...(deal.negotiationNotes || []).slice(0, 3).map((note) => ({
        title: note.negotiationPoint || 'Negotiation update',
        detail: note.note || note.response || 'Deal note captured.',
        time: 'Negotiation',
        icon: 'fa-comments'
      })),
      {
        title: 'Products and quote',
        detail: `${deal.lineItems?.length || 0} products attached${deal.quoteId ? `, quote ${deal.quoteId} ready` : ', quote not created yet'}.`,
        time: 'Quote flow',
        icon: 'fa-box'
      },
      {
        title: 'Company connection',
        detail: `Connected to ${this.getCompanyName(deal)} for account context.`,
        time: 'Account',
        icon: 'fa-building'
      }
    ];
  }

  getTotalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  private selectDealFromRoute(): void {
    const dealId = this.route.snapshot.paramMap.get('id');
    if (!dealId) {
      return;
    }

    const deal = this.deals.find((item) => item.id === dealId);
    if (deal) {
      this.selectedDeal = deal;
      if (this.route.snapshot.routeConfig?.path === 'deals/:id/edit') {
        this.openDealModal(deal);
      }
    }
  }

  private showActivity(message: string): void {
    this.activityMessage = message;
    setTimeout(() => {
      this.activityMessage = '';
    }, 4500);
  }
}
