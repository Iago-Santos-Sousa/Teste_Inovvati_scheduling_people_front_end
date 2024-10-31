import { useState } from "react";
import { useNavigate, NavigateFunction, Link } from "react-router-dom";
import userIcon from "../assets/user-icon.svg";
import eyeIcon from "../assets/eye-icon.svg";
import eyeClosed from "../assets/eye-closed.svg";
import passwordIcon from "../assets/password-icon.svg";
import { useLogin } from "../contexts/AppContext";
import { authApi } from "../integrations/auth";
import { useForm, SubmitHandler } from "react-hook-form";
import { AxiosError } from "axios";

type Inputs = {
  email: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const [loginError, setLoginError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>();

  const { signIn } = useLogin();
  const navigate: NavigateFunction = useNavigate();

  // fazer a lógica de chamar o login do backend e salvar os dados no contexto
  const handleSignIn: SubmitHandler<Inputs> = async (data): Promise<void> => {
    setLoginError("");
    try {
      data.email = data.email ? data.email.trim() : "";
      data.password = data.password ? data.password.trim() : "";
      const auth = await authApi().login(data);

      if (auth.user && auth.acessToken) {
        await signIn(auth.user, auth.acessToken);
        navigate("panel");
      }
    } catch (error: unknown | AxiosError) {
      console.error(error);
      if (error instanceof AxiosError) {
        if (
          error?.response?.status === 401 ||
          error?.response?.statusText === "Unauthorized"
        ) {
          setLoginError("e-mail ou senha estão incorretos!");
          setError("email", { type: "focus" }, { shouldFocus: true });
          setError("password", { type: "focus" }, { shouldFocus: true });
          return;
        }
      }

      setLoginError("Não foi possível realizar o login!");
      setError("email", { type: "focus" }, { shouldFocus: true });
      setError("password", { type: "focus" }, { shouldFocus: true });
    }
  };

  return (
    <div className="wrapper min-h-screen py-12">
      <div className="login-page bg-white px-10 py-6 border rounded-lg mt-0 mx-auto max-w-[min(80%,450px)]">
        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit(handleSignIn)}
        >
          <h1 className="text-center text-4xl font-bold">Login</h1>

          <div className="w-full">
            <label htmlFor="email" className="text-sm text-spanTwoColor w-full">
              Email
            </label>
            <div className="relative w-full mb-2">
              <input
                type="email"
                placeholder="email"
                id="email"
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-prymaryPurple invalid:outline-red-500 aria-required:outline-red-500"
                {...register("email", {
                  required: "Enter your email",
                })}
                aria-required={errors?.email ? true : false}
                autoComplete="email"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <img src={userIcon} alt="" width={20} height={20} />
              </div>
            </div>
            {errors?.email && (
              <span className="text-sm text-red-500">
                {errors?.email?.message}
              </span>
            )}
          </div>

          <div className="w-full">
            <label
              htmlFor="password"
              className="text-sm text-spanTwoColor w-full"
            >
              Password
            </label>
            <div className="relative w-full mb-2">
              <input
                type={`${!showPassword ? "password" : "text"}`}
                placeholder="password"
                id="password"
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-prymaryPurple invalid:outline-red-500 aria-required:outline-red-500"
                {...register("password", {
                  required: "Enter your password",
                })}
                autoComplete="current-password"
                aria-required={errors?.password ? true : false}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <img src={passwordIcon} alt="" width={20} height={20} />
              </div>
              <span
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => {
                  setShowPassword((prev) => !prev);
                }}
              >
                <img
                  src={!showPassword ? eyeIcon : eyeClosed}
                  alt=""
                  width={20}
                  height={20}
                />
              </span>
            </div>
            {errors?.password && (
              <span className="text-sm text-red-500">
                {errors?.password?.message}
              </span>
            )}
          </div>

          <div>
            {loginError && (
              <p className="text-sm text-red-500 text-center">{loginError}</p>
            )}
          </div>

          <div className="text-center text-white">
            <button
              className="bg-prymaryBlue text-white text-base w-full rounded-full py-3 opacity-70 hover:opacity-100"
              type="submit"
            >
              LOGIN
            </button>
          </div>

          <div className="text-center text-sm text-spanTwoColor transition-all">
            <Link to={"/create-user"}>
              <button
                className="text-base w-full rounded-full py-3 opacity-70 hover:bg-prymaryBlue hover:text-white"
                type="submit"
              >
                CADASTRAR
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
