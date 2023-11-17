import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { BreadcrumbOption } from 'ng-zorro-antd/breadcrumb/breadcrumb.component';

const ROUTE_LABELS: { [key: string]: string } = {
  // "course": "module.course.title",
  // "dashboard": "module.dashboard.title"
};

@Component({
  selector: 'lh-common-page',
  templateUrl: './lh-common-page.component.html',
  styleUrls: ['./lh-common-page.component.scss'],
})
export class LhPageComponent {
  @Input() pageTitle: string = '';
  breadcrumbs: BreadcrumbOption[];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
  }

  private buildBreadCrumb(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: BreadcrumbOption[] = []
  ): BreadcrumbOption[] {
    let path: string = route.snapshot.url
      .map((s: UrlSegment) => s.path)
      .join('/');
    let label: string =
      route.routeConfig &&
      route.routeConfig.data &&
      route.routeConfig.data['label']
        ? route.routeConfig.data['label']
        : ROUTE_LABELS[path]
        ? ROUTE_LABELS[path]
        : path
        ? '...'
        : 'Digital Signage';

    if (path == '' && breadcrumbs.length > 0) {
      return route.firstChild
        ? this.buildBreadCrumb(route.firstChild, path, breadcrumbs)
        : breadcrumbs;
    }

    const breadcrumb: BreadcrumbOption = {
      label: label,
      url: `${url}/${path}`,
      params: {},
    };

    const newBreadcrumbs = [...breadcrumbs, breadcrumb];
    if (route.firstChild) {
      return this.buildBreadCrumb(
        route.firstChild,
        breadcrumb.url,
        newBreadcrumbs
      );
    }
    return newBreadcrumbs;
  }
}
