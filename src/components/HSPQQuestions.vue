<template>
<div>
    <h3> Welcome  {{ student.name }} </h3> 
    <modal name="my-first-modal">
      <div style="padding-bottom: 2%"> 
        <b> Complete Test </b>
        <hr />
      </div>
      <div style="padding-bottom: 2%"> 
        This action cannot be undone. Are you sure you want to complete this test?
      </div>
      <div>
        <div style="float:right; margin: 10px">
          <button @click="completeTest"> Complete Test </button>
        </div>
        <div style="float:right; margin: 10px">
          <button @click="hide" style="background-color: white; color: black; border: 1px solid"> 
            Cancel
          </button>
        </div>
      </div>
    </modal>
    <div style="display: flex;">
        <div v-for="colIndex in 7" :key="colIndex" style="margin-right: 36px"
        :class="{ 'margin-top-1-row' : colIndex !== 1} ">
            <div style="margin-bottom: 8px"> 
                Page {{ colIndex }} 
            </div>
            <div v-for="(question, i) in questionsColumned[colIndex]" :key="i">
                <HSPQQuestion :question="question" 
                :class="{'margin-top-1-row': question.questionNumber % 5 === 0}"  
                style="margin-bottom: 8px"/> 
            </div>
        </div>
    </div>
    <div style="float:middle; margin: 10px">
      <button @click="onCompleteTest"> Complete Test </button>
    </div>
</div>
</template>
<script>
import HSPQQuestion from './HSPQQuestion.vue'
import HSPQQuestions from '../hspq.json'
import HSPQSections from '../hspq-sections.json'
import { keyBy, keys, slice } from 'lodash'
import firebase from "firebase/app";
import "firebase/database";
export default {
  data() {
      return {
          questions: HSPQQuestions,
          defaultQuestionsPerCol: 20,
          user: {

          },
          student: {

          }
      }
  },
  computed: {
      questionsColumned() {
          let colQuest = {};
          let range = 0;
          let currentQuestion = 0;
          for (let colIndex = 1 ; colIndex <= 7; colIndex++) {
            if(colIndex === 1 || colIndex === 7) {
                range = this.defaultQuestionsPerCol + 1;
            } else {
                range = this.defaultQuestionsPerCol;
            }
            colQuest[colIndex] = slice(this.questions, currentQuestion, currentQuestion + range);
            currentQuestion = currentQuestion + range;
          }
          return colQuest;
      }
  },
  mounted() {
    this.user = this.$route.params.user;
    this.student = this.$route.params.student;
    if (!this.user) {
      this.$router.push({ name: 'home' });
    }
  },
  beforeRouteLeave(to, from, next) {
    if(to.name === 'thank-you') {
      next(true);
    } else if (!this.user && to.name === 'home') {
      next(true);
    } else {
      next(false);
    }
  },
  methods: {
    show () {
      this.$modal.show('my-first-modal');
    },
    hide () {
      this.$modal.hide('my-first-modal');
    },
    onCompleteTest() {
      this.show();
    },
    completeTest() {
        this.hide();
        let scores = {};
        let count = [];
        let yourAnswersKeyMap = keyBy(this.questions, 'questionNumber'); 
        let hspqSectionKeys = keys(HSPQSections);
        hspqSectionKeys.forEach(key => {
            let hspqSection = HSPQSections[key];
            let sectionQuestionNumbers = keys(hspqSection);
            (sectionQuestionNumbers).forEach(questionNumber => {
            count[questionNumber] = (count[questionNumber] || 0) + 1;
            });
        });
        for(let i = 1 ; i <= 142; i ++) {
            if(count[i] === undefined) {
                console.log(i)
            }
        }
        console.log(count);
        hspqSectionKeys.forEach(key => {
            let total = 0;
            let hspqSection = HSPQSections[key];
            let sectionQuestionNumbers = keys(hspqSection);
            (sectionQuestionNumbers).forEach(questionNumber => {
                let hspqSectionQuestionMeta = hspqSection[questionNumber];
                let yourAnswerToQuestion = yourAnswersKeyMap[questionNumber];
                if (hspqSectionQuestionMeta[yourAnswerToQuestion.questionYourAnswer])  {
                    total += hspqSectionQuestionMeta[yourAnswerToQuestion.questionYourAnswer]
                } 
            })
            scores[key] = total
        })
        console.log(scores)
        let allResponses = {
            ...this.student,
            hspq: scores,
        }

      firebase.database().ref('students/' + this.student.name).update(allResponses)
        .then(() => {
          this.$router.push({ name: 'thank-you' });
        }).catch((error) => {
          this.errorMessage = error.message;
        });
          this.$router.push({ name: 'thank-you' });
      }
  },
  components: { HSPQQuestion }
}
</script>
<style scoped>
.margin-top-1-row {
    margin-top:44px;
}
</style>