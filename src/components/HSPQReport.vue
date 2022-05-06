<template>
    <div style="margin: 20px; padding: 20px; border: 1px solid">
        <div style="display: flex;">
            <div style="font-weight: bold; margin-right: 10px"> Student Name: </div> 
            <div> {{ studentReportDetail.name }} </div>
        </div>
        <div style="display: flex">
            <div style="font-weight: bold; margin-right: 10px"> Marks Obtained in HSPQ Test: </div>
            <div> <b> {{ studentReportDetail.hspq.marks }} </b> </div>
        </div>
          <!--<div style="margin-left: 20px" v-if="showButtons"> 
            <button @click="downloadResultsPDF(index)" > Download Report </button>
          </div> -->
        <h2> HSPQ Test Report</h2>
        <vuetable ref="vuetable"
          :fields="hspqTableHeaders"
          :api-mode="false"
          :data="dataCollections"
          style="margin: 0 auto; width: 50%"
        ></vuetable>    
        <div style="display: flex; width: 100%"> 
          <div style="width: 30%">
            <div style="height: 4px">  </div>
            <div class="desc-header"> 
              <div class="pad-5">Low Score Descriptions (-) 
              </div> 
            </div>
            <div style="height: 11px">  </div>
            <div class="desc-text"> Reserved, impersonal, detached, formal, and aloof </div>
            <div class="desc-text"> Concrete thinking (less-intelligent) </div>
            <div class="desc-text"> Affected by feelings, emotionally less stable, easily annoyed.</div>
            <div class="desc-text"> Phlegmatic, Undemonstrative, deliberate, placid, inactive.</div>
            <div class="desc-text"> Submissive, Humble, mild, easily led, accommodating. </div>
            <div class="desc-text"> Sober, Restrained, prudent, taciturn, serious.</div>
            <div class="desc-text"> Expedient, Disregards rules, self indulgent.</div>
            <div class="desc-text"> Shy, Sensitive, timid, hesitant, intimidated. </div>
            <div class="desc-text"> Tough-minded, Self-reliant, tough, realistic, expects little.</div>
            <div class="desc-text"> Vigorous, Goes readily with group, zestful, likes attention </div>
            <div class="desc-text"> Self-assured, Secure, feels free of guilt, untroubled, Self-satisfied.</div>
            <div class="desc-text"> Group-oriented, A joiner and Sound follower. </div>
            <div class="desc-text"> Undisciplined; self-conflict,careless of social rules, follows own urges. </div>
            <div class="desc-text"> Relaxed, composed. </div>


          </div>
          <div style="width: 40%">
            <LineChart :labels="labels" :data="data" label="Sten Scores"/>       
          </div>
          <div style="width: 30%">
            <div style="height: 4px">  </div>
            <div class="desc-header"> 
              <div class="pad-5"> High Score Descriptions (+) 
              </div>
            </div>
            <div style="height: 11px">  </div>
            <div class="desc-text"> Outgoing, Warmhearted, easygoing, participating </div>
            <div class="desc-text"> Abstract thinking, bright </div>
            <div class="desc-text"> Emotionally stable, faces  reality, calm</div>
            <div class="desc-text"> Excitable, impatient, demanding</div>
            <div class="desc-text"> Independent, aggressive, stubborn </div>
            <div class="desc-text"> Happy go lucky, impulsive, lively, enthusiastic.</div>
            <div class="desc-text"> Conscientious, preserving, rule bound.</div>
            <div class="desc-text"> Venturesome, socially bold, inhibited spontaneous. </div>
            <div class="desc-text"> Tender minded, dependent, overprotective, sensitive.</div>
            <div class="desc-text"> Doubting obstructive, individualistic, inhibited, reflective, unwillingness to act. </div>
            <div class="desc-text"> Apprehensive, worrying, depressive, trouble, serene</div>
            <div class="desc-text"> Self sufficient, prefers own decisions, resourcefulness </div>
            <div class="desc-text"> Controlled, socially precise, self disciplined, compulsive </div>
            <div class="desc-text"> Tense, frustrated, driven, overwrough </div>
          </div>
        </div>
    </div>
</template>

<script>
import { sum, keys } from 'lodash';
import Vuetable from 'vuetable-2'
import LineChart from './LineChart.vue'

