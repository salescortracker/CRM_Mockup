import { Component, OnInit } from '@angular/core';

interface CallLogEntry {
  id: string;
  contact: string;
  company: string;
  channel: 'Call' | 'WhatsApp' | 'SMS';
  type: 'Inbound' | 'Outbound';
  disposition: 'Answered' | 'Voicemail' | 'No Answer' | 'Busy' | 'Callback Scheduled';
  duration: string;
  recordingUrl: string;
  time: string;
  notes: string;
}

interface MeetingSchedule {
  id: string;
  title: string;
  contact: string;
  calendar: 'Google' | 'Outlook' | 'Teams';
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

interface MessageLogEntry {
  id: string;
  contact: string;
  channel: 'WhatsApp' | 'SMS';
  direction: 'Inbound' | 'Outbound';
  snippet: string;
  time: string;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  trigger: string;
  action: string;
  description: string;
}

interface WorkflowRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
  type: 'Time-Based' | 'Event-Based';
  lastRun: string;
}

@Component({
  selector: 'app-engagement-center',
  standalone: false,
  templateUrl: './engagement-center.component.html',
  styleUrls: ['./engagement-center.component.css']
})
export class EngagementCenterComponent implements OnInit {
  heroTitle = 'Engagement Hub';
  heroSubtitle = 'Bring telephony, campaign integration, lead capture and automation together in one unified CRM space.';

  metrics = [
    { label: 'Calls Today', value: 128, icon: 'fa-phone', variant: 'primary' },
    { label: 'Recorded Calls', value: 94, icon: 'fa-record-vinyl', variant: 'success' },
    { label: 'Leads Captured', value: 220, icon: 'fa-user-plus', variant: 'info' },
    { label: 'Automation Rules', value: 16, icon: 'fa-robot', variant: 'warning' },
  ];

  telephonyCards = [
    {
      title: 'Call Tracking & Recording',
      description: 'Monitor every call, log outcomes and attach recordings automatically to lead profiles.',
      icon: 'fa-waveform-lines'
    },
    {
      title: 'Click-to-Call & Auto Dialer',
      description: 'Dial leads instantly from the CRM and queue follow-up call campaigns without switching apps.',
      icon: 'fa-phone-volume'
    },
    {
      title: 'Call Outcomes',
      description: 'Capture call results like connected, no-answer, voicemail and next action items.',
      icon: 'fa-clipboard-list'
    }
  ];

  captureCards = [
    {
      title: 'Lead Source Attribution',
      description: 'Track lead origin across web forms, campaigns, marketplaces and WhatsApp interactions.',
      icon: 'fa-map-marker-alt'
    },
    {
      title: 'Auto Lead Capture',
      description: 'Auto-import leads from campaigns and marketplaces, then enrich them with custom fields.',
      icon: 'fa-magic'
    },
    {
      title: 'Marketplace Integrations',
      description: 'Sync leads from IndiaMART, trade portals, and other B2B marketplaces into a single feed.',
      icon: 'fa-store'
    }
  ];

  automationCards = [
    {
      title: 'Trigger-Based Automation',
      description: 'Build workflows to assign leads, send reminders, or update statuses when conditions are met.',
      icon: 'fa-bolt'
    },
    {
      title: 'Follow-up & Reminders',
      description: 'Never miss a next step: schedule reminders, follow-ups and recurring nudge sequences.',
      icon: 'fa-calendar-check'
    },
    {
      title: 'Lead Bucket & Segmentation',
      description: 'Group leads by source, score, stage or campaign into dynamic buckets for smarter handoffs.',
      icon: 'fa-th-large'
    }
  ];

  channelCards = [
    {
      title: 'WhatsApp Business',
      description: 'Send templated messages, receive replies, and maintain historic chat threads per lead.',
      icon: 'fa-comments'
    },
    {
      title: 'Multi-Channel Outreach',
      description: 'Combine email, SMS, voice and chat in a single activity stream for each lead.',
      icon: 'fa-signal'
    },
    {
      title: 'Bulk Message & Email Sender',
      description: 'Run campaign blasts from within the CRM and review delivery status and replies.',
      icon: 'fa-envelope-open-text'
    }
  ];

  kpiCards = [
    {
      title: 'Lead Journey Tracking',
      description: 'Visualize the path from new lead to qualified opportunity with stage-by-stage progress.',
      icon: 'fa-route'
    },
    {
      title: 'Dashboard & KPI Tracking',
      description: 'Measure campaign ROI, lead velocity, call conversion and automation effectiveness.',
      icon: 'fa-chart-line'
    },
    {
      title: 'Activity Tracking',
      description: 'See all call logs, messages, notes and tasks in one activity timeline for every lead.',
      icon: 'fa-tasks'
    }
  ];

  callDispositions = ['Answered', 'Voicemail', 'No Answer', 'Busy', 'Callback Scheduled'];

  callLogs: CallLogEntry[] = [
    {
      id: 'call-01',
      contact: 'Jane Smith',
      company: 'TechCorp',
      channel: 'Call',
      type: 'Outbound',
      disposition: 'Answered',
      duration: '12:34',
      recordingUrl: '#',
      time: 'Today, 10:15 AM',
      notes: 'Discussed product requirements and next demo.'
    },
    {
      id: 'call-02',
      contact: 'Bob Johnson',
      company: 'StartupInc',
      channel: 'Call',
      type: 'Inbound',
      disposition: 'Voicemail',
      duration: '00:00',
      recordingUrl: '#',
      time: 'Today, 9:05 AM',
      notes: 'Left voicemail for follow-up.'
    },
    {
      id: 'call-03',
      contact: 'Sarah Lee',
      company: 'EnterpriseCo',
      channel: 'WhatsApp',
      type: 'Outbound',
      disposition: 'Answered',
      duration: '04:12',
      recordingUrl: '#',
      time: 'Yesterday, 3:45 PM',
      notes: 'Sent message with pricing details.'
    }
  ];

