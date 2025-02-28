import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Item } from '../models/item.model';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private items: Item[] = [];
  private itemsSubject = new BehaviorSubject<Item[]>([]);

  constructor() {
    const savedItems = localStorage.getItem('items');
    if (savedItems) {
      this.items = JSON.parse(savedItems).map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
      }));
      this.itemsSubject.next([...this.items]);
    }
  }

  getItems(): Observable<Item[]> {
    return this.itemsSubject.asObservable();
  }

  getItemById(id: string): Observable<Item | undefined> {
    const item = this.items.find((item) => item.id === id);
    return of(item);
  }

  addItem(item: Omit<Item, 'id' | 'createdAt'>): void {
    const newItem: Item = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    this.items.push(newItem);
    this.itemsSubject.next([...this.items]);
    this.saveToLocalStorage();
  }

  updateItem(id: string, updatedItem: Partial<Item>): void {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items[index] = { ...this.items[index], ...updatedItem };
      this.itemsSubject.next([...this.items]);
      this.saveToLocalStorage();
    }
  }

  deleteItem(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
    this.itemsSubject.next([...this.items]);
    this.saveToLocalStorage();
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('items', JSON.stringify(this.items));
  }
}
