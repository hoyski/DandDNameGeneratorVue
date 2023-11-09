<template>
  <div class="generator">
    <button @click="generateTheming">Generator</button>
  </div>
  <div class="taverns-container">
    <div v-if="generating">Generating...</div>
    <button v-else @click="generateNewTavern">Generate Tavern</button>

    <input type="text" v-model="setting" />

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
        <tr class="tavern-row">
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

    <div class="races">
      <div class="race" v-for="(curRace, index) in races" v-bind:key="index">
        <div v-bind:id="'race_' + index" contenteditable="true" spellcheck="false" @blur="handleRaceChange(index)">
          {{ curRace.race }}
        </div>
        <div v-bind:id="'weight_' + index" contenteditable="true" spellcheck="false" @blur="handleWeightChange(index)">
          {{ curRace.weight }}
        </div>
        <div>
          <button v-on:click="removeRace(index)">Remove</button>
        </div>
      </div>
      <div class="newRace race">
        <input class="raceInput" type="text" v-model="newRace.race" />
        <br />
        <input class="raceInput" type="number" v-model="newRace.weight" />
        <br />
        <button v-on:click="addRace">+</button>
      </div>
    </div>
    <p></p>
  </div>
</template>

<script>
import OpenAI from "openai";

export default {
  data() {
    return {
      generating: false,
      tavern: {
        Name: "",
        Size: 0,
        Quality: "",
        Bartender: {
          Name: "",
          Race: "",
          Gender: "",
          Age: 0,
        },
      },
      setting: "Fantasy",
      tavernSmells: [
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
        "Potato",
      ],
      selectedSmell: "",
      races: [],
      newRace: {
        race: "",
        weight: 0,
      },
    };
  },
  components: {},
  methods: {
    async generateNewTavern() {
      this.generating = true;

      this.generateTheming();

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

Tavern: Generate a fantasy tavern with the list of parameters and the following caveats of each parameter this tavern also has some unique properties so please keep those in mind when generating this tavern, this tavern smells of ${this.selectedSmell}

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
    generateTheming() {
      let pickedRace = this.pickWeightedRace();
      let smellNumber = Math.floor(Math.random() * this.tavernSmells.length);
      this.selectedSmell = this.tavernSmells[smellNumber];
      console.log(this.selectedSmell);
      console.log(pickedRace.race);
    },
    pickWeightedRace() {
      let raceTotal = 0;
      for (let i = 0; i < this.races.length; i++) {
        raceTotal += this.races[i].weight;
      }

      const raceThreshold = Math.floor(Math.random() * raceTotal);

      raceTotal = 0;
      for (let i = 0; i < this.races.length - 1; i++) {
        raceTotal += this.races[i].weight;

        if (raceTotal >= raceThreshold) {
          return this.races[i];
        }
      }
      return this.races[this.races.length - 1];
    },
    addRace() {
      if (this.newRace.race == "") {
        return;
      }
      let newRaceCopy = {};
      newRaceCopy.race = this.newRace.race;
      newRaceCopy.weight = this.newRace.weight;
      this.races.push(newRaceCopy);
      this.newRace.race = "";
      this.newRace.weight = 0;
      this.addToLocalStorage();
    },
    removeRace(index) {
      console.log("Remove Race " + index);
      this.races.splice(index, 1);
      this.addToLocalStorage();
    },
    handleRaceChange(index) {
      console.log(`Handling race change for idx ${index}`);
      let raceElem = document.getElementById("race_" + index);
      this.races[index].race = raceElem.innerText;
      this.addToLocalStorage();
    },
    handleWeightChange(index) {
      console.log(`Handling weight change for idx ${index}`);
      let weightElem = document.getElementById("weight_" + index);
      // Ensure a valid number has been entered. If not, set the weight back to its current
      // value from the array
      if (isNaN(parseInt(weightElem.innerText))) {
        weightElem.innerText = this.races[index].weight;
      } else {
        this.races[index].weight = parseInt(weightElem.innerText);
        this.addToLocalStorage();
      }
    },
    addToLocalStorage() {
      let racesString = JSON.stringify(this.races);
      localStorage.setItem("races", racesString);
    }
  },
  created() {
    if (!localStorage.getItem("races")) {
      //no races then saet to default
      this.races = [
        {
          race: "human",
          weight: 50,
        },
        {
          race: "elf",
          weight: 20,
        },
        {
          race: "dwarf",
          weight: 12,
        },
        {
          race: "dragonborn",
          weight: 14,
        },
      ];
    }
    else {
      let racesString = localStorage.getItem("races");
      this.races = JSON.parse(racesString);
    }
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-spacing: 0;
}

thead>tr>td {
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f0f0f0;
}

.tavernName {
  font-size: 40px;
}

.races {
  display: flex;
}

.race {
  border: 1px solid #000000;
  margin: 20px;
  padding: 5px;
  width: 14%;
}

.raceInput {
  width: 85%;
}
</style>