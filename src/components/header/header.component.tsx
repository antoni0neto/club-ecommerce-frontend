import { signOut } from "firebase/auth";
import { BsCart3 } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

// Styles
import {
    HeaderContainer,
    HeaderItem,
    HeaderItems,
    HeaderTitle,
} from "./header.styles";

// Utilities
import { auth } from "../../config/firebase.config";
import { UserContext } from "../../contexts/user.context";
import { CartContext } from "../../contexts/cart.context";
import { useContext } from "react";

const Header = () => {
    const navigate = useNavigate();

    const { isAuthenticated } = useContext(UserContext);
    const { productsCount, toggleCart } = useContext(CartContext);

    const handleHomeClick = () => {
        navigate("/");
    };

    const handleExploreClick = () => {
        navigate("/explore");
    };

    const handleLoginClick = () => {
        navigate("/login");
    };

    const handleSignUpClick = () => {
        navigate("/sign-up");
    };

    return (
        <HeaderContainer>
            <HeaderTitle
                style={{ cursor: "pointer" }}
                onClick={handleHomeClick}
            >
                CLUB CLOTHING
            </HeaderTitle>

            <HeaderItems>
                <HeaderItem onClick={handleExploreClick}>Explorar</HeaderItem>
                {!isAuthenticated && (
                    <>
                        <HeaderItem onClick={handleLoginClick}>
                            Login
                        </HeaderItem>
                        <HeaderItem onClick={handleSignUpClick}>
                            Criar Conta
                        </HeaderItem>
                    </>
                )}

                {isAuthenticated && (
                    <HeaderItem onClick={() => signOut(auth)}>Sair</HeaderItem>
                )}

                <HeaderItem onClick={toggleCart}>
                    <BsCart3 size={25} />
                    <p style={{ marginLeft: 5 }}>{productsCount}</p>
                </HeaderItem>
            </HeaderItems>
        </HeaderContainer>
    );
};

export default Header;
