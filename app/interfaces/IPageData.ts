export interface PageData {
  adminRequired?: boolean;
  link?: string;
  image?: string;
  [key: string]: any;
}

export interface CategoryData {
  [key: string]: PageData;
}

export interface SearchablePages {
  [key: string]: CategoryData;
}

export interface SearchPagesProps {
  searchablePages: SearchablePages;
  isAdmin: boolean; // Add isAdmin prop
}
