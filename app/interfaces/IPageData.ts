interface PageData {
  adminRequired?: boolean;
  link?: string;
  image?: string;
  [key: string]: any;
}

interface CategoryData {
  [key: string]: PageData;
}

interface SearchablePages {
  [key: string]: CategoryData;
}

export interface SearchPagesProps {
  searchablePages: SearchablePages;
  isAdmin: boolean; // Add isAdmin prop
}
