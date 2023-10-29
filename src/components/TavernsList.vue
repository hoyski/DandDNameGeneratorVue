<template>
  <div class="taverns-container">
    <div v-if="generating">Generating...</div>
    <button v-else @click="generateNewTavern">Generate Tavern</button>

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
import OpenAI from "openai";

export default {
  data() {
    return {
      generating: false
    }
  },
  components: {},
  methods: {
    async generateNewTavern() {

      this.generating = true;

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a dungeon master creating a new campaign",
          },
          {
            role: "user",
            content: `Generate a tavern with the following properties and return the results as a JSON object.

            Tavern: Generate a fantasy tavern with the list of parameters below
            Name - Name of said tavern
            Size - Number of people in the tavern
            Quality - Quality of said tavern
            Bartender - Name of this tavern's bartender
            `,
          },
        ],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      const tavernInfo = JSON.parse(response.choices[0].message.content);

      this.$store.commit("ADD_TAVERN", tavernInfo);

      this.generating = false;
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
  background-color: #f0f0f0;
}
</style>