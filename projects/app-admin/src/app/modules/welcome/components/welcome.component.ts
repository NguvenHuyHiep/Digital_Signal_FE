import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT, PlatformLocation } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconService } from 'ng-zorro-antd/icon';
import {
  Menu,
  NotificationModel,
} from '../../../../../../app-common/src/lib/modules/common-module';
import { MessageModel } from '../../../../../../app-common/src/lib/modules/common-module/models/message-model';
import { WaterMarkService } from '../../../../../../app-common/src/lib/modules/watermark/water-mark.service';
import { TaskModel } from '../../../../../../app-common/src/lib/modules/common-module/models/task-model';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { LhAuthenService } from '../../../../../../app-api/src/lib/modules/authen/lh-authen.service';
import { Store } from '@ngrx/store';
import { SIGN_OUT } from '../../../../../../app-api/src/lib/modules/authen/store/authen.reducers';
import { MenuService } from 'ng-zorro-antd/menu';
import { LhLanguageService } from '../../../../../../app-api/src/lib/modules/language/lh-language.service';
import { BaseOutputUser } from '../../../../../../app-api/src/lib/api/models/baseOutputUser';
import { User } from '../../../../../../app-api/src/lib/api/models/user';

const number10IconLiteral =
  '<svg t="1614656301570" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="667" width="24" height="24"><path d="M613.449901 887.558133l-57.825944 68.909933-17.418983-24.519976c-8.785991-13.791987-14.199986-27.583973-15.119985-41.37696-0.307-4.596996 0.409-10.72699 0.153-15.272985l20.17798-300.262707 48.169953-59.766941 42.347959 59.766941-20.48398 312.522695z m28.452972-434.967575l-50.264951 62.831939-40.30396-62.831939 16.754983-266.49674c2.195998-18.389982 2.655997-29.116972 3.370997-35.246965 1.379999-13.741987 6.333994-24.519976 15.835984-35.195966l30.444971-36.728964 43.929957 67.377934-19.767981 306.290701zM850.879669 901.40112l48.885952 73.507928-25.182975 30.69997c-10.42099 13.740987-22.578978 18.389982-44.084957 18.389982H631.277884c-21.505979 0-34.327966-6.129994-43.062958-18.389982l-20.125981-30.69997 60.889941-73.507928H850.879669zM678.426837 124.845878L631.174884 58.999942l21.812978-30.69997C666.524849 9.90999 679.601836 2.247998 696.55982 2.247998h207.139797c15.834985 0 31.261969 10.72699 41.32496 26.051974l17.725983 29.116972-59.050943 67.377934H678.426837z m211.379794 450.23956l50.315951-61.24694 40.200961 61.24794-16.805984 265.015742c-0.969999 19.921981-2.451998 32.181969-2.144998 36.779964-1.379999 13.739987-6.436994 22.934978-16.959983 35.194965l-32.794968 35.195966-41.32496-61.24794 19.512981-310.939697z m28.859972-428.836581l58.898942-68.909933 13.842987 21.45498c10.06399 15.323985 15.477985 29.116972 16.448984 44.389956 0.409 6.129994 0.816999 12.259988 0.051 18.389982l-18.542982 291.016716-51.49095 61.29994-39.077962-61.29994 19.869981-306.341701z m-699.931317-25.182975l-36.779964-54.147947L225.58028 0h139.914863l-84.898917 121.065882h-61.85994z m24.468976 445.949564l53.993948-56.189945 47.149954 56.189945-29.321972 394.356615-55.219946 60.276941-45.923955-60.78794 29.321971-393.845616z m31.05797-422.962587L383.885125 24.519976l-31.00697 421.429589-55.679945 64.874936-45.054956-65.385936 22.118978-301.385706z" p-id="668"></path></svg>';
const number11IconLiteral =
  '<svg t="1614656323150" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="866" width="24" height="24"><path d="M218.0608 121.344l-36.864-54.272L224.9216 0h140.2368L280.064 121.344H218.0608z m24.5248 446.976l54.1184-56.32 47.2576 56.32-29.3888 395.264L259.2256 1024l-46.0288-60.928 29.3888-394.752z m31.1296-423.936L383.5904 24.576l-31.0784 422.4-55.808 65.024-45.1584-65.536 22.1696-302.08zM703.3344 121.344l-36.864-54.272L710.1952 0h140.2368l-85.0944 121.344h-62.0032z m24.5248 446.976l54.1184-56.32 47.2576 56.32-29.3888 395.264L744.448 1024l-46.0288-60.928 29.44-394.752z m31.0784-423.936l109.8752-119.808-31.0784 422.4-55.808 65.024-45.1584-65.536 22.1696-302.08z" p-id="867"></path></svg>';
