export const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return {
    field: param,
    message: `${param} ${msg}`
  };
}