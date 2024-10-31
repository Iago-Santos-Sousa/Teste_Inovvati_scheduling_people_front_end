import dayjs, { Dayjs } from "dayjs";
import { useState, useEffect } from "react";
import backIcon from "../assets/back-icon.svg";
import { useForm } from "react-hook-form";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AxiosError } from "axios";
import { schedulesApi } from "../integrations/schedule";
import { useParams, Link } from "react-router-dom";

type Inputs = {
  person_name: string;
  location: string;
};

interface DataRequestSchedule {
  scheduling_id?: number;
  person_name: string;
  location: string;
  scheduling_date: string;
}

interface ScheduleListType {
  scheduling_id?: number;
  registration_date?: string;
  person_name?: string;
  scheduling_date?: string;
  location?: string;
}

interface SchedulingParams {
  scheduling_id: string;
}

const EditSchedule = () => {
  const [dateInput, setDateInput] = useState<Dayjs | null>(dayjs(new Date()));
  const [errorSchedule, setErrorSchedule] = useState<string>("");
  const [emptySchedule, setEmptySchedule] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [schedulingData, setSchedulingData] = useState<ScheduleListType>(
    {} as ScheduleListType,
  );
  const { scheduling_id } = useParams<keyof SchedulingParams>();
  const schedulingIdNumber = scheduling_id
    ? parseInt(scheduling_id)
    : undefined;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();

  const handleUpdateSchedule = async (data: Inputs): Promise<void> => {
    try {
      setErrorSchedule("");
      setSuccess("");
      const formatedDate: string = dayjs(dateInput).format(
        "DD/MM/YYYY HH:mm:ss",
      );

      const dataObj: DataRequestSchedule = {
        scheduling_id: scheduling_id ? parseInt(scheduling_id) : undefined,
        person_name: data.person_name.trim(),
        location: data.location.trim(),
        scheduling_date: formatedDate,
      };

      if (scheduling_id) {
        const response = await schedulesApi().editSchedule(dataObj);
        // console.log(response);
        setSchedulingData(response[0]);
        setSuccess("Agendamento alterado.");
      }
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError) {
        if (error?.response?.status === 409) {
          setErrorSchedule("Já existe um agendamento com essa data e local!");
        } else {
          setErrorSchedule("Não foi possível atualizar o agendamento!");
        }
        setSchedulingData((prev) => ({ ...prev }));
        setValue("location", schedulingData.location || "");
        setValue("person_name", schedulingData.person_name || "");
      }
    }
  };

  useEffect(() => {
    if (schedulingIdNumber) {
      schedulesApi()
        .getAppointment(schedulingIdNumber)
        .then((response) => {
          // console.log(response);
          setSchedulingData(response[0]);
          setDateInput(dayjs(new Date(response[0].scheduling_date)));
          setValue("location", response[0].location);
          setValue("person_name", response[0].person_name);
        })
        .catch((error: unknown | AxiosError) => {
          if (error instanceof AxiosError) {
            if (error?.response?.status !== 200) {
              setErrorSchedule("Não foi possível resgatar o agendamento!");
            } else {
              setErrorSchedule("Não foi possível resgatar o agendamento!");
            }
          }
        });
    } else {
      setEmptySchedule("Agendamento vazio!");
      setErrorSchedule("Não foi possível resgatar o agendamento!");
    }
  }, [schedulingIdNumber]);

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
          onSubmit={handleSubmit(handleUpdateSchedule)}
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
                disabled={emptySchedule ? true : false}
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
                    disabled={emptySchedule ? true : false}
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
                disabled={emptySchedule ? true : false}
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
          <div>
            {success && (
              <p className="text-sm text-green-500 text-center">{success}</p>
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
          Editar
        </button>
      </div>
    </>
  );
};

export default EditSchedule;
