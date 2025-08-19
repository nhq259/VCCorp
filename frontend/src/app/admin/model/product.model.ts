export class Product {
    id: number;
    title: string;
    product_category_id: string;
    description: string;
    price: number;
    discount_percentage: number;
    stock: number;
    thumbnail: string;
    status: string;
    featured: string;
    position: number;
    slug: string;
    deleted: string;
    createdAt: Date;
    updatedAt: Date;
    category: { id: number; title: string; slug: string };

    constructor() {
        this.id = 0;
        this.title = '';
        this.product_category_id = '';
        this.description = '';
        this.price = 0;
        this.discount_percentage = 0;
        this.stock = 0;
        this.thumbnail = '';
        this.status = '';
        this.featured = '';
        this.position = 0;
        this.slug = '';
        this.deleted = '';
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.category = { id: 0, title: '', slug: '' };
    }
}
export class ProductResponse {
  success: boolean;
  data: {
    data: Product[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  status: number;
  message: string;

  constructor(
    success: boolean,
    data: {
      data: Product[];
      meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    },
    status: number,
    message: string
  ) {
    this.success = success;
    this.data = data;
    this.status = status;
    this.message = message;
  }
}
