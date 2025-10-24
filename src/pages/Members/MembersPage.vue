<template>
  <BarFilterMembers :getdataFilter="getdataFilter" />

  <q-dialog persistent full-width v-model="dialogmodel">
    <q-card>
      <q-toolbar>
        <q-toolbar-title class="text-weight-bold"
          >Nuevo miembro</q-toolbar-title
        >
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
    </q-card>
  </q-dialog>

  <q-page-sticky
    style="z-index: 9"
    position="bottom-right"
    :offset="[18, 18]"
    @click="dialogmodel = true"
  >
    <q-btn fab icon="add" class="bg-green-7" />
  </q-page-sticky>

  <q-infinite-scroll class="q-pa-md" @load="ListMembers" :offset="200">
    <q-card
      v-for="member in members"
      :key="member._id"
      class="q-mb-md shadow-3 hover:bg-grey-2 transition-all"
    >
      <q-item>
        <q-item-section avatar>
          <q-avatar size="64px" class="bg-grey-3">
            <img
              v-if="
                member.avatar && member.avatar[0] && member.avatar[0].avatar
              "
              :src="member.avatar[0].avatar"
              alt="avatar"
            />
            <span
              v-else
              class="text-h6 text-bold flex flex-center text-primary"
            >
              {{ member.name ? member.name.substring(0, 1) : "?" }}
            </span>
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-bold text-h6 text-primary">
            {{ member.name }}
          </q-item-label>
          <q-item-label caption class="text-bold text-grey-8">
            {{ member.email }}
          </q-item-label>
          <q-item-label caption class="text-bold text-grey-8">
            {{ member.phone_number }}
          </q-item-label>
        </q-item-section>

        <q-item-section side class="flex items-center q-gutter-sm q-pr-md">
          <q-select
            dense
            outlined
            v-model="member.selectedRole"
            :options="rolesList"
            option-label="name"
            option-value="value"
            emit-value
            map-options
            label="Rol"
            class="rounded-borders"
            style="min-width: 160px"
            popup-content-class="bg-white text-body2"
          />
          <q-btn
            color="primary"
            icon="save"
            round
            dense
            unelevated
            class="shadow-2"
            @click="updateRole(member)"
          />
        </q-item-section>
      </q-item>

      <q-separator inset />

      <q-card-section class="q-pt-none q-pb-sm">
        <div class="text-caption text-grey-9 q-gutter-y-xs">
          <div>
            <span class="text-weight-bold text-blue-6">Dirección:</span>
            <span class="q-ml-xs">{{ member.address || "No registrada" }}</span>
          </div>
          <div>
            <span class="text-weight-bold text-blue-6"
              >Tipo de identificación:</span
            >
            <span class="q-ml-xs">{{
              member.typeIdentification || "No definida"
            }}</span>
          </div>
          <div>
            <span class="text-weight-bold text-blue-6">Identificación:</span>
            <span class="q-ml-xs">{{
              member.identification || "No definida"
            }}</span>
          </div>

          <div>
            <span class="text-weight-bold text-blue-6">Rol:</span>
            <q-badge
              :color="
                member.roles && member.roles[0]
                  ? member.roles[0].name === 'usuario'
                    ? 'blue'
                    : member.roles[0].name === 'admin'
                    ? 'red'
                    : member.roles[0].name === 'promotor'
                    ? 'green'
                    : 'grey'
                  : 'grey'
              "
              class="q-ml-xs text-bold"
              align="middle"
            >
              {{
                member.roles && member.roles[0]
                  ? member.roles[0].name
                  : "Sin rol"
              }}
            </q-badge>

            <q-badge
              :color="
                member.roles && member.roles[0]
                  ? member.roles[0].name === 'usuario'
                    ? 'blue-5'
                    : member.roles[0].name === 'admin'
                    ? 'red-5'
                    : member.roles[0].name === 'promotor'
                    ? 'green-5'
                    : 'grey-5'
                  : 'grey-5'
              "
              class="q-ml-xs text-bold"
              align="middle"
            >
              {{
                member.roles && member.roles[0] ? member.roles[0].value : "N/A"
              }}
            </q-badge>
          </div>

          <div>
            <span class="text-weight-bold text-blue">Estado:</span>
            <q-badge
              :color="
                member.status && member.status[0]
                  ? member.status[0].name === 'usuario activo'
                    ? 'teal'
                    : member.status[0].name === 'Pendiente de confirmacion'
                    ? 'orange'
                    : member.status[0].name === 'usuario inactivo'
                    ? 'purple'
                    : 'grey'
                  : 'grey'
              "
              class="q-ml-xs text-bold"
              align="middle"
            >
              {{
                member.status && member.status[0]
                  ? member.status[0].name
                  : "Sin estado"
              }}
            </q-badge>

            <q-badge
              :color="
                member.status && member.status[0]
                  ? member.status[0].value === '1'
                    ? 'teal-4'
                    : member.status[0].value === '2'
                    ? 'orange-4'
                    : member.status[0].value === '3'
                    ? 'purple-4'
                    : 'grey-5'
                  : 'grey-5'
              "
              class="q-ml-xs text-bold"
              align="middle"
            >
              {{
                member.status && member.status[0]
                  ? member.status[0].value
                  : "N/A"
              }}
            </q-badge>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <div style="height: 120px"></div>
  </q-infinite-scroll>
