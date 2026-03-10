// angular import
import { Component, OnInit, inject, output } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';

// project import
import { environment } from 'src/environments/environment';
import { NavigationItem, NavigationItems } from '../navigation';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavGroupComponent } from './nav-group/nav-group.component';
import { NavItemComponent } from './nav-item/nav-item.component';
import { NavCollapseComponent } from './nav-collapse/nav-collapse.component';
import { AuthService } from 'src/app/services/auth';

@Component({
  selector: 'app-nav-content',
  imports: [SharedModule, NavGroupComponent, NavItemComponent, NavCollapseComponent],
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent implements OnInit {
  private location = inject(Location);
  private locationStrategy = inject(LocationStrategy);
  private authService = inject(AuthService);

  // version
  title = 'Demo application for version numbering';
  currentApplicationVersion = environment.appVersion;

  // public pops
  navigation: NavigationItem[];
  contentWidth: number;
  wrapperWidth!: number;
  scrollWidth: number;
  windowWidth: number;

  NavMobCollapse = output();

  // constructor
  constructor() {
    this.navigation = this.filterNavigationByRole(NavigationItems);
    this.windowWidth = window.innerWidth;
    this.scrollWidth = 0;
    this.contentWidth = 0;
  }

  // life cycle event
  ngOnInit() {
    if (this.windowWidth < 992) {
      setTimeout(() => {
        document.querySelector('.pcoded-navbar')?.classList.add('menupos-static');
        const navPs = document.querySelector('#nav-ps-gradient-able') as HTMLElement;
        if (navPs) {
          navPs.style.height = '100%';
        }
      }, 500);
    }
  }

  fireLeave() {
    const sections = document.querySelectorAll('.pcoded-hasmenu');
    for (let i = 0; i < sections.length; i++) {
      sections[i].classList.remove('active');
      sections[i].classList.remove('pcoded-trigger');
    }

    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent?.parentElement?.parentElement;
      const last_parent = up_parent?.parentElement;
      if (parent?.classList.contains('pcoded-hasmenu')) {
        parent.classList.add('active');
      } else if (up_parent?.classList.contains('pcoded-hasmenu')) {
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('pcoded-hasmenu')) {
        last_parent.classList.add('active');
      }
    }
  }

  navMob() {
    if (this.windowWidth < 992 && document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
      this.NavMobCollapse.emit();
    }
  }

  fireOutClick() {
    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent?.parentElement?.parentElement;
      const last_parent = up_parent?.parentElement;
      if (parent?.classList.contains('pcoded-hasmenu')) {
        parent.classList.add('pcoded-trigger');
        parent.classList.add('active');
      } else if (up_parent?.classList.contains('pcoded-hasmenu')) {
        up_parent.classList.add('pcoded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('pcoded-hasmenu')) {
        last_parent.classList.add('pcoded-trigger');
        last_parent.classList.add('active');
      }
    }
  }

  /**
   * Filter navigation items based on user role
   * Only show menu items that the user's role is allowed to see
   */
  private filterNavigationByRole(items: NavigationItem[]): NavigationItem[] {
    const userRole = this.authService.getUserRole();

    if (!userRole) {
      return [];
    }

    return items
      .filter(item => {
        // If no roles are specified, show the item to everyone
        if (!item.roles || item.roles.length === 0) {
          return true;
        }
        // Show item only if user's role is in the allowed roles
        return item.roles.includes(userRole);
      })
      .map(item => {
        // Recursively filter children
        if (item.children && item.children.length > 0) {
          return {
            ...item,
            children: this.filterNavigationByRole(item.children)
          };
        }
        return item;
      });
  }
}
