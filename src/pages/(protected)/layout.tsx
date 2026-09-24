import { Outlet, replace, type LoaderFunctionArgs } from "react-router";
import { userContext } from "../../middlewares/auth";

export async function loader({ context }: LoaderFunctionArgs) {
  const user = context.get(userContext);
  if (!user) {
    throw replace("/login");
  }

  return user;
}

export function Component() {
  return <Outlet />;
}