export default {
  name: 'HSPQReport',
  data() {
    return {
      expanded: this.showExpanded,
      hspqTableHeaders: [
        {
          name: 'factor',
          title: 'Factor',
          width: "15%"
        }, 
        {
          name: 'rawScore',
          title: 'Raw Score',
          width: "15%"
        },
        {
          name: 'stenScore',
          title: 'Sten Score',
          width: "15%"
        }
        ],
        tableCss: {
          tableWrapper: '',
          tableHeaderClass: 'fixed',
          tableBodyClass: 'vuetable-semantic-no-top fixed',
          tableClass: 'ui blue selectable unstackable celled table',
          loadingClass: 'loading',
          ascendingIcon: 'blue chevron up icon',
          descendingIcon: 'blue chevron down icon',
          ascendingClass: 'sorted-asc',
          descendingClass: 'sorted-desc',
          sortableIcon: 'grey sort icon',
          handleIcon: 'grey sidebar icon',
        },
      chartData: {
        labels: [ 'January', 'February', 'March' ],
        datasets: [ { data: [40, 20, 12] } ]
      },
      options: {
        responsive: true, 
        maintainAspectRatio: false,
        indexAxes: 'y',
        scales: {
            xAxes: [{
                ticks: {
                    beginAtZero: true,
                    max: 100,
                }
            }]
        }
      }
    };
  },
  computed: {
    likeGroups() {
      return this.studentReportDetail.interestInventory.find(section => section.sectionName === 'Likes / Dislikes').likeGroups;
    },
    dataCollections() {
      let dataCollections = [];
      let hspqKeys = keys(this.studentReportDetail.hspq);
      hspqKeys.forEach(key => {
          let dataCollection = {};
          dataCollection.factor = key;
          dataCollection.rawScore = this.studentReportDetail.hspq[key].rawScore;
          dataCollection.stenScore = this.studentReportDetail.hspq[key].stenScore;
          dataCollections.push(dataCollection);
      });
      
      return dataCollections;
    },
    labels() {
      return this.dataCollections.map(dataCollection => dataCollection['factor']);
    },
    data() {
      return this.dataCollections.map(dataCollection => dataCollection['stenScore']);
    },
    barData() {
      return {
        labels: this.barLabels,
        datasets: [
          {
            label: 'Percentile',
            backgroundColor: this.backgroundColors,
            data: this.barValues
          }
        ]
      }
    },
    barLabels() {
      let data = this.studentReportDetail.aptitudeTest.sections.concat(this.studentReportDetail.aptitudeTest.vrna)
      return data.map(section => section.sectionName + (section.sectionPart ? ' - ' + this.getRoman(section.sectionPart) : ''));
    },
    barValues() {
      let data = this.studentReportDetail.aptitudeTest.sections.concat(this.studentReportDetail.aptitudeTest.vrna)
      return data.map(section => section.sectionPercentile);
    },
    backgroundColors() {
      let data = this.studentReportDetail.aptitudeTest.sections.concat(this.studentReportDetail.aptitudeTest.vrna)
      return data.map(sec => {
        if (sec.sectionPercentile > 95) {
          return "green";
        } else if (sec.sectionPercentile > 85) {
          return "blue";
        } else if (sec.sectionPercentile > 70) {
          return "violet";
        } else if (sec.sectionPercentile > 40) {
          return "orange";
        } else if (sec.sectionPercentile > 25) {
          return "yellow";
        } else if (sec.sectionPercentile > 15) {
          return "indigo";
        } else {
          return "red";
        }
      })
    }
  },
  watch: {
    showExpanded() {
      this.expanded = this.showExpanded;
    }
  },
  components: {
    Vuetable,
    LineChart
  },
  props: ['studentReportDetail'],
  mounted() {
    
  },
  methods: {
    sum,
    expand() {
      this.expanded = true;
    },
    collapse() {
      this.expanded = false;
    },
    getRoman(number) {
      switch(number) {
        case 1:
          return 'I';
        case 2:
          return 'II';
      }
    }
  }
}
</script>

<style>
.desc-text {
  font-size: 14px;
    height: 39px;
    padding: 0px;
    color: #000000;
    padding-bottom: 5px;
}

.desc-header {
  color: #000000;
  font-weight: bold;
  font-size: 22px;
  height: 36px;
  border-bottom: 3px double;
}

.question-text {
      display: flex
  }

  .check {
    display: inline-block;
    transform: rotate(45deg);
    height: var(--height);
    width: var(--width);
    border-bottom: var(--borderWidth) solid var(--borderColor);
    border-right: var(--borderWidth) solid var(--borderColor);
  }

  :root {
    --borderWidth: 3px;
    --height: 12px;
    --width: 6px;
    --borderColor: #78b13f;
  }

  .cross {
    color: red;
    font-weight: bold
  }

  .pad-5 {
    padding: 5px;
  }
</style>