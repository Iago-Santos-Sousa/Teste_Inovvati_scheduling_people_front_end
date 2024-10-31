import { useLogin } from "../contexts/AppContext";
import agenda from "../assets/agenda.svg";
import {
  useNavigate,
  NavigateFunction,
  useLocation,
  Location,
  Link,
} from "react-router-dom";
const handleHeaderTitle = (pathName: string) => {
  let component: JSX.Element | null = null;

  if (pathName.includes("create-user")) {
    component = (
      <div className="w-full">
        <p className="text-white font-semibold text-xl text-center">
          Listar agendamentos
        </p>
      </div>
    );

    return component;
  }

  if (pathName.includes("add-schedule")) {
    component = (
      <div className="w-full">
        <p className="text-white font-semibold text-xl text-center">
          Criar agendamento
        </p>
      </div>
    );

    return component;
  }

  if (pathName.includes("panel/")) {
    component = (
      <div className="w-full">
        <p className="text-white font-semibold text-xl text-center">
          Atualizar agendamento
        </p>
      </div>
    );

    return component;
  }

  component = (
    <div className="w-full">
      <p className="text-white font-semibold text-xl text-center">
        Listar agendamentos
      </p>
    </div>
  );

  return component;
};

const Header = () => {
  const signOut = useLogin().signOut;
  const navigate: NavigateFunction = useNavigate();
  const location: Location = useLocation();

  return (
    <header className="w-full bg-prymaryBlue py-4 flex justify-between items-center px-8">
      <div className="logo-img w-[80px] h-[80px]">
        <img src={agenda} alt="user-logo" className="w-full h-full" />
      </div>
      {handleHeaderTitle(location.pathname)}
      <nav className="navbar">
        <div>
          <ul className="flex gap-6 text-white">
            <li className="">
              <Link to={"/panel"}>Home</Link>
            </li>
            <li
              className=""
              onClick={() => {
                signOut();
                navigate("/", { replace: true });
              }}
            >
              <a href="">Sair</a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
