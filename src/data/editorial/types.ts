export interface RichBlock {
  kind: string;
  html?: string;
  text?: string;
  ordered?: boolean;
  items?: {html: string; text: string}[];
}
export interface Chapter { title: string; blocks: RichBlock[]; }
