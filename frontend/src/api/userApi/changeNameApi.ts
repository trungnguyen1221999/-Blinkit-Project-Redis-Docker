import api from "../api";

const changeNameApi = async (id: string, newName: string): Promise<any> => {
  const response = await api.put(
    "/user/change-name",
    {
      _id: id,
      name: newName,
    },

    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export default changeNameApi;
