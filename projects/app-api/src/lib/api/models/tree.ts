export interface Tree {
  key?: string;
  title?: string;
  isLeaf?: boolean;
  children?: Tree[];
}