const number12IconLiteral =
  '<svg t="1626878213138" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2864" width="200" height="200"><path d="M218.075496 121.337933l-36.862157-54.269286L224.935953 0h140.229789L280.075596 121.337933H218.075496z m24.523574 446.953652l54.115694-56.317184 47.255237 56.317184-29.38733 395.244238L259.238238 1023.948803l-46.026499-60.924954 29.387331-394.732264z m31.128044-423.914804L383.59682 24.574771l-31.076846 422.378881-55.80521 65.020749-45.156142-65.532723 22.168492-302.064897zM615.623619 885.715714l-97.275136 118.266087 23.858007-365.344933c0.563172-9.215539 1.126344-18.431078 2.867056-26.110694 1.79191-7.679616 3.635018-13.772111 6.706865-18.431079 0 0 6.297285-7.679616 16.639168-21.502925l30.155292-39.882805 37.271737 53.706114-20.222989 299.300235z m254.707264 15.41043l41.21394 61.436928-49.047148 61.436928h-331.60582l101.524524-122.822659 237.914504-0.051197z m24.984351-348.500975c-12.440978 16.895155-22.322084 21.502925-48.227988 21.502925h-193.987101l-41.060347-59.901005 32.100795-44.490576c4.146993-6.143693 9.471526-10.751462 14.898455-13.823309 5.426929-3.020649 9.829909-4.60777 15.461627-4.607769h213.186141l41.060347 59.901005-33.431929 41.418729zM669.176141 122.822659l-41.060347-59.901005L675.934203 0h230.081296c22.526874 0 33.227139 7.679616 45.770512 27.646618l15.103245 24.574771-57.494726 70.60127H669.176141z m251.686616 19.915804l58.621069-70.60127 20.018199 30.718464c2.457477 3.071846 5.222139 10.751462 8.140393 21.502925 1.433528 4.60777 1.740713 9.266737 1.9967 13.823309 0.40958 6.143693-0.051197 16.895155-0.307185 30.718464l-15.871206 227.163042c-1.638318 27.646618-5.426929 38.39808-19.915804 58.313884l-31.281636 39.934003-40.957952-58.313884 19.557422-293.258937z" p-id="2865"></path></svg>';

