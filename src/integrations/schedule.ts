import api from "./api";
import { AxiosResponse } from "axios";

interface DataResponseSchedule {
  scheduling_id?: number;
  person_name: string;
  location: string;
  scheduling_date: string;
}

type ScheduleListType = {
  scheduling_id: number;
  registration_date: string;
  person_name: string;
  scheduling_date: string;
  location: string;
};

type DataResponseSuccess = {
  status: string;
  message: string;
};

export const schedulesApi = () => ({
  createShedule: async (
    scheduleData: DataResponseSchedule,
  ): Promise<AxiosResponse> => {
    const response: AxiosResponse = await api.post(
      "/schedule/create/appointments",
      {
        ...scheduleData,
      },
    );

    return response.data;
  },

  listAppointments: async (): Promise<ScheduleListType[]> => {
    const response: AxiosResponse<ScheduleListType[]> = await api.get(
      "/schedule/list/appointments",
    );

    return response.data;
  },

  getAppointment: async (
    scheduling_id: number,
  ): Promise<ScheduleListType[]> => {
    const response: AxiosResponse<ScheduleListType[]> = await api.get(
      `/schedule/get/appointments/${scheduling_id}`,
    );

    return response.data;
  },

  editSchedule: async (
    scheduleData: DataResponseSchedule,
  ): Promise<ScheduleListType[]> => {
    const response: AxiosResponse<ScheduleListType[]> = await api.patch(
      `/schedule/update/appointments`,
      { ...scheduleData },
    );

    return response.data;
  },

  deleteAppointment: async (
    scheduling_id: number,
  ): Promise<DataResponseSuccess> => {
    const response: AxiosResponse<DataResponseSuccess> = await api.delete(
      `/schedule/delete/appointments/${scheduling_id}`,
    );

    return response.data;
  },
});
