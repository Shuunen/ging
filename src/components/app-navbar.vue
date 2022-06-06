<template>
  <v-app-bar app>
    <v-container>
      <v-row class="items-center gap-4">
        <div class="sm:flex flex-row hidden gap-2">
          <h1 class="text-h4 ml-2">GING</h1>
          <v-icon class="text-h4" color="secondary" icon="mdi-chevron-triple-right" />
        </div>
        <div class="sm:hidden flex flex-row">
          <h1 class="text-h4 ml-2">G</h1>
          <v-icon class="text-h4" color="secondary" icon="mdi-chevron-right" />
        </div>
        <div class="ml-auto"></div>
        <add-project />
        <app-about />
      </v-row>
    </v-container>
  </v-app-bar>
</template>
