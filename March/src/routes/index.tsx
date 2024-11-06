import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginRoute } from "./auth/login";
import { RegisterRoute } from "./auth/register";
import { CategoryRoute } from "./base/admin/category";
import { ComplainAdminRoute } from "./base/admin/complain";
import { EditCategoryRoute } from "./base/admin/edit.category";
import { EditProductRoute } from "./base/admin/edit.product";
import { ProductRoute } from "./base/admin/product";
import { ComplainUserRoute } from "./base/complain";
import { DetailRoute } from "./base/detail";
import { HomeRoute } from "./base/home";
import { ProfileRoute } from "./base/profile";
import { ProtectedRoute } from "../guards/Protected.Route";
import { AddCategoryRoute } from "./base/admin/add.category";
import { AddProductRoute } from "./base/admin/add.product";
import { CartRoute } from "./base/cart";
import { CheckoutRoute } from "./base/checkout";
import { DashboardRoute } from "./base/admin/dashboard";
import { CallbackRoute } from "./base/callback";


export function AppRouter() {
    const router = createBrowserRouter([
        {
            path: "/register",
            element: <RegisterRoute />
        },
        {
            path: "/login",
            element: <LoginRoute />
        },
        {
            path: "/",
            element: (
                <HomeRoute />
            )
        },
        {
            path: "/detail/:id",
            element: (
                <DetailRoute />
            )
        },
        {
            path: "/profile",
            element: (
                <ProfileRoute />
            )
        },
        {
            path: "/category",
            element: (

                <CategoryRoute />
            )
        },
        {
            path: "/product",
            element: (

                <ProductRoute />
            )
        },
        {
            path: "/complain-U",
            element: (
                <ComplainUserRoute />
            )
        },
        {
            path: "/complain-A",
            element: (

                <ComplainAdminRoute />
            )
        },
        {
            path: "/edit-product/:id",
            element: (

                <EditProductRoute />
            )
        },
        {
            path: "/edit-category/:id",
            element: (

                <EditCategoryRoute />
            )
        },
        {
            path: "/add-category",
            element: (

                <AddCategoryRoute />
            )
        },
        {
            path: "/cart",
            element: (

                <CartRoute />
            )
        },
        {
            path: "/checkout",
            element: (

                <CheckoutRoute />
            )
        },
        {
            path: "/dashboard",
            element: (

                <DashboardRoute />
            )
        },
        {
            path: "/payment/callback",
            element: (

                <CallbackRoute />
            )
        },



    ])

    return <RouterProvider router={router} />
}