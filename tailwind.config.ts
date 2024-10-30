import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      sm: {
        min: '375px',
        max: '743px',
      },
      md: {
        min: '744px',
        max: '1919px',
      },
      lg: {
        min: '1920px',
      },
    },
    colors: {
      black: {
        DEFAULT: '#1B1B1B',
        nomad: '#112211',
      },
      gray: {
        '50': '#FAFAFA',
        '100': '#EEEEEE',
        '200': '#DDDDDD',
        '300': '#CBCBCF',
        '400': '#ADAEAE',
        '500': '#A4A4A4',
        '600': '#9A9A9A',
        '700': '#79747E',
        '800': '#4B494B',
        '900': '#333333',
      },
      green: {
        dark: '#0B3D2D',
        light: '#CEBDB5',
        bright: '#00C407',
      },
      red: {
        DEFAULT: '#FF472E',
        light1: '#FFC28A',
        light2: '#FFE4E0',
      },
      orange: {
        DEFAULT: '#FF7D1D',
        light: '#FFF4EB',
      },
      yellow: {
        DEFAULT: '#FFC230',
      },
      blue: {
        DEFAULT: '#0065FF',
        light1: '#82B4FF',
        light2: '#E3F3FF',
      },
      transparent: 'transparent',
      white: '#FFFFFF',
    },
    fontSize: {
      xs: ['12px', '18px'],
      sm: ['13px', '22px'],
      md: ['14px', '24px'],
      lg: ['16px', '26px'],
      '2lg': ['18px', '26px'],
      xl: ['20px', '32px'],
      '2xl': ['24px', '32px'],
      '3xl': ['32px', '42px'],
    },
    fontWeight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    extend: {
      keyframes: {
        show: {
          '0%, 49.99%': {
            opacity: '0',
            zIndex: '1',
          },
          '50%, 100%': {
            opacity: '1',
            zIndex: '5',
          },
        },
      },
      animation: {
        show: 'show 0.6s',
      },
      transitionDuration: {
        '600': '600ms',
      },
      boxShadow: {
        auth: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
      },
      zIndex: {
        '1': '1',
        '2': '2',
        '5': '5',
        '100': '100',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {},
    },
  },
  plugins: [animate],
};

export default config;
