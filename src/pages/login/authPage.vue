<template>
  <!-- //TODO: inicia la estructura de la pagina en vue -->
  <q-card-section class="text-center">
    <!-- // una seccion de la pagina se convierte en una carta -->
    <!-- <img
      src="~assets/fondologin.jpeg"
      style="position: fixed; height: 100%; left: 0; bottom: 0; z-index: -1"
    /> -->
    <div
      style="
        position: fixed;
        height: 100%;
        width: 100%;
        left: 0;
        bottom: 0;
        z-index: -1;
        background: #3faa47;
      "
    ></div>
    <!-- // agrega la imagen de fondo y le pone un style -->
    <q-btn to="/" unelevated>
      <img
        class="q-ma-lg"
        style="height: 200px; width: 200px"
        src="~assets/logo_quooka.png"
      />
    </q-btn>
    <!-- // agraga una imagen como logo con una class que le da una posicion dentro -->
    <!-- de la pagina y un style que le da el tamaño -->

    <h5 class="q-ma-xs text-weight-bolder">Bienvenido a Ecommerce</h5>
    <!-- //agrega un texto con una class de dimecion y negrilla -->

    <h5 class="q-mv-xl text-weight-bolder">
      TU CUENTA SE HA CREADO CORRECTAMENTE
    </h5>
    <!-- //agrega un texto con una class de dimecion y negrilla -->

    <h5 class="q-mv-xl text-weight-bolder">
      Dale Al Boton Para Iniciar Sesion
    </h5>
    <!-- //agrega un texto con una class de dimecion y negrilla -->

    <div>
      <q-btn to="login" label="Iniciar Sesion" type="submit" color="warning" />
      <!-- //boton type submit que redirige al login -->
    </div>
  </q-card-section>
  <!-- //termina la carta -->
</template>
<!-- //termina la pagina -->
