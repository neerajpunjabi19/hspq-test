<template>
    <div style="margin: 20px; padding: 20px; border: 1px solid">
        <div style="display: flex;">
            <div style="font-weight: bold; margin-right: 10px"> Student Name: </div> 
            <div> {{ studentReportDetail.name }} </div>
        </div>
        <div style="display: flex">
            <div style="font-weight: bold; margin-right: 10px"> Marks Obtained in Aptitude Test: </div>
            <div> <b> {{ studentReportDetail.aptitudeTest.marks }} </b> out of <b> {{ studentReportDetail.aptitudeTest.totalQuestions }} </b> </div>
        </div>
        <div class="wrap" style="margin-top: 20px; display: flex; width: fit-content">
          <div v-if="showButtons && !expanded"> 
            <button @click="expanded = true" > Show Individual Section Report </button>
          </div>
          <div v-if="showButtons && expanded">
              <button @click="expanded = false"> Hide Individual Section Report </button>
          </div>
          <!--<div style="margin-left: 20px" v-if="showButtons"> 
            <button @click="downloadResultsPDF(index)" > Download Report </button>
          </div> -->
        </div>
                  <h2> Aptitude Test Report</h2>
        <vuetable ref="vuetable"
          :fields="percentileTableHeaders"
          :api-mode="false"
          :data="dataCollections"
        ></vuetable>
                          <h2> Interest Inventory Report</h2>

        <vuetable ref="vuetable2"
          :fields="interestInventoryHeaders"
          :api-mode="false"
          :data="likeGroups"
        ></vuetable>
        <div class="html2pdf__page-break"/> 
        <div v-if="false" style="margin-left: 7%; display: flex; flex-wrap: wrap"> 
            <div v-for="(dataCollection, i) in dataCollections" 
                :key="i"
                style="width: 27%; margin-right: 50px; margin-top: 30px; ">
                <div>
                    <div style="text-align: center; font-size: 20px"> 
                        <b> {{ dataCollection.sectionName + (dataCollection.sectionPart ? ' - ' + getRoman(dataCollection.sectionPart) : '') }}</b>
                    </div>
                    <div style="text-align: center; font-size: 18px; margin-top: 20px"> 
                        <b> Marks: {{ dataCollection.sectionMarks }} </b> out of <b>{{ sum(dataCollection.dataCollection.datasets[0].data) }}  </b>
                    </div>
                    <div style="text-align: center; font-size: 18px; margin-top: 20px">  
                        <b> Right: </b> {{ dataCollection.dataCollection.datasets[0].data[0] }}
                    </div>
                    <div style="text-align: center; font-size: 18px"> 
                        <b> Wrong: </b> {{ dataCollection.dataCollection.datasets[0].data[1] }}
                    </div>
                    <div style="text-align: center; font-size: 18px; margin-top: 20px"> 
                        <b> Formula: </b> {{ dataCollection.sectionFormula }}
                    </div>
                    <div style="text-align: center; font-size: 18px"> 
                        <b> Percentile: </b> {{ dataCollection.sectionPercentile }}
                    </div>
                </div>
            </div>
        </div>
        <div v-if="expanded"> 
          <div v-for="section in studentReportDetail.aptitudeTest.sections" :key="section.sectionName + (section.sectionPart ? ' ' + section.sectionPart : '')">
            <h3 style="text-align:center">
                <b> {{ section.sectionName + (section.sectionPart ? ' - ' + getRoman(section.sectionPart) : '') }}</b>
            </h3>
            <div style="display: flex">
              <div style="width: 25%; font-weight: bold;">
                Q No.
              </div>
              <div style="width: 25%; font-weight: bold;">
                Right Answer
              </div>
              <div style="width: 25%; font-weight: bold;">
                Your Answer
              </div>
              <div style="width: 25%; font-weight: bold;">
                Result
              </div>
            </div>
            <div v-for="question in section.sectionQuestions" :key="question.questionNumber"
                style="margin-top: 10px">
                <div v-if="question.questionNumber === 32 
                  || question.questionNumber === 69" class="html2pdf__page-break"/>
                <div style="display: flex">
                  <div style="width: 25%">
                    {{ question.questionNumber }}
                  </div>
                  <div style="width: 25%">
                    {{ question.questionCorrectAnswer }}
                  </div>
                  <div style="width: 25%">
                    {{ question.questionYourAnswer }}
                  </div>
                  <div style="width: 25%" v-if="question.questionYourAnswer === question.questionCorrectAnswer">  
                    <div class="check"  />
                  </div>
                  <div style="width: 25%" class="cross" v-if="question.questionYourAnswer && question.questionYourAnswer !== question.questionCorrectAnswer">X</div>
                </div>
            </div>
            <div style="display: flex; margin-top: 20px">
              <div style="width: 75%; font-weight: bold; text-align: right">
                Total:
              </div>
              <div style="width: 25%">
                {{ section.sectionMarks }}  out of  {{ section.totalRight + section.totalWrong + section.totalUnanswered }}
              </div>
            </div>
            <!-- <div class="html2pdf__page-break"/> -->
          </div>
          <h2> Interest Inventory </h2>
          <div style="margin-top: 20px" v-for="(section, sectionIndex) in studentReportDetail.interestInventory" :key="sectionIndex">
            <h3 style="text-align:center">
                <b> {{ section.sectionName }}</b>
            </h3>
            <div style="margin-top: 20px" v-for="(question, index) in section.sectionQuestions" :key="index">
              <div class="question-text"> 
                  <div style="width: 5%; text-align: left"> {{ question.questionNumber }}.</div>
                  <div style="text-align: left" v-html="question.questionText"> 
                  </div>
              </div>
              <div style="text-align: left; margin-top: 2%; display: flex"> 
                <div style="width: 5%"> </div>
                <div> <b> {{ question.questionAnswer}} </b> </div>
              </div>
            </div>
            <!-- <div v-if="sectionIndex < 2" class="html2pdf__page-break"/> -->
          </div>
        </div>
    </div>
