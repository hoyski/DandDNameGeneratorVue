<template>
  <div class="generator" v-if="true">
    <button @click="chatTester">Generator</button>
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
          <td>Cleanliness: {{ tavern.Quality.Cleanliness }} Drinks: {{ tavern.Quality.Drinks }} </td>
          <td>Name: {{ tavern.Bartender.Name.bartenderName }} Pronounciation: {{ tavern.Bartender.Name.phoneticSpelling }}
          </td>
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
          <div v-bind:id="'lifespan_' + index" contenteditable="true" spellcheck="false"
            @blur="handleLifespanChange(index)">
            {{ curRace.raceLifespan }}
          </div>
          <div>
            <div v-bind:id="'minimum_' + index" contenteditable="true" spellcheck="false"
              @blur="handleMinimumChange(index)">
              {{ curRace.raceMinimum }}
            </div>
          </div>
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
        <input class="raceInput" type="number" v-model="newRace.raceLifespan" />
        <br />
        <input class="raceInput" type="number" v-model="newRace.raceMinimum" />
        <br />
        <button v-on:click="addRace">+</button>
      </div>
    </div>
    <div class="previousTaverns">
      <div class="taverns" v-for="(curTavern, index) in taverns" v-bind:key="index">
        <div class="tavernsInfo">
          <div v-bind:id="'name_' + index" contenteditable="true" spellcheck="false">
            {{ curTavern.Name }}
          </div>
          <div v-bind:id="'bartender_' + index" contenteditable="true" spellcheck="false">
            {{ curTavern.Bartender.Name.bartenderName }}
          </div>
          <div v-bind:id="'name_' + index" contenteditable="true" spellcheck="false">
            {{ curTavern.Bartender.Name.phoneticSpelling }}
          </div>
          <div v-bind:id="'name_' + index" contenteditable="true" spellcheck="false">
            {{ curTavern.Size }}
          </div>
          <div v-bind:id="'name_' + index" contenteditable="true" spellcheck="false">
            {{ curTavern.Bartender.Race }}
          </div>
          <button v-on:click="removeTavern(index)">Remove</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OpenAI from "openai";
