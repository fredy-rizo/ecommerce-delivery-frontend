<template>
  <div>
    <q-table
      title="Eventos"
      :rows="rows"
      :filter="filter"
      :columns="columns"
      row-key="id"
    >
      <template v-slot:top-right>
        <q-input
          dense
          outlined
          rounded
          color="warning"
          input-class="text-right"
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <div class="q-gutter-md q-pt-md">
              <q-btn
                dense
                rounded
                size="sm"
                color="info"
                text-color="black"
                icon="las la-pen-fancy"
                @click="campEditEvent = true"
              />

              <q-dialog persistent full-width v-model="campEditEvent">
                <FormEvent />
              </q-dialog>

              <q-btn
                dense
                rounded
                size="sm"
                color="positive"
                text-color="black"
                icon="las la-eye"
                @click="campVueCompany = true"
              />

              <q-dialog persistent full-width v-model="campVueCompany">
                <ListCompany />
              </q-dialog>
            </div>
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
const columns = [
  {
    name: "name",
    label: "Nombre de Eventos",
    aling: "center",
    field: "name",
    sortable: true,
    required: true,
    format: (val) => `${val}`,
  },
  {
    name: "description",
    label: "Descripcion",
    aling: "center",
    field: "description",
    sortable: true,
    required: true,
  },
  {
    name: "fechaInicio",
    label: "Fecha de Inicio",
    aling: "center",
    field: "fechaInicio",
    sortable: true,
    required: true,
  },
  {
    name: "fechaFinal",
    label: "Fecha de Final",
    aling: "center",
    field: "fechaFinal",
    sortable: true,
    required: true,
  },
  {
    name: "precio",
    label: "Precio",
    aling: "center",
    field: "precio",
    sortable: true,
    required: true,
  },
  {
    name: "estado",
    label: "Estado",
    aling: "center",
    field: "estado",
    sortable: true,
    required: true,
  },
];

const rows = [
  {
    name: "Navidad",
    fechaInicio: "21 - 12 - 2022",
    description:
      "Enumerar los rasgos más importantes de algo, sin necesidad de describirlo en su totalidad. Ser objetiva, subjetiva o que refleja impresiones y emociones.",
    fechaFinal: "01 - 01 - 2023",
    precio: "$10,000",
    estado: "activado",
  },
  {
    name: "Año Nuevo",
    fechaInicio: "22 - 12 - 2022",
    fechaFinal: "02 - 01 - 2023",
    precio: "$20,000",
    estado: "activado",
  },
  {
    name: "cumpleaños",
    fechaInicio: "23 - 12 - 2022",
    fechaFinal: "03 - 01 - 2023",
    precio: "$30,000",
    estado: "activado",
  },
  {
    name: "Vacaciones",
    fechaInicio: "24 - 12 - 2022",
    fechaFinal: "04 - 01 - 2023",
    precio: "$40,000",
    estado: "desactivado",
  },
  {
    name: "Regreso",
    fechaInicio: "25 - 12 - 2022",
    fechaFinal: "05 - 01 - 2023",
    precio: "$50,000",
    estado: "desactivado",
  },
];
import { ref } from "vue";
import FormEvent from "./formEvent";
import ListCompany from "./listCompany";
export default {
  setup() {
    const campEditEvent = ref(null);

    const campVueCompany = ref(null);

    const filter = ref("");

    return {
      filter,
      campEditEvent,
      campVueCompany,
      columns,
      rows,
    };
  },

  components: {
    FormEvent,
    ListCompany,
  },
};
</script>
