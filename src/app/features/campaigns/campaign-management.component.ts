import { Component, OnInit } from '@angular/core';

interface Campaign {
  id: string;
  name: string;
  owner: string;
  status: 'Planning' | 'Active' | 'Paused' | 'Completed';
  channels: string[];
  startDate: string;
  endDate: string;
  budget: number;
  spend: number;
  leadsGenerated: number;
  revenue: number;
  template: string;
  roi?: string;
}

interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  channels: string[];
  target: string;
  budget: number;
}

@Component({
  selector: 'app-campaign-management',
  standalone: false,
  templateUrl: './campaign-management.component.html',
  styleUrls: ['./campaign-management.component.css']
})
export class CampaignManagementComponent implements OnInit {
  campaignName = '';
  campaignOwner = 'John Doe';
  campaignStatus: Campaign['status'] = 'Planning';
  campaignChannels: string[] = [];
  campaignTemplate = '';
  campaignGoal = 'Lead generation';
  campaignBudget = 15000;
  campaignStartDate = this.formatToday();
  campaignEndDate = this.formatFutureDate(30);

  allChannels = ['Email', 'SMS', 'Social', 'Display', 'Web', 'Call'];
  campaignStatuses: Campaign['status'][] = ['Planning', 'Active', 'Paused', 'Completed'];
  campaignGoals = ['Lead generation', 'Brand awareness', 'Retention', 'Conversion', 'Event promotion'];

  templates: CampaignTemplate[] = [
    {
      id: 'template-1',
      name: 'Lead Nurture Sequence',
      description: 'Automated multi-touch nurture for new prospects.',
      channels: ['Email', 'SMS'],
      target: 'Warm leads',
      budget: 12000
    },
    {
      id: 'template-2',
      name: 'Reactivation Drip',
      description: 'Win back inactive contacts with targeted offers.',
      channels: ['Email', 'Social'],
      target: 'Dormant customers',
      budget: 9000
    },
    {
      id: 'template-3',
      name: 'Product Launch Blitz',
      description: 'High-impact launch across email and social channels.',
      channels: ['Email', 'Social', 'Display'],
      target: 'New market',
      budget: 25000
    }
  ];

  campaigns: Campaign[] = [];
  selectedTemplateDescription = '';

  ngOnInit(): void {
    this.loadCampaigns();
  }

  loadCampaigns(): void {
    this.campaigns = [
      {
        id: 'camp-001',
        name: 'Spring Re-engagement',
        owner: 'Aisha Khan',
        status: 'Active',
        channels: ['Email', 'Social'],
        startDate: '2026-04-01',
        endDate: '2026-05-30',
        budget: 18000,
        spend: 12350,
        leadsGenerated: 174,
        revenue: 54000,
        template: 'Lead Nurture Sequence'
      },
      {
        id: 'camp-002',
        name: 'Enterprise Launch',
        owner: 'Rajesh Singh',
        status: 'Planning',
        channels: ['Email', 'Display', 'Call'],
        startDate: '2026-06-10',
        endDate: '2026-08-05',
        budget: 42000,
        spend: 0,
        leadsGenerated: 0,
        revenue: 0,
        template: 'Product Launch Blitz'
      },
      {
        id: 'camp-003',
        name: 'Customer Renewal Drive',
        owner: 'Leena Patel',
        status: 'Paused',
        channels: ['SMS', 'Email'],
        startDate: '2026-03-15',
        endDate: '2026-05-15',
        budget: 9500,
        spend: 7100,
        leadsGenerated: 63,
        revenue: 21800,
        template: 'Reactivation Drip'
      }
    ];
  }

  selectTemplate(templateId: string): void {
    const template = this.templates.find((item) => item.id === templateId);
    if (!template) {
      this.selectedTemplateDescription = '';
      return;
    }
    this.campaignTemplate = template.name;
    this.campaignChannels = [...template.channels];
    this.campaignGoal = template.target;
    this.campaignBudget = template.budget;
    this.selectedTemplateDescription = template.description;
  }

  toggleChannel(channel: string): void {
    const index = this.campaignChannels.indexOf(channel);
    if (index >= 0) {
      this.campaignChannels.splice(index, 1);
      return;
    }
    this.campaignChannels.push(channel);
  }

  createCampaign(): void {
    if (!this.campaignName.trim() || this.campaignChannels.length === 0) {
      alert('Please provide a campaign name and select at least one channel.');
      return;
    }

    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      name: this.campaignName.trim(),
      owner: this.campaignOwner,
      status: this.campaignStatus,
      channels: [...this.campaignChannels],
      startDate: this.campaignStartDate,
      endDate: this.campaignEndDate,
      budget: this.campaignBudget,
      spend: 0,
      leadsGenerated: 0,
      revenue: 0,
      template: this.campaignTemplate || 'Custom'
    };

    this.campaigns.unshift(newCampaign);
    this.resetCampaignForm();
    alert('Campaign created successfully.');
  }

  resetCampaignForm(): void {
    this.campaignName = '';
    this.campaignStatus = 'Planning';
    this.campaignChannels = [];
    this.campaignTemplate = '';
    this.campaignGoal = 'Lead generation';
    this.campaignBudget = 15000;
    this.campaignStartDate = this.formatToday();
    this.campaignEndDate = this.formatFutureDate(30);
    this.selectedTemplateDescription = '';
  }

  trackROI(campaign: Campaign): string {
    if (!campaign.revenue || campaign.spend === 0) {
      return 'TBD';
    }
    return `${(((campaign.revenue - campaign.spend) / campaign.spend) * 100).toFixed(0)}%`;
  }

  get totalCampaigns(): number {
    return this.campaigns.length;
  }

  get activeCampaigns(): number {
    return this.campaigns.filter((c) => c.status === 'Active').length;
  }

  get budgetDeployed(): number {
    return this.campaigns.reduce((sum, campaign) => sum + campaign.spend, 0);
  }

  get leadsGenerated(): number {
    return this.campaigns.reduce((sum, campaign) => sum + campaign.leadsGenerated, 0);
  }

  private formatToday(): string {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  }

  private formatFutureDate(days: number): string {
    const future = new Date();
    future.setDate(future.getDate() + days);
    return future.toISOString().slice(0, 10);
  }
}
