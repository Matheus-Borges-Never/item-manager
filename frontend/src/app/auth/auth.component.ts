import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { environment } from '../../environments/environments';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  private auth: any;
  loading = false;

  constructor(private router: Router, private sanitizer: DomSanitizer) {
    const app = initializeApp(environment.firebaseConfig);
    this.auth = getAuth(app);
  }

  ngOnInit() {}

  async signInWithGoogle() {
    try {
      this.loading = true;
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error logging in with Google:', error);
      alert('Erro ao fazer login com o Google. Por favor, tente novamente.');
    } finally {
      this.loading = false;
    }
  }
}
