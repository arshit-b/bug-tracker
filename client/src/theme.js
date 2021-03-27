import { createMuiTheme } from '@material-ui/core';

// export const appTheme = createMuiTheme({
//   palette: {
//     primary: {
//       light: '#98C1D9',
//       main: '#BF4342',
//       // dark: '#8C1C13',
//       contrastText: '#E7D7C1',
//     },
//     secondary: {
//       main: '#735751',
//     },
//   },
// });

export const appTheme = createMuiTheme({
  palette: {
    primary: {
      light: '#EDF2F4',
      main: '#8D99AE',
      dark: '#2B2D42',
      contrastText: '#D90429',
    },
    secondary: {
      main: '#dc143c',
    },
  },
  shape: {
    borderRadius: 2,
  },
});
