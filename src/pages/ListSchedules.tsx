import { useState, useEffect } from "react";
import utils from "../utils/utils";
import { Link } from "react-router-dom";
import { schedulesApi } from "../integrations/schedule";
import { AxiosError } from "axios";
import eyeIconView from "../assets/eye-icon-view.svg";
import trashIcon from "../assets/trash-icon.svg";
import dayjs from "dayjs";
import Modal from "../components/Modal";

interface ScheduleListType {
  scheduling_id?: number;
  registration_date?: string;
  person_name?: string;
  scheduling_date?: string;
  location?: string;
}

const ListSchedules = () => {
  const [schedules, setSchedules] = useState<ScheduleListType[]>([]);
  const [error, setError] = useState<string>("");
  const [errorDelete, setErrorDelete] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [idSelected, setIdSelected] = useState<number>(0);

  const handleConfirm = async () => {
    await deleteSchedule(idSelected);
    setIsModalOpen(false);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const deleteSchedule = async (scheduling_id: number): Promise<void> => {
    try {
      setErrorDelete("");
      const response = await schedulesApi().deleteAppointment(scheduling_id);
      // console.log({ response });
      setSchedules((prev) => {
        return prev.filter((value) => value.scheduling_id !== scheduling_id);
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error?.response?.status !== 200) {
          setErrorDelete("Não foi possível deletar o agendamento!");
        } else {
          setErrorDelete("Não foi possível deletar o agendamento!");
        }
      }
    }
  };

  useEffect(() => {
    schedulesApi()
      .listAppointments()
      .then((response) => {
        setSchedules(response);
      })
      .catch((error: unknown | AxiosError) => {
        if (error instanceof AxiosError) {
          if (error?.response?.status !== 200) {
            setError("Não foi possível listar os agendamentos!");
          } else {
            setError("Não foi possível listar os agendamentos!");
          }
        }
      });

    return () => {
      setSchedules([]);
    };
  }, []);

  return (
    <>
      {error && <p>{error}</p>}
      {schedules.length > 0 && !error ? (
        <div>
          <div
            className={`mx-auto mt-8 mb-6 max-w-[min(80%,1000px)] border border-blueLightAqua rounded max-h-[57vh] ${
              schedules.length > 0 && "overflow-auto"
            }`}
          >
            <table className="w-full divide-y divide-blueLightAqua border-collapse border bg-white">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold"
                  >
                    ID do registro
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold"
                  >
                    Nome do agendado
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold"
                  >
                    Data do agendamento
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold"
                  >
                    Local
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold"
                  >
                    Data do registro
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold"
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blueLightAqua bg-white">
                {schedules.map((value, i) => {
                  return (
                    <tr
                      key={`${value.scheduling_id}-${i}-${value.registration_date}`}
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium">
                        {value.scheduling_id
                          ? utils.hashId(`${value.scheduling_id}`)
                          : ""}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 overflow-hidden text-ellipsis max-w-[250px]">
                        {value.person_name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {value.scheduling_date
                          ? dayjs(value.scheduling_date).format(
                              "DD/MM/YYYY HH:mm",
                            )
                          : ""}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 overflow-hidden text-ellipsis max-w-[250px]">
                        {value.location}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {value.registration_date
                          ? dayjs(value.registration_date).format(
                              "DD/MM/YYYY HH:mm:ss",
                            )
                          : ""}
                      </td>
                      <td className="actions pr-2 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex justify-center items-center">
                          <Link to={`${value.scheduling_id}`}>
                            <button className="generate-document p-2 hover:bg-green-200 hover:rounded-full hover:text-white transition-all duration-300">
                              <div className="h-6 w-6">
                                <img
                                  src={eyeIconView}
                                  alt="view-icon"
                                  className="w-full h-full"
                                  title="Visualizar"
                                />
                              </div>
                            </button>
                          </Link>
                          <button
                            className="generate-document p-2 hover:bg-red-200 hover:rounded-full hover:text-white transition-all duration-300"
                            onClick={() => {
                              setIsModalOpen(true);
                              setIdSelected(value.scheduling_id || 0);
                            }}
                          >
                            <div className="h-6 w-6">
                              <img
                                src={trashIcon}
                                alt="view-icon"
                                className="w-full h-full"
                                title="Deletar"
                              />
                            </div>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div>
            {errorDelete && (
              <p className="text-sm text-red-500 text-center">{errorDelete}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="w-max m-auto">
          <p>Sem resultados</p>
        </div>
      )}

      <div className="w-max m-auto mt-4 bg-prymaryBlue text-white text-base rounded-full py-3 opacity-70 hover:opacity-100 px-4 cursor-pointer absolute inset-x-0 bottom-10">
        <Link to={"add-schedule"}>
          <button className="">Adicionar agendamento</button>
        </Link>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title="Confirmação"
      >
        <p>
          Tem certeza que deseja excluir o agendamento:{" "}
          {utils.hashId(`${idSelected}`)}?
        </p>
      </Modal>
    </>
  );
};

export default ListSchedules;