</template>

<script>
import { useRouter } from "vue-router";
import { ref, defineComponent } from "vue";
import { ValidateSession, validateUser } from "src/tools/User";
import BarFilterMembers from "src/components/Members/BarFilterMembers.vue";

export default defineComponent({
  name: "MiembrosPage",
  setup() {
    const router = useRouter();
    const pagination = ref({ pag: 0, perpage: 10, pags: 1 });
    const filter = ref({});
    const dialogmodel = ref(false);
    const members = ref([]);

    // Lista de roles posibles
    const rolesList = ref([
      { name: "Usuario", value: "1" },
      { name: "Promotor", value: "3" },
      { name: "Admin", value: "2" },
    ]);

    const ListMembers = (index, done) => {
      if (
        pagination.value.pags === pagination.value.pag ||
        pagination.value.pags === 0
      ) {
        done(true);
        return;
      }
      pagination.value.pag++;
      getMembers().then((res) => {
        if (!res || !res.data || res.data.length === 0) {
          done(true);
          return;
        }
        res.data.forEach((m) => {
          m.selectedRole = m.roles && m.roles[0] ? m.roles[0].value : null;
        });
        members.value.push(...res.data);
        pagination.value.pags = res.pagination?.pags || pagination.value.pag;
        done();
      });
    };

    const resetlistMembers = async () => {
      members.value = [];
      pagination.value.pag = 0;
      const res = await getMembers();
      if (res && res.data) {
        res.data.forEach((m) => {
          m.selectedRole = m.roles && m.roles[0] ? m.roles[0].value : null;
        });
        members.value = [...res.data];
        pagination.value.pags = res.pagination?.pags || 1;
      }
    };

    const getdataFilter = (data) => {
      filter.value = data;
      resetlistMembers();
    };

    const getMembers = async () => {
      const sesionUser = validateUser({ rol: 2 });
      let headers = { "Content-Type": "application/json" };
      if (sesionUser) headers.Authorization = `Bearer ${sesionUser.token}`;
      let res = await fetch(
        process.env.API_SERVER +
          `/api/user/list-members/${pagination.value.pag}/${pagination.value.perpage}`,
        {
          method: "POST",
          mode: "cors",
          headers,
          body: JSON.stringify(filter),
        }
      );
      res = await res.json();
      ValidateSession(res, router);
      if (!res.status) return;
      return res;
    };

    const updateRole = async (member) => {
      const sesionUser = validateUser({ rol: 2 });
      if (!sesionUser || !member.selectedRole) return;

      const selectedRoleObj = rolesList.value.find(
        (r) => r.value === member.selectedRole
      );

      const raw = JSON.stringify({
        roles: [
          {
            name: selectedRoleObj.name.toLowerCase(),
            value: selectedRoleObj.value,
          },
        ],
      });

      const res = await fetch(
        process.env.API_SERVER + `/api/user/update-role/${member._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sesionUser.token}`,
          },
          body: raw,
        }
      );

      const result = await res.json();
      if (result.status) {
        const index = members.value.findIndex((m) => m._id === member._id);
        if (index !== -1) {
          members.value[index].roles = [
            {
              name: selectedRoleObj.name.toLowerCase(),
              value: selectedRoleObj.value,
            },
          ];
        }
      } else {
        console.log("Error al actualizar rol:", result);
      }
    };

    return {
      members,
      ListMembers,
      getdataFilter,
      dialogmodel,
      getMembers,
      resetlistMembers,
      updateRole,
      rolesList,
    };
  },
});
</script>
