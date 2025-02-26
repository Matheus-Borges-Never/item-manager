import { Component, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { environment } from '../../environments/environments';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  private auth: any;
  loading = false;

  constructor(private router: Router) {
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
      alert('Erro ao fazer login com o Google. Por favor, tente novamente.');
    } finally {
      this.loading = false;
    }
  }
}
