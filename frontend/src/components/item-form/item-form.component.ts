import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule,
    FontAwesomeModule,
  ],
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css'],
})
export class ItemFormComponent implements OnInit {
  itemForm!: FormGroup;
  isEditMode = false;
  itemId: string | null = null;
  imagePreview: string | null = null;
  isLoading = false;
  faSave = faSave;
  faArrowLeft = faArrowLeft;

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.itemId = this.route.snapshot.paramMap.get('id');
    if (this.itemId) {
      this.isEditMode = true;
      this.loadItem(this.itemId);
    }
  }

  initForm(): void {
    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      imageUrl: [''],
    });
  }

  loadItem(id: string): void {
    this.isLoading = true;
    this.itemService.getItemById(id).subscribe((item) => {
      if (item) {
        this.itemForm.patchValue({
          name: item.name,
          description: item.description,
          imageUrl: item.imageUrl,
        });
        this.imagePreview = item.imageUrl;
      } else {
        this.snackBar.open('Item não encontrado!', 'Fechar', {
          duration: 3000,
        });
        this.router.navigate(['/items']);
      }
      this.isLoading = false;
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.itemForm.patchValue({ imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.itemForm.patchValue({ imageUrl: '' });
  }

  onSubmit(): void {
    if (this.itemForm.invalid) {
      return;
    }

    const itemData = this.itemForm.value;

    if (this.isEditMode && this.itemId) {
      this.itemService.updateItem(this.itemId, itemData);
      this.snackBar.open('Item atualizado com sucesso!', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    } else {
      this.itemService.addItem(itemData);
      this.snackBar.open('Item criado com sucesso!', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    }

    this.router.navigate(['/items']);
  }

  goBack(): void {
    this.router.navigate(['/items']);
  }
}
