import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule, MatSnackBarModule],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
      .then(() => this.router.navigate(['/ventas']))
      .catch((err) => {
        this.snackBar.open('Error de autenticación: ' + err.message, 'Cerrar', {
          duration: 3000,
          panelClass: ['bg-red-600', 'text-white']
        });
      });
  }
}
