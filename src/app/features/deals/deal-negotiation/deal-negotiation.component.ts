import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Deal, NegotiationNote } from '../../../core/models/contact';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-deal-negotiation',
  standalone: false,
  templateUrl: './deal-negotiation.component.html',
  styleUrls: ['./deal-negotiation.component.css']
})
export class DealNegotiationComponent implements OnInit {
  deal: Deal | null = null;
  loading = false;
  showNoteForm = false;
  showCounterForm = false;
  message = '';
  selectedNote: NegotiationNote | null = null;
  noteForm = {
    negotiationPoint: '',
    note: '',
    response: '',
    status: 'proposed' as NegotiationNote['status']
  };
  counterForm = {
    amount: '',
    terms: '',
    responseDate: ''
  };

  sampleDeal: Deal = {
    id: 'deal-202',
    name: 'Enterprise Renewal',
    companyId: '1',
    amount: 46000,
    stage: 'Negotiation',
    probability: 80,
    status: 'negotiation',
    ownerId: 'user-5',
    owner: { id: 'user-5', email: 'nate.hill@example.com', firstName: 'Nate', lastName: 'Hill', role: 'user' },
    quoteId: 'Q-202',
    invoiceId: 'I-202',
    paymentStatus: 'unpaid',
    negotiationNotes: [
      {
        id: 'note-101',
        dealId: 'deal-202',
        note: 'Review proposal terms',
        negotiationPoint: 'Pricing discount',
        proposedBy: 'Nate Hill',
        respondedBy: 'CFO Team',
        response: 'Request 10% discount',
        status: 'proposed',
        createdAt: new Date(),
      },
      {
        id: 'note-102',
        dealId: 'deal-202',
        note: 'Contract timeline discussion',
        negotiationPoint: 'Deployment date',
        proposedBy: 'Nate Hill',
        respondedBy: 'Client Lead',
        response: 'Need go-live in 6 weeks',
        status: 'accepted',
        createdAt: new Date(),
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const dealId = this.route.snapshot.paramMap.get('id');
    if (dealId) {
      this.loadDeal(dealId);
      return;
    }
    this.deal = this.sampleDeal;
    this.selectedNote = this.sampleDeal.negotiationNotes?.[0] || null;
  }

  loadDeal(dealId: string): void {
    this.loading = true;
    this.apiService.getDeal(dealId).subscribe(
      (response: any) => {
        this.deal = response.success && response.data ? response.data : this.sampleDeal;
        this.selectedNote = this.deal?.negotiationNotes?.[0] || null;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading deal', error);
        this.deal = this.sampleDeal;
        this.selectedNote = this.sampleDeal.negotiationNotes?.[0] || null;
        this.loading = false;
      }
    );
  }

  addNote(): void {
    this.showNoteForm = true;
  }

  selectNote(note: NegotiationNote): void {
    this.selectedNote = note;
    this.showMessage(`${note.negotiationPoint} selected.`);
  }

  updateSelectedNote(status: NegotiationNote['status']): void {
    if (!this.deal || !this.selectedNote) {
      return;
    }

    if (status === 'counter_proposed') {
      this.openCounterOffer();
      return;
    }

    const updatedNote: NegotiationNote = {
      ...this.selectedNote,
      status,
      response: status === 'accepted'
        ? 'Approved by customer.'
        : status === 'rejected'
          ? 'Rejected by customer.'
          : 'Counter offer requested.',
      updatedAt: new Date()
    };

    this.deal = {
      ...this.deal,
      negotiationNotes: (this.deal.negotiationNotes || []).map((note) => note.id === updatedNote.id ? updatedNote : note),
      updatedAt: new Date()
    };
    this.selectedNote = updatedNote;
    this.showMessage(`${updatedNote.negotiationPoint} marked as ${this.getStatusLabel(status)}.`);
  }

  openCounterOffer(): void {
    if (!this.selectedNote) {
      return;
    }

    this.showNoteForm = false;
    this.showCounterForm = true;
    this.counterForm = {
      amount: this.deal?.amount ? String(this.deal.amount) : '',
      terms: this.selectedNote.response || '',
      responseDate: ''
    };
    this.showMessage(`Preparing counter offer for ${this.selectedNote.negotiationPoint}.`);
  }

  saveCounterOffer(): void {
    if (!this.deal || !this.selectedNote || !this.counterForm.amount || !this.counterForm.terms.trim()) {
      this.showMessage('Add counter amount and terms before saving.');
      return;
    }

    const responseDate = this.counterForm.responseDate
      ? ` Expected response by ${new Date(this.counterForm.responseDate).toLocaleDateString()}.`
      : '';
    const counterText = `Counter offer: ${Number(this.counterForm.amount).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}. Terms: ${this.counterForm.terms.trim()}.${responseDate}`;
    const updatedNote: NegotiationNote = {
      ...this.selectedNote,
      status: 'counter_proposed',
      response: counterText,
      updatedAt: new Date()
    };

    this.deal = {
      ...this.deal,
      amount: Number(this.counterForm.amount) || this.deal.amount,
      stage: 'Negotiation',
      status: 'negotiation',
      negotiationNotes: (this.deal.negotiationNotes || []).map((note) => note.id === updatedNote.id ? updatedNote : note),
      updatedAt: new Date()
    };
    this.selectedNote = updatedNote;
    this.showCounterForm = false;
    this.showMessage('Counter offer saved.');
  }

  cancelCounterOffer(): void {
    this.showCounterForm = false;
  }

  saveNote(): void {
    if (!this.deal || !this.noteForm.negotiationPoint.trim() || !this.noteForm.note.trim()) {
      this.showMessage('Add a negotiation point and note before saving.');
      return;
    }

    const note: NegotiationNote = {
      dealId: this.deal.id,
      negotiationPoint: this.noteForm.negotiationPoint.trim(),
      note: this.noteForm.note.trim(),
      response: this.noteForm.response.trim(),
      proposedBy: `${this.deal.owner?.firstName || 'Sales'} ${this.deal.owner?.lastName || 'Owner'}`,
      status: this.noteForm.status,
      createdAt: new Date()
    };

    this.apiService.addNegotiationNote(this.deal.id, note).subscribe((response) => {
      if (response.success) {
        this.deal = {
          ...this.deal!,
          stage: 'Negotiation',
          status: 'negotiation',
          negotiationNotes: [response.data, ...(this.deal!.negotiationNotes || [])],
          updatedAt: new Date()
        };
        this.noteForm = { negotiationPoint: '', note: '', response: '', status: 'proposed' };
        this.selectedNote = response.data;
        this.showNoteForm = false;
        this.showMessage('Negotiation note added.');
      }
    });
  }

  sendProposal(): void {
    if (!this.deal) {
      return;
    }

    this.apiService.sendProposal(this.deal.id, {
      negotiationPoint: 'Proposal sent',
      note: 'Updated proposal sent to customer for approval.',
      proposedBy: `${this.deal.owner?.firstName || 'Sales'} ${this.deal.owner?.lastName || 'Owner'}`
    }).subscribe((response) => {
      if (response.success) {
        this.loadDeal(this.deal!.id);
        this.showMessage('Proposal sent and deal moved to proposal stage.');
      }
    });
  }

  viewProducts(): void {
    if (this.deal) {
      this.router.navigate(['/deals', this.deal.id, 'products']);
    }
  }

  viewQuote(): void {
    if (this.deal?.quoteId) {
      this.showMessage(`Quote ${this.deal.quoteId} is ready in the products and quote workspace.`);
      return;
    }
    this.viewProducts();
  }

  openDeal(): void {
    if (this.deal) {
      this.router.navigate(['/deals', this.deal.id]);
    }
  }

  closeWon(): void {
    this.closeDeal('closed_won', 'Customer approved');
  }

  closeLost(): void {
    this.closeDeal('closed_lost', 'Customer declined');
  }

  getStatusColor(status: string | undefined): string {
    const colors: Record<string, string> = {
      open: 'info',
      negotiation: 'warning',
      proposal_sent: 'primary',
      quote_pending: 'info',
      closed_won: 'success',
      closed_lost: 'danger'
    };
    return colors[status || ''] || 'secondary';
  }

  getPaymentStatusColor(status: string | undefined): string {
    const colors: Record<string, string> = {
      pending: 'warning',
      unpaid: 'warning',
      partially_paid: 'info',
      paid: 'success'
    };
    return colors[status || ''] || 'secondary';
  }

  getNoteStatusColor(status: string): string {
    const colors: Record<string, string> = {
      proposed: 'warning',
      counter_proposed: 'info',
      accepted: 'success',
      rejected: 'danger'
    };
    return colors[status] || 'secondary';
  }

  getStatusLabel(status: string | undefined): string {
    return (status || 'open').replace(/_/g, ' ');
  }

  private closeDeal(status: 'closed_won' | 'closed_lost', reason: string): void {
    if (!this.deal) {
      return;
    }

    this.apiService.closeDeal(this.deal.id, {
      status,
      reason,
      notes: status === 'closed_won' ? 'Final terms accepted.' : 'Deal closed after negotiation.'
    }).subscribe((response: any) => {
      if (response.success) {
        this.deal = response.data;
        this.showMessage(`${this.deal?.name} marked as ${status === 'closed_won' ? 'won' : 'lost'}.`);
      }
    });
  }

  private showMessage(message: string): void {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }
}
