import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import backIcon from "../assets/back-icon.svg";
import { useForm } from "react-hook-form";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AxiosError, AxiosResponse } from "axios";
import { schedulesApi } from "../integrations/schedule";
import { useNavigate, NavigateFunction, Link } from "react-router-dom";

type Inputs = {
  person_name: string;
  location: string;
};

type DataRequest = {
  person_name: string;
  location: string;
  scheduling_date: string;
};

const CreateSchedule = () => {
  const navigate: NavigateFunction = useNavigate();
  const [dateInput, setDateInput] = useState<Dayjs | null>(dayjs(new Date()));
  const [errorSchedule, setErrorSchedule] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const handleCreateSchedule = async (data: Inputs): Promise<void> => {
    setErrorSchedule("");

    try {
      const formatedDate: string = dayjs(dateInput).format(
        "DD/MM/YYYY HH:mm:ss",
      );

      const dataObj: DataRequest = {
        person_name: data.person_name.trim(),
        location: data.location.trim(),
        scheduling_date: formatedDate,
      };

      const response: AxiosResponse = await schedulesApi().createShedule(
        dataObj,
      );
      // console.log(response);
      navigate("/panel");
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError) {
        if (error?.response?.status === 409) {
          setErrorSchedule("Já existe um agendamento com essa data e local!");
        } else {
          setErrorSchedule("Não foi possível criar o agendamento!");
        }
      }
    }
  };

  return (
    <>
      <div className="w-[50px] h-[50px] absolute top-10 left-10">
        <Link to={"/panel"}>
          <button className="">
            <img src={backIcon} alt="return-icon" className="w-full h-full " />
          </button>
        </Link>
      </div>
      <div className="login-page bg-white px-10 py-6 border rounded-lg mt-0 mx-auto max-w-[min(80%,450px)] relative">
        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit(handleCreateSchedule)}
          id="submitForm"
        >
          <div className="w-full">
            <label
              htmlFor="person_name"
              className="text-sm text-spanTwoColor w-full"
            >
              Nome da pessoa
            </label>
            <div className="relative w-full mb-2">
              <input
                type="text"
                placeholder="Nome da pessoa"
                id="person_name"
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-prymaryPurple invalid:outline-red-500 aria-required:outline-red-500"
                {...register("person_name", {
                  required: "Digite um nome!",
                })}
                aria-required={errors?.person_name ? true : false}
              />
            </div>
            {errors?.person_name && (
              <span className="text-sm text-red-500">
                {errors?.person_name?.message}
              </span>
            )}
          </div>

          <div className="w-full">
            <label
              htmlFor="scheduling_date"
              className="text-sm text-spanTwoColor w-full"
            >
              Data e hora
            </label>
            <div className="relative w-full mb-2">
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="en"
              >
                <DemoContainer components={["DateTimePicker"]}>
                  <DateTimePicker
                    label="Data e hora"
                    value={dateInput}
                    onChange={(newValue) => setDateInput(newValue)}
                    format="DD/MM/YYYY HH:mm" // Define o formato brasileiro
                    ampm={false} // Remove AM/PM e usa formato 24h
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
          </div>

          <div className="w-full">
            <label
              htmlFor="location"
              className="text-sm text-spanTwoColor w-full"
            >
              Localização
            </label>
            <div className="relative w-full mb-2">
              <input
                type="text"
                id="location"
                placeholder="Localização"
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-prymaryPurple invalid:outline-red-500 aria-required:outline-red-500"
                {...register("location", {
                  required: "Insira o local!",
                })}
                aria-required={errors?.location ? true : false}
              />
            </div>
            {errors?.location && (
              <span className="text-sm text-red-500">
                {errors?.location?.message}
              </span>
            )}
          </div>

          <div>
            {errorSchedule && (
              <p className="text-sm text-red-500 text-center">
                {errorSchedule}
              </p>
            )}
          </div>
        </form>
      </div>
      <div className="text-center text-white max-w-[250px] m-auto absolute inset-x-0 bottom-10">
        <button
          className="bg-prymaryBlue text-white text-base w-full rounded-full py-3 opacity-70 hover:opacity-100"
          form="submitForm"
          type="submit"
        >
          Salvar
        </button>
      </div>
    </>
  );
};

export default CreateSchedule;
