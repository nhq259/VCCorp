import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',   // ✅
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent {
  items = [
    { label: 'Tổng quan', link: '/admin' },
    { label: 'Danh mục sản phẩm', link: '/admin/categories' },
    { label: 'Danh sách sản phẩm', link: '/admin/products' },
    { label: 'Danh sách đơn hàng', link: '/admin/orders' },
    { label: 'Nhóm quyền', link: '/admin/roles' },
    { label: 'Phân quyền', link: '/admin/roles/permissions' },
    { label: 'Danh sách tài khoản', link: '/admin/accounts' },
    { label: 'Danh sách người dùng', link: '/admin/users' },
    { label: 'Cài đặt chung', link: '/admin/settings/general' }
  ];
}