  messageLogs: MessageLogEntry[] = [
    {
      id: 'msg-01',
      contact: 'Aisha Khan',
      channel: 'WhatsApp',
      direction: 'Inbound',
      snippet: 'Can we move the meeting to next week?',
      time: 'Today, 11:02 AM'
    },
    {
      id: 'msg-02',
      contact: 'Leena Patel',
      channel: 'SMS',
      direction: 'Outbound',
      snippet: 'Reminder: call scheduled tomorrow at 2 PM.',
      time: 'Yesterday, 4:30 PM'
    }
  ];

  meetingSchedules: MeetingSchedule[] = [
    {
      id: 'meet-01',
      title: 'Q2 Planning Session',
      contact: 'Sarah Johnson',
      calendar: 'Google',
      date: '2026-05-12',
      time: '02:00 PM',
      status: 'Confirmed'
    },
    {
      id: 'meet-02',
      title: 'Review Demo Feedback',
      contact: 'Rohit Kumar',
      calendar: 'Outlook',
      date: '2026-05-14',
      time: '11:00 AM',
      status: 'Pending'
    }
  ];

  workflowTemplates: WorkflowTemplate[] = [
    {
      id: 'wf-1',
      name: 'Lead Follow-up Reminder',
      trigger: 'Lead status changes to Contacted',
      action: 'Send reminder email after 2 days',
      description: 'Automatically nudge leads that have been contacted but not yet qualified.'
    },
    {
      id: 'wf-2',
      name: 'Deal Stage Escalation',
      trigger: 'Deal advances to Negotiation',
      action: 'Notify sales manager and update task priority',
      description: 'Trigger manager review when a high-value deal enters negotiation.'
    },
    {
      id: 'wf-3',
      name: 'Lost Lead Re-engagement',
      trigger: 'Lead marked Lost',
      action: 'Schedule a re-engagement sequence in 30 days',
      description: 'Keep opportunities warm with an automated restart campaign.'
    }
  ];

  automationRules: WorkflowRule[] = [
    {
      id: 'rule-01',
      name: 'New Lead Follow-up',
      trigger: 'New lead created',
      action: 'Create follow-up task + send welcome email',
      enabled: true,
      type: 'Event-Based',
      lastRun: 'Today, 8:30 AM'
    },
    {
      id: 'rule-02',
      name: 'Deal Stage Reminder',
      trigger: 'Deal stage changes to Proposal',
      action: 'Send manager reminder and update call queue',
      enabled: false,
      type: 'Time-Based',
      lastRun: 'May 8, 2026'
    }
  ];

  workflowName = '';
  workflowTrigger = '';
  workflowAction = '';
  workflowType: WorkflowRule['type'] = 'Event-Based';
  workflowEnabled = true;

  meetingTitle = '';
  meetingContact = '';
  meetingDate = this.formatToday();
  meetingTime = '10:00';
  meetingCalendar: MeetingSchedule['calendar'] = 'Google';

  constructor() {}

  ngOnInit(): void {}

  recordDisposition(entry: CallLogEntry, disposition: string): void {
    entry.disposition = disposition as CallLogEntry['disposition'];
  }

  scheduleMeeting(): void {
    if (!this.meetingTitle || !this.meetingContact || !this.meetingDate || !this.meetingTime) {
      alert('Please complete all meeting details.');
      return;
    }
    this.meetingSchedules.unshift({
      id: `meet-${Date.now()}`,
      title: this.meetingTitle,
      contact: this.meetingContact,
      calendar: this.meetingCalendar,
      date: this.meetingDate,
      time: this.meetingTime,
      status: 'Pending'
    });
    this.meetingTitle = '';
    this.meetingContact = '';
    this.meetingDate = this.formatToday();
    this.meetingTime = '10:00';
    this.meetingCalendar = 'Google';
    alert('Meeting scheduled successfully.');
  }

  addAutomationRule(): void {
    if (!this.workflowName.trim() || !this.workflowTrigger.trim() || !this.workflowAction.trim()) {
      alert('Please fill all workflow fields.');
      return;
    }
    this.automationRules.unshift({
      id: `rule-${Date.now()}`,
      name: this.workflowName.trim(),
      trigger: this.workflowTrigger.trim(),
      action: this.workflowAction.trim(),
      enabled: this.workflowEnabled,
      type: this.workflowType,
      lastRun: 'Never'
    });
    this.workflowName = '';
    this.workflowTrigger = '';
    this.workflowAction = '';
    this.workflowType = 'Event-Based';
    this.workflowEnabled = true;
    alert('Workflow rule created successfully.');
  }

  selectTemplate(templateId: string): void {
    const template = this.workflowTemplates.find((item) => item.id === templateId);
    if (!template) {
      return;
    }
    this.workflowName = template.name;
    this.workflowTrigger = template.trigger;
    this.workflowAction = template.action;
    this.workflowType = template.trigger.includes('time') ? 'Time-Based' : 'Event-Based';
    this.workflowEnabled = true;
  }

  toggleRule(rule: WorkflowRule): void {
    rule.enabled = !rule.enabled;
  }

  formatToday(): string {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  }
}
