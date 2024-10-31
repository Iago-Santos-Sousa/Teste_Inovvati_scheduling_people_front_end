import { useLogin } from "../contexts/AppContext";
import agenda from "../assets/agenda.svg";
import { useNavigate, NavigateFunction, Link } from "react-router-dom";

const Header = () => {
  const signOut = useLogin().signOut;
  const navigate: NavigateFunction = useNavigate();

  return (
    <header className="w-full bg-prymaryBlue py-4 flex justify-between items-center px-8">
      <div className="logo-img w-[80px] h-[80px]">
        <img src={agenda} alt="user-logo" className="w-full h-full" />
      </div>

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
