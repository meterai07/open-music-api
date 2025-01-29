export const successResponse = (h, data, code = 200) =>
  h
    .response({
      status: "success",
      data,
    })
    .code(code);

export const errorResponse = (h, message, code) =>
  h
    .response({
      status: code >= 500 ? "error" : "fail",
      message,
    })
    .code(code);
