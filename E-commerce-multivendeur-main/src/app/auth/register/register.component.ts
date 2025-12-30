import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/Service/Auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  selectedFile: File | null = null;
  submitted = false;
  siteKey: string = "6Ld8HIYjAAAAALw437G-L_PF1PNrNZH4Qq76MvSU";

  constructor(
    private service: AuthService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      recaptcha: ['', Validators.required],
      image: [null], // Pas obligatoire
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Mettre à jour le FormControl avec le fichier
      this.form.patchValue({
        image: file
      });
      // Marquer le champ comme touché pour la validation
      this.form.get('image')?.updateValueAndValidity();
    }
  }

  sendEmail(): void {
    // Implémentez votre logique d'envoi d'email ici
  }

  submit() {
    this.submitted = true;

    // Vérifier si le formulaire est valide
    if (this.form.invalid) {
      this.toastr.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Créer FormData
    const formData = new FormData();
    
    // Créer l'objet user en JSON (sans le rôle, il sera affecté par le backend)
    const userObj = {
      username: this.form.value.username,
      email: this.form.value.email,
      password: this.form.value.password
    };
    
    // Ajouter l'objet user comme JSON Blob
    const userBlob = new Blob([JSON.stringify(userObj)], { 
      type: 'application/json' 
    });
    formData.append('user', userBlob);
    
    // Ajouter le fichier image s'il existe
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    console.log('Form Data to send:');
    console.log('User Object:', userObj);
    console.log('Image:', this.selectedFile);

    // Envoyer les données
    this.service.addUser(formData).subscribe(
      res => {
        this.toastr.success('Inscription avec succès');
        this.sendEmail();
        this.router.navigate(['/login']);
      },
      (error) => {
        console.log('Error:', error);
        if (error.status === 400) {
          const errorMessage = error.error?.message || 'Email ou nom d\'utilisateur déjà existant';
          this.toastr.error(errorMessage);
        } else if (error.status === 401) {
          this.toastr.error('Erreur d\'authentification. Veuillez réessayer.');
        } else {
          this.toastr.error('Erreur lors de l\'inscription: ' + (error.error?.message || error.message));
        }
      }
    );
  }
}