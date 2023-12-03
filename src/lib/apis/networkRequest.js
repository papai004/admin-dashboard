import axios from "axios";

const networkRequest = async (
  endPoint = "",
  method = "GET",
  body = {},
) => {
  try {
    const requestURI = `${process.env.REACT_APP_BACKEND_BASE_URL}${endPoint}`;

    const response = await axios({
      url: requestURI,
      method,
      data: body,
    });

    return {
      isOk: true,
      ...response?.data,
    };
  } catch (err) {
    return {
      isOk: false,
      ...err?.response?.data,
    };
  }
};

export default networkRequest;
