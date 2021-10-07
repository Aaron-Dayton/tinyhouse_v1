import { useReducer } from "react";
import { server } from ".";

interface State {
  loading: boolean;
  error: boolean;
};

type Action =
  { type: "FETCH"} |
  { type: "FETCH_SUCCESS"} |
  { type: "FETCH_ERROR"}

type MutationTuple<TVariables> = [
  (variables?: TVariables | undefined) => Promise<void>,
  State
];

const reducer = () => (
  state: State,
  action: Action
): State => {
  switch(action.type) {
    case "FETCH":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { loading: false, error: false };
    case "FETCH_ERROR":
      return { loading: false, error: true };
    default:
      throw new Error();
  };
};

export const useMutation = <TData = any, TVariables = any>(
  query: string
): MutationTuple<TVariables> => {
  const [state, dispatch] = useReducer(reducer(), {
    loading: false,
    error: false
  });

  const fetch = async (variables?: TVariables) => {
    try {
      dispatch({ type: "FETCH" })
      const { data, errors } = await server.fetch<TData, TVariables>({
        query,
        variables
      });
      dispatch({ type: "FETCH_SUCCESS" })

      if (errors && errors.length) {
        throw new Error(errors[0].message);
      };
    } catch (err) {
      dispatch({ type: "FETCH_ERROR" })
      throw console.error(err);
    };
  };

  return [fetch, state];
};