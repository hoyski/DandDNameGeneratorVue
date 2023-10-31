<template>
  <div class="taverns-container">
    <div v-if="generating">Generating...</div>
    <button v-else @click="generateNewTavern">Generate Tavern</button>

    <input type="text" v-model="setting">

    <table>
      <thead>
        <tr>
          <td>Name</td>
          <td>Size</td>
          <td>Quality</td>
          <td>Bartender Name</td>
          <td>Bartneder Race</td>
          <td>Bartender Gender</td>
          <td>Bartender Age</td>
        </tr>
      </thead>
      <tbody>
        <tr
          class="tavern-row"
        >

        <td>{{ tavern.Name }}</td>
        <td>{{ tavern.Size }}</td>
        <td>{{ tavern.Quality }}</td>
        <td>{{ tavern.Bartender.Name }}</td>
        <td>{{ tavern.Bartender.Race }}</td>
        <td>{{ tavern.Bartender.Gender }}</td>
        <td>{{ tavern.Bartender.Age }}</td>


        </tr>
      </tbody>
    </table>
 <p>

 </p>
  </div>
</template>

<script>
import OpenAI from "openai";

export default {
  data() {
    return {
      generating: false,
      tavern: {
  "Name": "",
  "Size": 0,
  "Quality": "",
  "Bartender": {
    "Name": "",
    "Race": "",
    "Gender": "",
    "Age": 0
  }
},
      setting: 'Fantasy'
    }
  },
  components: {},
  methods: {
    async generateNewTavern() {

      let tavernSmells = [
        "Pine",
  "Smoke",
  "Sweat",
  "Hard Liquor",
  "Spruce",
  "Rain",
  "Fresh Cut Grass",
  "Cooked Meat",
  "Wine",
  "Burnt Meat",
  "Rubber",
  "Sulfur",
  "Metal",
  "Wheat",
  "Blood",
  "Oil",
  "Fish",
  "Salt",
  "Baked Goods",
  "Pickles",
  "Flowers",
  "Strawberry",
  "Banana",
  "Grape",
  "Watermelon",
  "Kiwi",
  "Mango",
  "Milk",
  "Birch",
  "Oak",
  "Aspen",
  "Acacia",
  "Potato"
      ]

      let smellNumber = Math.floor(Math.random() * tavernSmells.length);

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
            content: `You are a dungeon master creating a new campaign set in ${this.setting}`,
          },
          {
            role: "user",
            content: `Generate a tavern with the following properties and return the results as a JSON object.

Tavern: Generate a fantasy tavern with the list of parameters and the following caveats of each parameter this tavern also has some unique properties so please keep those in mind when generating this tavern, this tavern smells of ${tavernSmells[smellNumber]}

Name - Name of said tavern (Caveat: no animal related names including mythical creatures)
Size - Amount of people in the tavern (Caveat: come up with a random number 5 - 40)
Quality - Quality of said tavern (Caveat: describe the quality both of how clean the tavern is and the good the drinks are keep this description short)
Bartender - Name of this tavern's bartender (Caveat: include in this order name, race, gender, age. Make these a JSON object)

Use this as the framework for your response
{
"Name": "",
  "Size": 0,
  "Quality": "",
  "Bartender": {
    "Name": "",
    "Race": "",
    "Gender": "",
    "Age": 0
  }
}
            `,
          },
        ],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      console.log(response.choices[0].message.content);
      this.tavern = JSON.parse(response.choices[0].message.content);

      //this.$store.commit("ADD_TAVERN", tavernInfo);



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
.tavernName{
  font-size: 40px;
}
</style>