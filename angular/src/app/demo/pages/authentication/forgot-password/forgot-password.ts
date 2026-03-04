import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  currentStep = signal(1);
  submitted = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  error = signal('');

  resetForm = {
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  };

  onSubmit(event: Event) {
    event.preventDefault();
  }

  nextStep() {
    this.submitted.set(true);
    this.error.set('');

    if (this.currentStep() === 1) {
      if (!this.resetForm.email) {
        this.error.set('Please enter your email address');
        return;
      }
      // Simulate API call to send code
      console.log('Sending code to:', this.resetForm.email);
      this.currentStep.set(2);
      this.submitted.set(false);
    } else if (this.currentStep() === 2) {
      if (!this.resetForm.code) {
        this.error.set('Please enter the verification code');
        return;
      }
      // Simulate API call to verify code
      console.log('Verifying code:', this.resetForm.code);
      this.currentStep.set(3);
      this.submitted.set(false);
    }
  }

  previousStep() {
    this.submitted.set(false);
    this.error.set('');
    if (this.currentStep() > 1) {
      this.currentStep.set(this.currentStep() - 1);
    }
  }

  resetPassword() {
    this.submitted.set(true);
    this.error.set('');

    if (!this.resetForm.newPassword) {
      this.error.set('Please enter a new password');
      return;
    }

    if (!this.resetForm.confirmPassword) {
      this.error.set('Please confirm your password');
      return;
    }

    if (this.resetForm.newPassword !== this.resetForm.confirmPassword) {
      this.error.set('Passwords do not match');
      return;
    }

    if (this.resetForm.newPassword.length < 8) {
      this.error.set('Password must be at least 8 characters long');
      return;
    }

    // Simulate API call to reset password
    console.log('Resetting password for:', this.resetForm.email);
    alert('Password reset successfully! Please login with your new password.');
    // Redirect to login
    window.location.href = '/login';
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }
}
