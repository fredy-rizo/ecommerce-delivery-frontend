<template>
  <q-page class="q-pa-xl bg-grey-1 flex flex-center">
    <div>Actualizacion de formulario para usuario admin</div>
    <q-card
      class="q-pa-xl shadow-3 rounded-borders-xl"
      style="max-width: 800px; width: 100%"
    >
      <div class="column items-center q-mb-lg">
        <q-avatar size="120px" class="q-mb-md">
          <img :src="previewAvatar || defaultAvatar" alt="avatar" />
        </q-avatar>
        <div class="text-center">
          <div class="text-h5 text-primary">{{ dataUser.name }}</div>
          <div class="text-subtitle2 text-grey-7">{{ dataUser.email }}</div>
        </div>
      </div>

      <q-separator spaced />

      <div class="row q-col-gutter-md q-mt-md">
        <div class="col-12 col-md-6">
          <q-input v-model="form.name" label="Nombre" filled dense standout />
          <q-input
            v-model="form.address"
            label="Dirección"
            filled
            dense
            standout
          />
          <q-input
            v-model="form.phone_number"
            label="Teléfono"
            filled
            dense
            standout
          />
        </div>

        <div class="col-12 col-md-6">
          <q-input
            v-model="form.typeIdentification"
            label="Tipo Identificación"
            filled
            dense
            standout
          />
          <q-input
            v-model="form.identification"
            label="Identificación"
            filled
            dense
            standout
          />
          <q-input
            v-model="form.email"
            label="Email"
            filled
            dense
            readonly
            standout
          />
        </div>
      </div>

      <q-separator spaced />

      <div class="q-mt-md column q-gutter-md">
        <q-file
          v-model="file"
          label="Cambiar foto de perfil"
          outlined
          dense
          accept="image/*"
          class="col-12"
          @change="previewFile"
        />

        <q-btn
          color="primary"
          label="Guardar cambios"
          icon="save"
          class="col-12"
          @click="updateUser"
        />
      </div>
    </q-card>
  </q-page>
</template>

<style scoped>
.rounded-borders-xl {
  border-radius: 18px;
}
.q-input {
  transition: all 0.2s ease;
}
.q-input:hover {
  transform: scale(1.01);
}
</style>

<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";
import { getDataUser } from "../../../tools/User";

export default defineComponent({
  name: "ClientId",
  setup() {
    const $q = useQuasar();
    const dataUser = ref(getDataUser());
    const file = ref(null);
    const previewAvatar = ref(
      dataUser.value.avatar?.[0]?.avatar ||
        dataUser.value.avatar?.[0]?.urlAvatar ||
        ""
    );
    const defaultAvatar = "https://cdn.quasar.dev/img/avatar.png";

    // Precargar valores del localStorage
    const form = ref({
      name: dataUser.value.name || "",
      address: dataUser.value.address || "",
      phone_number: dataUser.value.phone_number || "",
      typeIdentification: dataUser.value.typeIdentification || "",
      identification: dataUser.value.identification || "",
      email: dataUser.value.email || "",
    });

    const previewFile = (e) => {
      const fileObj = e.target?.files?.[0];
      if (fileObj) previewAvatar.value = URL.createObjectURL(fileObj);
    };

    const updateUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token no encontrado");

        const headers = new Headers();
        headers.append("authorization", `Bearer ${token}`);

        const formdata = new FormData();
        for (const key in form.value) formdata.append(key, form.value[key]);
        if (file.value) formdata.append("avatar", file.value);

        const res = await fetch(`${process.env.API_SERVER}/api/user/update`, {
          method: "POST",
          headers,
          body: formdata,
        });

        const result = await res.json();
        if (!res.ok || result.status === false)
          throw new Error(result.msj || "Error al actualizar");

        // Actualiza localStorage y datos en tiempo real
        const updatedUser = { ...dataUser.value, ...result.newUser };
        dataUser.value = updatedUser;
        form.value = {
          name: updatedUser.name || "",
          address: updatedUser.address || "",
          phone_number: updatedUser.phone_number || "",
          typeIdentification: updatedUser.typeIdentification || "",
          identification: updatedUser.identification || "",
          email: updatedUser.email || "",
        };
        if (updatedUser.avatar?.[0]) {
          previewAvatar.value =
            updatedUser.avatar[0].avatar ||
            updatedUser.avatar[0].urlAvatar ||
            "";
        }
        localStorage.setItem("user", JSON.stringify(updatedUser));

        $q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: result.msj || "Datos actualizados correctamente",
        });
      } catch (err) {
        console.error("Error →", err);
        $q.notify({
          color: "negative",
          textColor: "white",
          icon: "error",
          message: err.message || "Error al actualizar datos",
        });
      }
    };

    return {
      dataUser,
      form,
      file,
      previewAvatar,
      defaultAvatar,
      updateUser,
      previewFile,
    };
  },
});
</script>

<style scoped>
.rounded-borders-xl {
  border-radius: 16px;
}
</style>
