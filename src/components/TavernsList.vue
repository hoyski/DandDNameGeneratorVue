<template>
  <div class="taverns-container">
    <button @click="generateNewTavern">Generate Tavern</button>
    <table>
      <thead>
        <tr>
          <td>Name</td>
          <td>Size</td>
          <td>Quality</td>
          <td>Bartender</td>
        </tr>
      </thead>
      <tbody>
        <tr
          class="tavern-row"
          v-for="tavern in $store.state.taverns"
          :key="tavern.Name"
        >
          <td>{{ tavern.Name }}</td>
          <td>{{ tavern.Size }}</td>
          <td>{{ tavern.Quality }}</td>
          <td>{{ tavern.Bartender }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  components: {},
  methods: {
    generateNewTavern() {
      let newTavern = {
        Name: "The Broken Promise",
        Size: 50,
        Quality: "Poor",
        Bartender: "Feld",
      };

      this.$store.commit("ADD_TAVERN", newTavern);
    },
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-spacing: 0;
}

thead > tr > td {
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #F0F0F0;
}
</style>