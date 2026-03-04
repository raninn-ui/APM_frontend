// angular import
import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { email, Field, form, minLength, required } from '@angular/forms/signals';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthService } from 'src/app/services/auth';

@Component({
  selector: 'app-sign-in',
  imports: [CommonModule, RouterModule, SharedModule, Field],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  private cd = inject(ChangeDetectorRef);
  private router = inject(Router);
  private authService = inject(AuthService);

  submitted = signal(false);
  error = signal('');
  showPassword = signal(false);

  loginModal = signal<{ email: string; password: string }>({
    email: '',
    password: ''
  });

  loginForm = form(this.loginModal, (schemaPath) => {
    required(schemaPath.email, { message: 'Email requis' });
    email(schemaPath.email, { message: 'Veuillez saisir une adresse e-mail valide' });
    required(schemaPath.password, { message: 'Le mot de passe est requis' });
    minLength(schemaPath.password, 8, { message: 'Mot de passe incorrect' });
  });

  onSubmit(event: Event) {
    this.submitted.set(true);
    this.error.set('');
    event.preventDefault();

    // Check if email and password have errors
    const emailErrors = this.loginForm.email().errors();
    const passwordErrors = this.loginForm.password().errors();

    if (emailErrors.length > 0 || passwordErrors.length > 0) {
      this.error.set('Veuillez corriger les erreurs ci-dessus');
      return;
    }

    const credentials = this.loginModal();
    console.log('Attempting login with:', credentials.email);

    // Call authentication service
    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login successful:', response.user);
        // Redirect to Plans d'Action Usine after successful login
        this.router.navigate(['/plans-usine']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.error.set(this.authService.error() || 'Erreur de connexion. Veuillez réessayer.');
      }
    });

    this.cd.detectChanges();
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }
}
