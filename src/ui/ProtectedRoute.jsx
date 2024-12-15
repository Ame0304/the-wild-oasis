import { useNavigate } from "react-router-dom";
import { useUser } from "../features/authentication/useUser";
import { useEffect } from "react";
import Spinner from "./Spinner";
import styled from "styled-components";

const FullPage = styled.div`
  height: 100vh;
  background-attachment: var(--color-grey-50);
  display: flex;
  justify-content: center;
  align-items: center;
`;

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  // 1. Load the authenticated user
  const { user, isLoading, isAuthenticated, isFetching } = useUser();

  //2. If there is NO authenticated user, redirect to the /login page
  useEffect(
    function () {
      if (!isAuthenticated && !isLoading && !isFetching) navigate("/login");
    },
    [isAuthenticated, navigate, isLoading, isFetching]
  );

  //3. While loading, show a loading indicator
  if (isLoading)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  //4. If there IS an authenticated user, render the app
  if (isAuthenticated) return children;
}

export default ProtectedRoute;
