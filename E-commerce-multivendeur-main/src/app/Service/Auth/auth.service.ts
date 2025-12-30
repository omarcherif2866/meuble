import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { User } from 'src/app/Models/user';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = "http://localhost:9090/api/auth";
  private apiUrlUser = "http://localhost:9090/users";

  private localStorageKey = "userAuth";   // stockage principal
  private loggedIn = new BehaviorSubject<boolean>(false);
  private jwtHelper = new JwtHelperService();

  constructor(private httpClient: HttpClient) {

    const userData = localStorage.getItem(this.localStorageKey);
    if (userData) {
      const parsed = JSON.parse(userData);
      this.loggedIn.next(!!parsed.accessToken);
    }
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  // -------------------- LOGIN --------------------
  login(loginData: { email: string; password: string }): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/login`, loginData).pipe(
      tap(response => {
        localStorage.setItem(this.localStorageKey, JSON.stringify(response));
        this.loggedIn.next(true);
      }),
      catchError(error => {
        console.error("Erreur de connexion:", error);
        return throwError(() => error);
      })
    );
  }

  // -------------------- LOGOUT --------------------
logout(): void {
  // Déclarer toutes les clés à supprimer
  const keysToRemove = ['userAuth', 'accessToken', 'userId', 'userRole'];

  // Boucler et supprimer chaque clé
  keysToRemove.forEach(key => localStorage.removeItem(key));

  // Mettre à jour l'état de connexion
  this.loggedIn.next(false);
}


  // -------------------- REGISTER --------------------
  addUser(user: any): Observable<User> {
      console.log('Sending to backend:', user);
    return this.httpClient.post<User>(`${this.apiUrl}/register`, user);
  }

  // -------------------- TOKEN --------------------
  getToken(): string | null {
    const userData = localStorage.getItem(this.localStorageKey);
    return userData ? JSON.parse(userData).accessToken : null;
  }

  getRoleFromToken(): string {
    const token = this.getToken();
    if (!token) return "vide";
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded?.role || "";
  }

  // -------------------- USER ID --------------------
  getUserIdFromToken(): number | null {
    const token = this.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decoded = this.jwtHelper.decodeToken(token);
      return decoded?.id || null;
    }
    return null;
  }

  storeUserIdFromToken(): void {
    const id = this.getUserIdFromToken();
    if (id !== null) {
      localStorage.setItem('userId', id.toString());
    }
  }

  getUserId(): number | null {
    const id = localStorage.getItem('userId');
    return id ? Number(id) : null;
  }

  // -------------------- UPDATE USER --------------------
  updateUserProfile(id: any, user: any): Observable<User> {
    return this.httpClient.put<User>(`${this.apiUrl}/${id}`, user, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

getUserProfile(id: any): Observable<User> {
  return this.httpClient.get<User>(`${this.apiUrlUser}/${id}`);
}

changePassword(id: any, data: any): Observable<any> {
  return this.httpClient.put(`${this.apiUrlUser}/change-password/${id}`, data);
}


  updateUserPassword(id: any, password: string, newPassword: string): Observable<any> {
    const data = {
      password: password,
      newpassword: newPassword
    };
  
    return this.httpClient.put<any>(`http://localhost:9090/api/user/password/${id}`, data);
  }

 forgotPassword(email: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/forgot`, { email });
  }

  // Vérifier le code
  verifyCode(userId: string, code: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/verify-code`, { userId, code });
  }

  // Réinitialiser le mot de passe
  resetPassword(userId: string, newPassword: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/reset`, { userId, newPassword });
  }

    setLoggedIn(status: boolean) {
    this.loggedIn.next(status); // Mettez à jour l'état de connexion avec le BehaviorSubject
    // Stockez également l'état de connexion dans le localStorage
    localStorage.setItem('loggedIn', JSON.stringify(status));
  }

}

  

