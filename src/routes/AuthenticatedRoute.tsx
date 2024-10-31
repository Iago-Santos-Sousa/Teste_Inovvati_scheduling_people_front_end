import { useEffect, PropsWithChildren } from "react";
import { useLogin } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import FullPageLoading from "../components/FullPageLoading";

const AuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const acessToken = useLogin().acessToken;
  const navigate = useNavigate();

  useEffect(() => {
    const sessionToken = sessionStorage.getItem("user.acessToken");
    const sessionUser = sessionStorage.getItem("user.user");

    if (!sessionToken || !sessionUser) {
      sessionStorage.clear();
      return navigate("/", { replace: true });
    }
  }, []);

  if (!acessToken) {
    return <FullPageLoading />;
  } else {
    return children;
  }
};

export default AuthenticatedRoute;
