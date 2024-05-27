import React from 'react';
import ReactDOM from 'react-dom/client';
import dotenv from 'dotenv';
import App from './root';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { CookiesProvider } from 'react-cookie';
// dotenv.config();
const client = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <RecoilRoot>
            <QueryClientProvider client={client}>
                <CookiesProvider>
                    <RouterProvider router={router}></RouterProvider>
                </CookiesProvider>
            </QueryClientProvider>
        </RecoilRoot>
    </React.StrictMode>
);
