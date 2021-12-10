import { extendTheme } from '@chakra-ui/react'

const colors = {
  
}

const styles = {
  global: {
    'html, body': {
      width: '100vw',
      height: '100vh',
      margin: '0',
      fontFamily: 'Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue"',
    }
  }
}

export const theme = extendTheme({
  colors,
  styles,
})