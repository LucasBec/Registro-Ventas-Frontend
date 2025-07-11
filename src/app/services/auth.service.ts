import { Injectable } from '@angular/core';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../environments/firebase.config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user: User | null = null;

  constructor() {
    onAuthStateChanged(auth, (user) => {
      this.user = user;
    });
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  logout() {
    return signOut(auth);
  }

  get isLoggedIn(): boolean {
    return this.user !== null;
  }

  get currentUser(): User | null {
    return this.user;
  }
}
