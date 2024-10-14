import { Html, Head, Main, NextScript } from 'next/document';
import Header from '@/components/header/Header';

export default function Document() {
  return (
    <Html lang="ko">
      <Head />
      <body>
        <Header />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
