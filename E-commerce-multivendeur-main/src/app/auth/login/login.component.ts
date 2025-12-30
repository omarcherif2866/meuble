import { Component, Inject, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Emitters } from 'src/app/emitters/emitter';
import { AuthService } from 'src/app/Service/Auth/auth.service';
// import { Role } from 'src/app/Models/role';
import { User } from 'src/app/Models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // role: Role[] = [];
  user!:User

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  submitted = false;
  constructor(private formBuilder: FormBuilder,
    private service: AuthService,
    private http: HttpClient,
    private router: Router , @Inject(DOCUMENT) private document: Document  , private toastr: ToastrService) { }


  ngOnInit(): void {

    this.form = this.formBuilder.group(
      {

        email: [null, [Validators.required , Validators.email]],
        password: [null, [Validators.required, Validators.minLength(6)]],
      }

    );
    // this.getRoles()

  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }





submit() {
  const t = {
    email: this.form.value.email,
    password: this.form.value.password,
  };

  this.service.login(t).subscribe(
    (data) => {
      this.user = data;
      console.log('User ID:', data.id);
      console.log('User ID stored in localStorage:', localStorage.getItem('user_id'));
      console.log('User Roles:', this.user.role);
      console.log('User :', data);

      // Update the logged-in status
      this.service.setLoggedIn(true);
      this.toastr.success('Vous etes connecté');


      Emitters.authEmitter2.emit(true);

      console.log('User is logged in');

      this.router.navigate(['/accueil'])

    },
    (error) => {
      this.toastr.error('check your email or password');
      console.error(error);
    }
  );
}


// getRoles() {
//   this.service.getRoles().subscribe(
//     (role: Role[]) => {
//       this.role = role;
//       console.log(role)
//     },
//     (error: any) => {
//       console.error(error);
//     }
//   );
// }


}






