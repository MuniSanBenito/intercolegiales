interface Env {
  // acá van bindings: DB, KV, secrets, etc.
}

export const onRequestGet: PagesFunction<Env> = async () => {
  return Response.json({
    message: "Hola desde el backend de Pages Functions",
    timestamp: new Date().toISOString(),
  });
};
