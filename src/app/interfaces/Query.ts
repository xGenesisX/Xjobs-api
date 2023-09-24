export interface Query {
  approvedForMenu: boolean;
  isAwarded: boolean;
  category?: {
    value: string[]; // Assuming 'value' is an array of strings, adjust the type accordingly
  };
}
