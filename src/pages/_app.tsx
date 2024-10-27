import '@/styles/globals.css';
import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Header from '@/components/header/Header';
import 'react-quill/dist/quill.snow.css';
import Script from 'next/script';
import { useRouter } from 'next/router';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const needsKakaoScript =
    router.pathname.startsWith('/activity') ||
    router.pathname.startsWith('/listItem');

  return (
    <QueryClientProvider client={queryClient}>
      {needsKakaoScript && (
        <>
          <Script
            src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_KEY}&libraries=services&autoload=false`}
            strategy="afterInteractive"
          />
          <Script
            src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
            strategy="afterInteractive"
          />
        </>
      )}
      <Header />
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default MyApp;
