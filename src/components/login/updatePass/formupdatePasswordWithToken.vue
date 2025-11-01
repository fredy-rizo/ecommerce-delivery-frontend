<template>
  <div class="flex flex-center">
    <q-card
      class="q-pa-xl shadow-10"
      style="
        max-width: 450px;
        width: 100%;
        border-radius: 20px;
        position: relative;
      "
    >
      <q-btn
        flat
        round
        dense
        icon="arrow_back"
        color="grey-7"
        to="/formulario-page"
        style="position: absolute; top: 16px; left: 16px"
      />

      <div class="text-center q-mb-lg" style="margin-top: 30px">
        <q-icon name="verified_user" size="80px" color="brown-6" />
        <h5 class="q-mt-md q-mb-none text-weight-bold">
          Actualizar contraseña
        </h5>
        <p class="text-grey-7 q-mt-sm">
          Ingresa tu correo y las nuevas contraseñas
        </p>
      </div>

      <q-separator class="q-mb-lg" />

      <q-form @submit.prevent="updatePasswordWithToken" class="q-gutter-md">
        <q-input
          rounded
          outlined
          color="brown-6"
          bg-color="grey-2"
          label="Correo electrónico"
          v-model="email"
          type="email"
          disable
        >
          <template v-slot:prepend>
            <q-icon name="email" color="brown-6" />
          </template>
        </q-input>

        <q-input
          rounded
          outlined
          color="brown-6"
          bg-color="grey-1"
          v-model="password"
          label="Nueva contraseña"
          :type="isPwd ? 'password' : 'text'"
          :rules="[(val) => (val && val.length >= 8) || 'Mínimo 8 caracteres']"
        >
          <template v-slot:prepend
            ><q-icon name="key" color="brown-6"
          /></template>
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <q-input
          rounded
          outlined
          color="brown-6"
          bg-color="grey-1"
          v-model="confirmPassword"
          label="Confirmar nueva contraseña"
          :type="isPwd ? 'password' : 'text'"
          :rules="[(val) => val === password || 'Las contraseñas no coinciden']"
        >
          <template v-slot:prepend
            ><q-icon name="key" color="brown-6"
          /></template>
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <div class="q-mt-xl">
          <q-btn
            unelevated
            rounded
            label="Actualizar"
            type="submit"
            color="brown-6"
            text-color="white"
            class="full-width"
            size="lg"
            style="font-weight: 600; padding: 12px"
          />
        </div>
      </q-form>
    </q-card>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const $q = useQuasar();
    const router = useRouter();

    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const isPwd = ref(true);

    // decodifica el JWT
    const decodeToken = (token) => {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        return JSON.parse(jsonPayload);
      } catch {
        return null;
      }
    };

    onMounted(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        $q.notify({ color: "negative", message: "Token no encontrado" });
        router.push("/login");
        return;
      }

      const decoded = decodeToken(token);
      if (decoded?.email) email.value = decoded.email;
      else
        $q.notify({
          color: "negative",
          message: "Token inválido o sin correo",
        });
    });

    const updatePasswordWithToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        $q.notify({ color: "negative", message: "Token no encontrado" });
        return;
      }

      try {
        const res = await fetch(
          `${process.env.API_SERVER}/api/user/update-password-width-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              email: email.value,
              newPassword: password.value,
              newPasswordConfirmed: confirmPassword.value,
            }),
          }
        );

        const response = await res.json();
        if (!res.ok || response.status === false)
          throw new Error(response.msj || "Error al actualizar contraseña");

        $q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: "Contraseña actualizada correctamente",
        });

        router.push({ name: "inicio" });
      } catch (err) {
        $q.notify({
          color: "negative",
          textColor: "white",
          icon: "error",
          message: err.message,
        });
      }
    };

    return {
      email,
      password,
      confirmPassword,
      isPwd,
      updatePasswordWithToken,
    };
  },
};
</script>
