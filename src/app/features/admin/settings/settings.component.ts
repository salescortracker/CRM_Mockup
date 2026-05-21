import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  settings: any = {
    appName: 'CRM System',
    appVersion: '1.0.0',
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    enableNotifications: true,
    enableTwoFactor: false
  };

  constructor(private router: Router) {}

  saveSettings() {
    localStorage.setItem('appSettings', JSON.stringify(this.settings));
    alert('Settings saved successfully!');
  }

  resetSettings() {
    localStorage.removeItem('appSettings');
    alert('Settings reset to defaults!');
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}