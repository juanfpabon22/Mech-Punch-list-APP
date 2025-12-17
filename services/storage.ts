import { PunchItem, Status, Role } from '../types';
import { PUNCH_ITEMS } from '../constants';

const DB_KEY = 'punch_list_db_v1';

export const StorageService = {
  // Initialize DB with demo data if empty
  init: () => {
    if (typeof window !== 'undefined') {
      try {
        const existing = localStorage.getItem(DB_KEY);
        if (!existing) {
          localStorage.setItem(DB_KEY, JSON.stringify(PUNCH_ITEMS));
        } else {
            // Verify integrity
            JSON.parse(existing);
        }
      } catch (e) {
        console.error("Database corruption detected. Resetting to default.", e);
        localStorage.setItem(DB_KEY, JSON.stringify(PUNCH_ITEMS));
      }
    }
  },

  // Get all items
  getItems: (): PunchItem[] => {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(DB_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Error reading items", e);
        return [];
    }
  },

  // Save or Update an item
  saveItem: (item: PunchItem) => {
    try {
        const items = StorageService.getItems();
        const index = items.findIndex(i => i.id === item.id);
        
        if (index >= 0) {
          // Update existing
          items[index] = item;
        } else {
          // Create new
          items.unshift(item); // Add to top
        }
        
        localStorage.setItem(DB_KEY, JSON.stringify(items));
        return items;
    } catch (e) {
        console.error("Error saving item (possible quota exceeded)", e);
        alert("Error al guardar: Es posible que el almacenamiento local esté lleno.");
        return StorageService.getItems(); // Return existing state without changes on error
    }
  },

  // Bulk Import Items
  importItems: (newItems: PunchItem[]) => {
    try {
        const currentItems = StorageService.getItems();
        // Add new items to the beginning
        const updatedItems = [...newItems, ...currentItems];
        localStorage.setItem(DB_KEY, JSON.stringify(updatedItems));
        return updatedItems;
    } catch (e) {
        console.error("Error importing items", e);
        alert("Error al importar: Posiblemente el almacenamiento esté lleno.");
        return StorageService.getItems();
    }
  },

  // Delete an item
  deleteItem: (id: string) => {
    try {
        const items = StorageService.getItems();
        const newItems = items.filter(i => i.id !== id);
        localStorage.setItem(DB_KEY, JSON.stringify(newItems));
        return newItems;
    } catch (e) {
        console.error("Error deleting item", e);
        return StorageService.getItems();
    }
  }
};