import { onAuthStateChanged } from "firebase/auth";
import { FunctionComponent, useContext, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";

// Components
import Loading from "./components/loading/loading.component";
import Cart from "./components/cart/cart.component";
import AuthenticationGuard from "./guards/authentication.guard";

// Pages
import HomePage from "./pages/home/home.page";
import ExplorePage from "./pages/explore/explore.page";
import LoginPage from "./pages/login/login.page";
import SignUpPage from "./pages/sign-up/sign-up.page";
import CategoryDetailsPage from "./pages/category-details/category-details.page";
import CheckoutPage from "./pages/checkout/checkout.page";
import PaymentConfirmationPage from "./pages/payment-confirmation/payment-confirmation.page";

// Utilities
import { UserContext } from "./contexts/user.context";
import { auth, db } from "./config/firebase.config";
import { userConverter } from "./converters/firestore.converters";

const App: FunctionComponent = () => {
    const [isInitializing, setIsInitializing] = useState(true);

    const { isAuthenticated, loginUser, logoutUser } = useContext(UserContext);

    onAuthStateChanged(auth, async (user) => {
        const isSigningOut = isAuthenticated && !user;

        if (isSigningOut) {
            logoutUser();
            return setIsInitializing(false);
        }

        const isSigningIn = !isAuthenticated && user;

        if (isSigningIn) {
            const querySnapshot = await getDocs(
                query(
                    collection(db, "users").withConverter(userConverter),
                    where("id", "==", user.uid)
                )
            );

            const userFromFirestore = querySnapshot.docs[0]?.data();

            loginUser(userFromFirestore);

            return setIsInitializing(false);
        }

        return setIsInitializing(false);
    });

    if (isInitializing) return <Loading />;

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/category/:id" element={<CategoryDetailsPage />} />

                <Route
                    path="/checkout"
                    element={
                        <AuthenticationGuard>
                            <CheckoutPage />
                        </AuthenticationGuard>
                    }
                />
                <Route
                    path="/payment-confirmation"
                    element={<PaymentConfirmationPage />}
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
            </Routes>

            <Cart />
        </BrowserRouter>
    );
};

export default App;
