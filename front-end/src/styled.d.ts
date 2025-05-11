import 'styled-components';
import { muiTheme } from './theme';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
    };
    muiTheme: typeof muiTheme;
  }
}