import { FineTuningJobsPage } from "openai/resources/fine-tuning/jobs";

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
      taverns: [],
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
      nameTypes: [
        "Nordic",
        "Elvish",
        "Norwegian",
        "Dwarvish",
        "Draconic",
        "Gnomish",
        "French",
        "English"
      ],
      genders: [
        {
          gender: "male",
          weight: 45,
        },
        {
          gender: "female",
          weight: 45,
        },
        {
          gender: "both",
          weight: 5,
        },
        {
          gender: "neither",
          weight: 5,
        }
      ],
      agePercentiles: [
        { "age": 0, "weight": 0 },
        { "age": 1, "weight": 5 },
        { "age": 2, "weight": 10 },
        { "age": 3, "weight": 20 },
        { "age": 4, "weight": 35 },
        { "age": 5, "weight": 50 },
        { "age": 6, "weight": 65 },
        { "age": 7, "weight": 80 },
        { "age": 8, "weight": 90 },
        { "age": 9, "weight": 95 },
        { "age": 10, "weight": 100 },
        { "age": 11, "weight": 95 },
        { "age": 12, "weight": 90 },
        { "age": 13, "weight": 85 },
        { "age": 14, "weight": 80 },
        { "age": 15, "weight": 100 },
        { "age": 16, "weight": 90 },
        { "age": 17, "weight": 80 },
        { "age": 18, "weight": 70 },
        { "age": 19, "weight": 60 },
        { "age": 20, "weight": 50 },
        { "age": 21, "weight": 40 },
        { "age": 22, "weight": 30 },
        { "age": 23, "weight": 20 },
        { "age": 24, "weight": 15 },
        { "age": 25, "weight": 10 },
        { "age": 26, "weight": 5 },
        { "age": 27, "weight": 2 },
        { "age": 28, "weight": 1 },
        { "age": 29, "weight": 2 },
        { "age": 30, "weight": 5 },
        { "age": 31, "weight": 10 },
        { "age": 32, "weight": 15 },
        { "age": 33, "weight": 20 },
        { "age": 34, "weight": 30 },
        { "age": 35, "weight": 40 },
        { "age": 36, "weight": 50 },
        { "age": 37, "weight": 60 },
        { "age": 38, "weight": 70 },
        { "age": 39, "weight": 80 },
        { "age": 40, "weight": 85 },
        { "age": 41, "weight": 90 },
        { "age": 42, "weight": 95 },
        { "age": 43, "weight": 100 },
        { "age": 44, "weight": 95 },
        { "age": 45, "weight": 90 },
        { "age": 46, "weight": 85 },
        { "age": 47, "weight": 80 },
        { "age": 48, "weight": 75 },
        { "age": 49, "weight": 70 },
        { "age": 50, "weight": 65 },
        { "age": 51, "weight": 60 },
        { "age": 52, "weight": 55 },
        { "age": 53, "weight": 50 },
        { "age": 54, "weight": 45 },
        { "age": 55, "weight": 40 },
        { "age": 56, "weight": 35 },
        { "age": 57, "weight": 30 },
        { "age": 58, "weight": 25 },
        { "age": 59, "weight": 20 },
        { "age": 60, "weight": 15 },
        { "age": 61, "weight": 10 },
        { "age": 62, "weight": 5 },
        { "age": 63, "weight": 2 },
        { "age": 64, "weight": 1 },
        { "age": 65, "weight": 0 },
        { "age": 66, "weight": 0 },
        { "age": 67, "weight": 0 },
        { "age": 68, "weight": 0 },
        { "age": 69, "weight": 0 },
        { "age": 70, "weight": 0 },
        { "age": 71, "weight": 0 },
        { "age": 72, "weight": 0 },
        { "age": 73, "weight": 0 },
        { "age": 74, "weight": 0 },
        { "age": 75, "weight": 0 },
        { "age": 76, "weight": 0 },
        { "age": 77, "weight": 0 },
        { "age": 78, "weight": 0 },
        { "age": 79, "weight": 0 },
        { "age": 80, "weight": 0 },
        { "age": 81, "weight": 0 },
        { "age": 82, "weight": 0 },
        { "age": 83, "weight": 0 },
        { "age": 84, "weight": 0 },
        { "age": 85, "weight": 0 },
        { "age": 86, "weight": 0 },
        { "age": 87, "weight": 0 },
        { "age": 88, "weight": 0 },
        { "age": 89, "weight": 0 },
        { "age": 90, "weight": 0 },
        { "age": 91, "weight": 0 },
        { "age": 92, "weight": 0 },
        { "age": 93, "weight": 0 },
        { "age": 94, "weight": 0 },
        { "age": 95, "weight": 0 },
        { "age": 96, "weight": 0 },
        { "age": 97, "weight": 0 },
        { "age": 98, "weight": 0 },
        { "age": 99, "weight": 0 }
      ],
      styles: [
        "Gothic",
        "Victorian",
        "Roman",
        "German",
        "Brutalist",
        "Rustic"
      ],
      selectedSmell: "",
      races: [],
      newRace: {
        race: "",
        weight: 0,
        raceLifespan: 0,
        raceMinimum: 0,
      },
    };
  },
  components: {},
  methods: {
    async generateNewTavern() {
      this.generating = true;

      this.chatgptPreprocessor();
      // this.generateTheming();
      console.log("KEY= " + process.env.OPENAI_API_KEY);
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
            content: `Tavern: Generate a ${this.setting} tavern with the list of parameters and the following caveats of each parameter this tavern also has some unique properties so please keep those in mind when generating this tavern, this tavern smells of ${this.selectedSmell}

Name - Name of said tavern (Caveat: no animal related names including mythical creatures)
Size - Amount of people in the tavern (Caveat: come up with a random number 5 - 40)
Quality - Quality of said tavern (Caveat: scale from 1 - 10 on cleanliness and 1 - 10 drinks)
Bartender - Name of this tavern's bartender (Caveat: Use ${this.selectedName} names as inspiration. Give a first and last name. Followed by a phonetic spelling. This bartenders gender is ${this.pickedGender})

Return as a JSON object using this framework as a response
{
"Name": "",
  "Size": 0,
  "Quality": {
"Cleanliness": 0,
"Drinks": 0
}
  "Bartender": {
    "Name": {
"bartenderName":"",
"phoneticSpelling":""
}
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

      this.tavern = JSON.parse(response.choices[0].message.content);

      console.log(response.choices[0].message.content);
      this.chatgptPostprocessor();


      //this.$store.commit("ADD_TAVERN", tavernInfo);

      this.taverns.push(this.tavern);
      let tavernsString = JSON.stringify(this.taverns);
      localStorage.setItem("taverns", tavernsString);

      this.generating = false;



    },
    chatTester() {
      this.chatgptPreprocessor();
      this.tavern = {
        "Name": "Good Drinks",
        "Size": 40,
        "Quality": {
          "Cleanliness": 8,
          "Drinks": 7
        },
        "Bartender": {
          "Name": {
            "bartenderName": "Johnathan",
            "phoneticSpelling": "See Above"
          },
          "Age": 0
        }
      };
      this.chatgptPostprocessor();
    },
    chatgptPreprocessor() {
      let smellNumber = Math.floor(Math.random() * this.tavernSmells.length);
      this.selectedSmell = this.tavernSmells[smellNumber];

      this.selectedName = this.pickNaming();

      this.pickedGender = this.pickGender().gender;

      this.pickedRace = this.pickWeightedRace();
      console.log(JSON.stringify(this.pickedRace.raceLifespan) + " " + JSON.stringify(this.pickedRace.race));


    },
    chatgptPostprocessor() {

      let bartenderRace = this.pickedRace.race;
      this.tavern.Bartender.Race = bartenderRace;

      this.tavern.Bartender.Gender = this.pickedGender;

      this.selectBartenderAge();
      console.log(this.tavern.Bartender.Age);
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
    pickBartenderAgePercentile() {
      let agesTotal = 0;
      for (let i = 0; i < this.agePercentiles.length; i++) {
        agesTotal += this.agePercentiles[i].weight;
      }

      const agesThreshold = Math.floor(Math.random() * agesTotal);

      agesTotal = 0;
      for (let i = 0; i < this.agePercentiles.length - 1; i++) {
        agesTotal += this.agePercentiles[i].weight;

        if (agesTotal >= agesThreshold) {
          return this.agePercentiles[i];
        }
      }
      return this.agePercentiles[this.agePercentiles.length - 1];
    },
    selectBartenderAge() {
      let agePercentile = this.pickBartenderAgePercentile();
      console.log(this.tavern.Bartender.Age);
      this.tavern.Bartender.Age = Math.floor((this.pickedRace.raceLifespan - this.pickedRace.raceMinimum) * (agePercentile.age / 100)) + this.pickedRace.raceMinimum;
    },
    pickNaming() {
      let nameType = Math.floor(Math.random() * this.nameTypes.length);
      return this.nameTypes[nameType];
    },
    pickGender() {
      let genderTotal = 0;
      for (let i = 0; i < this.genders.length; i++) {
        genderTotal += this.genders[i].weight;
      }
      const genderThreshold = Math.floor(Math.random() * genderTotal);

      genderTotal = 0;
      for (let i = 0; i < this.genders.length - 1; i++) {
        genderTotal += this.genders[i].weight;

        if (genderTotal >= genderThreshold) {
          return this.genders[i];
        }
      }
      return this.genders[this.genders.length - 1];
    },
    addRace() {
      if (this.newRace.race == "") {
        return;
      }
      let newRaceCopy = {};
      newRaceCopy.race = this.newRace.race;
      newRaceCopy.weight = this.newRace.weight;
      newRaceCopy.raceLifespan = this.newRace.raceLifespan;
      newRaceCopy.raceMinimum = this.newRace.raceMinimum;
      this.races.push(newRaceCopy);
      this.newRace.race = "";
      this.newRace.weight = 0;
      this.newRace.raceLifespan = 0;
      this.newRace.raceMinimum = 0;
      this.addToLocalStorage();
    },
    removeRace(index) {
      console.log("Remove Race " + index);
      this.races.splice(index, 1);
      this.addToLocalStorage();
    },
    removeTavern(index) {
      console.log("Remove Tavern" + index);
      this.taverns.splice(index, 1);
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
    handleLifespanChange(index) {
      console.log(`Handling race lifespan change for idx ${index}`);
      let lifespanElem = document.getElementById("lifespan_" + index);
      if (isNaN(parseInt(lifespanElem.innerText))) {
        lifespanElem.innerText = this.races[index].raceLifespan;
      }
      else {
        this.races[index].raceLifespan = parseInt(lifespanElem.innerText);
        this.addToLocalStorage();
      }
    },
    handleMinimumChange(index) {
      console.log(`Handing race minimum change for idx ${index}`);
      let minimumElem = document.getElementById("minimum_" + index);
      if (isNaN(parseInt(minimumElem.innerText))) {
        minimumElem.innerText = this.races[index].raceMinimum;
      }
      else {
        this.races[index].raceMinimum = parseInt(minimumElem.innerText);
        this.addToLocalStorage();
      }
    },
    addToLocalStorage() {
      let racesString = JSON.stringify(this.races);
      localStorage.setItem("races", racesString);
      let tavernsString = JSON.stringify(this.taverns);
      localStorage.setItem("taverns", tavernsString);
    },
  },
  created() {
    if (!localStorage.getItem("races")) {
      //no races then saet to default
      this.races = [
        {
          race: "human",
          weight: 50,
          raceLifespan: 100,
          raceMinimum: 16,
        },
        {
          race: "elf",
          weight: 20,
          raceLifespan: 700,
          raceMinimum: 16,
        },
        {
          race: "dwarf",
          weight: 12,
          raceLifespan: 500,
          raceMinimum: 16,
        },
        {
          race: "dragonborn",
          weight: 14,
          raceLifespan: 120,
          raceMinimum: 16,
        },
      ];
    }
    else {
      let racesString = localStorage.getItem("races");
      this.races = JSON.parse(racesString);
    }

    if (!localStorage.getItem("taverns")) {
      this.taverns = [];
    }
    else {
      let tavernsString = localStorage.getItem("taverns");
      this.taverns = JSON.parse(tavernsString);
    }
  },
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

.previousTaverns {
  display: flex;
  flex-direction: column;
}

.taverns {
  margin: 14px;
  padding: 8px;
  background-color: #F0F0F0;
  color: #171717;
  width: 40%;
}
</style>
