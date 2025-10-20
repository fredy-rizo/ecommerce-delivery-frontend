
// import { useRouter } from "vue-router";

// usar antes de una peticion para validar el estado del token y los permisos
const validateUser = (data) => {
  const dataUser = JSON.parse(
    localStorage.getItem("user")
      ? localStorage.getItem("user")
      : '{"id":"1","name":"Invitado","roles":[{"name":"usuario","value":"1"}],"membership":{"status":{"code":3,"status":"Cancelado"},"expdate":"","duedate":"","value":""}}'
  );
  const token = localStorage.getItem("token");

  if (dataUser.roles && dataUser.roles[0].value == 2) {
    return { ...dataUser, token };
  }

  // Permitir rol simple o múltiples
  const userRoles = dataUser.roles.map(r => Number(r.value));
  const allowedRoles = Array.isArray(data.rol) ? data.rol.map(Number) : [Number(data.rol)];

  const hasRole = allowedRoles.some(r => userRoles.includes(r));

  return hasRole ? { ...dataUser, token } : false;
};


// usar en las respuestas para redirigir al inicio de la pagina y borrar datos de la sesion
const ValidateSession = (res, router) => {
  // const router = useRouter();
  if (res.code == "403" || res.code == 403 || res.code == "401" || res.code == 401) {
    router.push({ path: "/login" });
    localStorage.clear();
    return false
  }
  return true
}

const getDataUser = () => {
  const dataUser = JSON.parse(
    localStorage.getItem("user")
      ? localStorage.getItem("user")
      : '{"id":"1", "name": "Invitado", "address": "Indefinido", "phone_number": "1234567890", "email": "Invitado@email.com", "type":0, "roles":[{"name":"Invitado", "value":"4"}], "membership": {"status": { "code": 3, "status": "Cancelado" }, "expdate": "", "duedate": "", "value": ""}}'
  )
  const token = localStorage.getItem("token")
  localStorage.setItem("user", JSON.stringify(dataUser))
  return { ...dataUser, token }
}


export { validateUser, ValidateSession, getDataUser }
