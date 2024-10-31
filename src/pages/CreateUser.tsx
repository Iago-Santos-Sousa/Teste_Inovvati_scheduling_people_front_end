import { useState } from "react";
import { Link } from "react-router-dom";
import userCreate from "../assets/user-circle.svg";
import passwordIcon from "../assets/password-icon.svg";
import emailIcon from "../assets/email-icon.svg";
import eyeIcon from "../assets/eye-icon.svg";
import eyeClosed from "../assets/eye-closed.svg";
import backIcon from "../assets/back-icon.svg";
import name from "../assets/user-name-icon.svg";
import { usersApi } from "../integrations/users";
import { useForm } from "react-hook-form";
import { AxiosError, AxiosResponse } from "axios";

type Inputs = {
  password: string;
  confirm_password: string;
  name: string;
  email: string;
};

const CreateUser: React.FC = () => {
  const [loginError, setLoginError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>();

  const handleCreateUser = async (data: Inputs): Promise<void> => {
    setLoginError("");
    try {
      data.password = data.password ? data.password.trim() : "";
      data.confirm_password = data.confirm_password
        ? data.confirm_password.trim()
        : "";
      data.name = data.name ? data.name.trim() : "";
      data.email = data.email ? data.email.trim() : "";
      const result: AxiosResponse | null = await usersApi().createUser(data);
      // console.log(result);
    } catch (error: unknown | AxiosError) {
      console.log(error);
      if (error instanceof AxiosError) {
        if (error?.response?.status === 409) {
          setLoginError("Já existe um usuário com esse e-mail ou username!");
          setError("email", { type: "focus" }, { shouldFocus: true });
          setError("name", { type: "focus" }, { shouldFocus: true });
        } else {
          setLoginError("Não foi possível criar usuário!");
        }
      }
    }
  };

  return (
    <div className="wrapper min-h-screen py-12">
      <div className="login-page bg-white px-10 py-6 border rounded-lg mt-0 mx-auto max-w-[min(80%,450px)] relative">
        <div className="w-[50px] h-[50px] absolute top-4 left-4">
          <Link to={"/"}>
            <button className="">
              <img
                src={backIcon}
                alt="return-icon"
                className="w-full h-full "
              />
            </button>
          </Link>
        </div>
        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit(handleCreateUser)}
        >
          <div className="w-[100px] h-[100px] mx-auto">
            <img src={userCreate} alt="create-user" className="w-full h-full" />
          </div>

          <div className="w-full">
            <label htmlFor="name" className="text-sm text-spanTwoColor w-full">
              User name
            </label>
            <div className="relative w-full mb-2">
              <input
                type="text"
                placeholder="name"
                id="name"
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-prymaryPurple invalid:outline-red-500 aria-required:outline-red-500"
                {...register("name", {
                  required: "Enter your name",
                })}
                aria-required={errors?.name ? true : false}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <img src={name} alt="" width={20} height={20} />
              </div>
            </div>
            {errors?.name && (
              <span className="text-sm text-red-500">
                {errors?.name?.message}
              </span>
            )}
          </div>

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
                aria-required={errors.email ? true : false}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <img src={emailIcon} alt="" width={20} height={20} />
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

          <div className="w-full">
            <label
              htmlFor="confirm_password"
              className="text-sm text-spanTwoColor w-full"
            >
              Confirm password
            </label>
            <div className="relative w-full mb-2">
              <input
                type={`${!confirmShowPassword ? "password" : "text"}`}
                placeholder="confirm password"
                id="confirm_password"
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-prymaryPurple invalid:outline-red-500 aria-required:outline-red-500"
                {...register("confirm_password", {
                  required: "Confirm your password",
                })}
                aria-required={errors?.confirm_password ? true : false}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <img src={passwordIcon} alt="" width={20} height={20} />
              </div>
              <span
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => {
                  setConfirmShowPassword((prev) => !prev);
                }}
              >
                <img
                  src={!confirmShowPassword ? eyeIcon : eyeClosed}
                  alt=""
                  width={20}
                  height={20}
                />
              </span>
            </div>
            {errors?.confirm_password && (
              <span className="text-sm text-red-500">
                {errors?.confirm_password?.message}
              </span>
            )}
          </div>

          <div className="text-center text-white">
            <button
              className="bg-prymaryBlue text-white text-base w-full rounded-full py-3 opacity-70 hover:opacity-100"
              type="submit"
            >
              CRIAR
            </button>
          </div>

          <div>
            {loginError && (
              <p className="text-sm text-red-500 text-center">{loginError}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