</template>

<script>
import { sum } from 'lodash';
import Vuetable from 'vuetable-2'

export default {
  name: 'StudentReport',
  data() {
    return {
      expanded: this.showExpanded,
      options: {
        responsive: true, 
        maintainAspectRatio: false 
      },
      percentileTableHeaders: [
        {
          name: 'sectionName',
          title: 'Section Name',
          width: "20%"
        }, 
        {
          name: 'sectionPart',
          title: 'Part',
          width: "5%"
        },
        {
          name: 'sectionMarks',
          title: 'Marks',
          width: "8%"
        },
        {
          name: 'totalQuestions',
          title: 'Total Questions',
          width: "15%"
        },
        {
          name: 'totalRight',
          title: 'Right',
          width: "8%"
        },
        {
          name: 'totalWrong',
          title: 'Wrong',
          width: "8"
        },
        {
          name: 'totalUnanswered',
          title: 'Unanswered',
          width: "8%"
        },
        {
          name: 'sectionFormula',
          title: 'Formula',
          width: "15%"
        },
        {
          name: 'sectionPercentile',
          title: 'Percentile',
          width: "10%"
        }],
      interestInventoryHeaders: [
        {
          name: 'interestArea',
          title: 'Interest Area',
          width: "20%"
        }, 
        {
          name: 'questionsLikes',
          title: 'Questions',
          width: "70%"
        },
        {
          name: 'count',
          title: 'Count',
          width: "10%"
        }],
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
      optionsBar: {
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
      this.studentReportDetail.aptitudeTest.sections.forEach(section => {
          let dataCollection = {};
          dataCollection.sectionName = section.sectionName;
          dataCollection.sectionPart = section.sectionPart;
          dataCollection.sectionMarks = section.sectionMarks;
          dataCollection.totalQuestions = section.totalQuestions;
          dataCollection.sectionFormula = section.sectionFormula;
          dataCollection.sectionPercentile = section.sectionPercentile;
          dataCollection.totalRight = section.totalRight;
          dataCollection.totalWrong = section.totalWrong;
          dataCollection.totalUnanswered = section.totalUnanswered;

          dataCollection.dataCollection = {
            labels: ['Right', 'Wrong', ''],
            datasets: [
              {
                backgroundColor: [
                  'green',
                  'red',
                  'orange'
                ],
                data: [section.totalRight, section.totalWrong, section.totalUnanswered]
              }
            ]
          };
          dataCollections.push(dataCollection);
      });
      
      return dataCollections;
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
    Vuetable
  },
  props: ['studentReportDetail', 'showExpanded', 'downloadResultsPDF', 'index', "showButtons"],
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
</style>