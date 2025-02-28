import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEdit,
  faTrash,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';

import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    MatDialogModule,
    FontAwesomeModule,
  ],
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css'],
})
export class ItemDetailComponent implements OnInit {
  item: Item | undefined;
  faEdit = faEdit;
  faTrash = faTrash;
  faArrowLeft = faArrowLeft;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadItem(id);
    } else {
      this.router.navigate(['/items']);
    }
  }

  loadItem(id: string): void {
    this.itemService.getItemById(id).subscribe((item) => {
      if (item) {
        this.item = item;
      } else {
        this.snackBar.open('Item não encontrado!', 'Fechar', {
          duration: 3000,
        });
        this.router.navigate(['/items']);
      }
    });
  }

  editItem(): void {
    if (this.item) {
      this.router.navigate(['/items/edit', this.item.id]);
    }
  }

  deleteItem(): void {
    if (!this.item) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmar exclusão',
        message: 'Tem certeza que deseja excluir este item?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.item) {
        this.itemService.deleteItem(this.item.id);
        this.snackBar.open('Item excluído com sucesso!', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
        this.router.navigate(['/items']);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/items']);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
