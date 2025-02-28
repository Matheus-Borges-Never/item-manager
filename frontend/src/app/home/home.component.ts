import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Item } from '../../models/item.model';
import {
  faEdit,
  faTrash,
  faPlus,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { ItemService } from '../../services/item.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    FontAwesomeModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  items: Item[] = [];
  faEdit = faEdit;
  faTrash = faTrash;
  faPlus = faPlus;
  faEye = faEye;
  userName = '';
  isLoading = false;

  constructor(
    private router: Router,
    private itemService: ItemService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userName = user.displayName || 'Usuário';
        this.loadItems();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  loadItems() {
    this.isLoading = true;
    this.itemService.getItems().subscribe({
      next: (items) => {
        this.items = items;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar itens:', error);
        this.isLoading = false;
      },
    });
  }

  logout() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Erro ao fazer logout:', error);
      });
  }

  createItem(): void {
    this.router.navigate(['/items/new']);
  }

  editItem(id: string): void {
    this.router.navigate(['/items/edit', id]);
  }

  viewItem(id: string): void {
    this.router.navigate(['/items', id]);
  }

  deleteItem(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmar exclusão',
        message: 'Tem certeza que deseja excluir este item?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.itemService.deleteItem(id).subscribe({
          next: () => {
            this.loadItems();
          },
          error: (error: any) => {
            console.error('Erro ao excluir item:', error);
          },
        });
      }
    });
  }

  getGridCols(): number {
    const width = window.innerWidth;
    if (width < 600) return 1;
    if (width < 960) return 2;
    return 3;
  }
}
