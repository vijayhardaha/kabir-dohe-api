import { ITag } from "./tag";

/**
 * Interface representing a couplet.
 */
export interface ICouplet {
  id?: string | number;
  couplet_hindi?: string;
  couplet_english?: string;
  translation_hindi?: string;
  translation_english?: string;
  explanation_hindi?: string;
  explanation_english?: string;
  tags?: ITag[];
  popular?: boolean;
  [key: string]: any;
}
