export interface Menu {
  title: string;
  icon: string;
  open?: boolean;
  link?: string;
  children?: Menu[];
}
