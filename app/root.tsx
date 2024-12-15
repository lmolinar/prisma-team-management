import "react-toastify/dist/ReactToastify.css";

import { LinksFunction } from "@remix-run/node";
import { Link, Links, Meta, MetaFunction, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import fonts from "inter-ui/inter.css?url";
import { ToastContainer } from "react-toastify";

import appStylesHref from "./app.css?url";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: fonts },
    { rel: "stylesheet", href: appStylesHref },
    {
        rel: "icon",
        href: "/favicon-32x32.png",
    },
];

export const meta: MetaFunction = () => [{ title: "Team Management - Prisma" }];

export default function App() {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                <ToastContainer />
                <header className="header">
                    <Link to="/" style={{ display: "flex", height: 40 }}>
                        <img src="/prisma.svg" alt="Prisma logo" />
                    </Link>
                    <h1>Team Management - Prisma</h1>
                </header>
                <div id="rootContent">
                    <Outlet />
                </div>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}
