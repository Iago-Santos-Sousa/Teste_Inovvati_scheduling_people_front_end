import {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from "react";

interface UserInfos {
  email: string;
  name: string;
  userId: number;
}

const userInformations: UserInfos = {
  email: "",
  name: "",
  userId: 0,
};

interface authContextValueType {
  acessToken: string;
  user: UserInfos;
  signIn: (user: UserInfos, newAcessToken: string) => Promise<void>;
  signOut: () => void;
  isLoggedin: boolean;
  handleLoggedin: (loggedin: boolean) => void;
}

type AuthProviderProps = PropsWithChildren;

// Crie o contexto global da aplicação
const AppContext = createContext<authContextValueType | null>(null);

export const AppProvider = ({ children }: AuthProviderProps) => {
  const [acessToken, setAcessToken] = useState<string>("");
  const [isLoggedin, setIsLoggedin] = useState<boolean>(false);
  const [user, setUser] = useState<UserInfos>(userInformations);
  const handleLoggedin = (loggedin: boolean): void => {
    setIsLoggedin(loggedin);
  };

  // Quando recarregar a aplicação inteira, irá executar essa função
  const validateSession = async (): Promise<void> => {
    console.log("validateSession is running");
    const sessionToken = sessionStorage.getItem("user.acessToken");
    const sessionUser = sessionStorage.getItem("user.user");

    if (sessionToken && sessionUser) {
      const sessionUserParsed: UserInfos = JSON.parse(sessionUser);
      setAcessToken(sessionToken);
      setUser(sessionUserParsed);
      setIsLoggedin(true);
    }
  };

  // Função para realizar login
  const signIn = async (
    user: UserInfos,
    newAcessToken: string,
  ): Promise<void> => {
    console.log("sigIn is running");
    setAcessToken(newAcessToken);
    setUser(user);
    setIsLoggedin(true);
    sessionStorage.setItem("user.acessToken", newAcessToken);
    sessionStorage.setItem("user.user", JSON.stringify(user));
  };

  const signOut = (): void => {
    setAcessToken("");
    setUser(userInformations);
    setIsLoggedin(false);
    sessionStorage.clear();
  };

  useEffect(() => {
    (async () => {
      await validateSession();
    })();
  }, []);

  const authContextValue: authContextValueType = {
    acessToken,
    user,
    signIn,
    signOut,
    isLoggedin,
    handleLoggedin,
  };

  // Objeto com os dados que será fornecido pelo contexto
  return (
    <AppContext.Provider value={authContextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Função para usar o contexto de autenticação em outros componentes de forma global
export const useLogin = (): authContextValueType => {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("useTodoContext must be used inside the TodoProvider!");
  }

  const { acessToken, user, signIn, signOut, isLoggedin, handleLoggedin } =
    appContext;

  return {
    acessToken,
    user,
    signIn,
    signOut,
    isLoggedin,
    handleLoggedin,
  };
};