@Component({
  selector: 'lh-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit, AfterViewInit {
  isCollapsed = false;
  menuList: Menu[] = [];
  showSearch = false;
  searchOptions: string[] = [];
  inputValue = '';
  noticeList: NotificationModel[] = [];
  messageList: MessageModel[] = [];
  taskList: TaskModel[] = [];
  name = 'Translation';
  bellInfo = {
    total: 11,
    notice: 4,
    message: 3,
    task: 4,
  };

  locale: string = '';

  messenger = {};
  visible = false;
  navigationInfo = {
    header: true,
    menu: true,
  };
  contentList: { type: string; name: string }[] = [
    { type: 'header', name: 'Header' },
    { type: 'footer', name: 'Footer' },
    { type: 'menu', name: 'Menu' },
    { type: 'menuHeader', name: 'Menu header' },
  ];
  drawerInfo: {
    content: {
      [index: string]: boolean;
    };
  } = {
    content: {
      header: true,
      footer: true,
      menu: true,
      menuHeader: true,
    },
  };
  siteStyle = 'menuDark';
  doc: Document;
  contentDom: Element | null = null;
  user?: User;
  isLogin: boolean = false;
  selectLanguage: string = 'en';

  supportLangs = [
    { label: 'English', value: 'en', img: '' },
    { label: 'Tieng Viet', value: 'vi', img: '' },
  ];

  constructor(
    private platformLocation: PlatformLocation,
    private router: Router,
    private message: NzMessageService,
    private iconService: NzIconService,
    private waterMarkService: WaterMarkService,
    private authenService: LhAuthenService,
    private translateService: TranslateService,
    private languageService: LhLanguageService,
    private store: Store,
    @Inject(DOCUMENT) doc: any
  ) {
    this.iconService.addIconLiteral('number:10', number10IconLiteral);
    this.iconService.addIconLiteral('number:11', number11IconLiteral);
    this.iconService.addIconLiteral('number:12', number12IconLiteral);
    this.doc = doc;
  }

  public get getCurrentLangObj(): any {
    return this.supportLangs.find((f) => f.value === this.selectLanguage);
  }

  ngAfterViewInit() {
    this.contentDom = this.doc.querySelector('html');
  }

  ngOnInit(): void {
    this.selectLanguage = this.languageService.currentLang;
    this.supportLangs = this.languageService.supportLangs;
    setTimeout(() => {
      this.translateService
        .get(environment.WATER_MARK)
        .subscribe((translated: string) => {
          this.waterMarkService.updateWatermark.next(
            this.translateService.instant(environment.WATER_MARK)
          );
        });
    }, 100);

    this.authenService.userObs.subscribe((user) => {
      this.user = user;
      this.buildMenu();
    });
    this.buildMenu();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        // @ts-ignore
        this.contentDom.scrollTop = 0;
      });

    const siteStyle = localStorage.getItem('site-style');
    if (siteStyle) {
      this.siteStyle = siteStyle;
    }
    this.changeStyle(this.siteStyle);
  }

  updateLocale(locale: string) {
    this.selectLanguage = locale;
    this.languageService.updateLocale(locale);
  }

  changeCollapsed() {
    this.isCollapsed = !this.isCollapsed;
    this.waterMarkService.changeLayout();
  }

  search() {
    this.showSearch = true;
  }

  inputBlur() {
    this.showSearch = false;
  }

  goUrl(url: string) {
    this.router.navigate([url]);
  }

  logout() {
    this.store.dispatch(SIGN_OUT());
    window.location.reload();
  }

  login() {
    this.router.navigateByUrl('/login');
  }

  read(item: MessageModel | TaskModel | NotificationModel) {
    item.read = true;
    this.getBellInfo();
  }

  readAll(type: string) {
    if (type === 'notice') {
      this.noticeList = [];
    } else if (type === 'message') {
      this.messageList = [];
    } else {
      this.taskList = [];
    }
    this.getBellInfo();
  }

  getBellInfo() {
    const noticeLength = this.noticeList.filter((i) => !i.read).length;
    const messageLength = this.messageList.filter((i) => !i.read).length;
    const taskLength = this.taskList.filter((i) => !i.read).length;
    this.bellInfo = {
      total: noticeLength + messageLength + taskLength,
      notice: noticeLength,
      message: messageLength,
      task: taskLength,
    };
  }

  readMore(type: string) {
    this.message.success('Click on view more');
  }

  close() {
    this.visible = false;
  }

  changeDrawer() {
    this.visible = !this.visible;
  }

  changeContent(type: string) {
    if (type === 'menu') {
      const e = document.createEvent('Event');
      e.initEvent('resize', true, true);
      window.dispatchEvent(e);
    }
  }

  changeStyle(value: string) {
    this.siteStyle = value;
    localStorage.setItem('site-style', this.siteStyle);
    if (value === 'dark') {
      this.changeTheme('dark');
    } else {
      this.changeTheme('default');
    }
  }

  changeTheme(theme: 'default' | 'dark'): void {
    if (theme === 'dark') {
      const loading = this.message.loading('Loading', { nzDuration: 0 });
      const style = document.createElement('link');
      style.type = 'text/css';
      style.rel = 'stylesheet';
      style.id = 'dark-theme';
      style.href = 'assets/themes/style.dark.css';
      document.body.appendChild(style);
      setTimeout(() => {
        this.message.remove(loading.messageId);
      }, 1500);
    } else {
      const dom = document.getElementById('dark-theme');
      if (dom) {
        dom.remove();
      }
    }
  }

  public buildMenu(): void {
    this.menuList = this.user
      ? [
          {
            title: 'Dashboard',
            icon: 'bar-chart',
            link: '/dashboard',
          },
          { title: 'User', icon: 'user', link: '/user' },
          {
            title: 'Playlist',
            icon: 'play-circle',
            link: '/playlist',
          },
          { title: 'Group Device', icon: 'apartment', link: '/device-group' },
          { title: 'Device', icon: 'video-camera-add', link: '/device' },
          { title: 'File', icon: 'user', link: '/file' },
          { title: 'Schedule', icon: 'user', link: '/schedule' },
        ]
      : [
          {
            title: 'Search',
            icon: 'search',
            link: '/',
          },
        ];
  }
}
