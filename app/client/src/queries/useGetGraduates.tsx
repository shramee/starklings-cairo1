import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../constants/api";
import { IGraduate } from "../types/graduate";

export const useGetGraduates = () => {
  return useQuery<IGraduate[]>({
    queryKey: ["graduates"],
    queryFn: async () => {
      const { data: graduates } = await axios.get(API_URL + "/graduates");
      return [...graduates]
        .filter((graduate: IGraduate) => graduate.user_name !== "cypress")
        .map((graduate: IGraduate) => {
          return {
            ...graduate,
            user_name: graduate.user_name.startsWith("gh")
              ? graduate.user_name.slice(2)
              : graduate.user_name,
          };
        })
        .sort((a, b) => a.user_name.localeCompare(b.user_name));
    },
  });
};
