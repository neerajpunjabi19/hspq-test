<template>
  <div class="hello">
    <LoadingSpinner v-if="showProgress"/>
    <img width="100" height="100" alt="Vue logo" src="https://i.postimg.cc/FsPMfw0c/apti-logo.png">
    <h1>Welcome Admin</h1>
    <div v-if="errorMessage" class="error wrap">{{ errorMessage }} </div>
    <div v-if="infoMessage" class="info wrap">{{ infoMessage }} </div>
    <div class="wrap" v-if="loginSuccessful" style="margin-top: 20px; display: flex; width: fit-content">
      <div> 
        <button @click="submit" > Get Reports </button>
      </div>
    </div>
    <div class ='wrap' v-if="!loginSuccessful">
        
        <div id ='input-container' style="margin-bottom: 20px;">
          <input style="height: 30px" class="e-input" type="text" placeholder="Enter Your Email"
            v-model="email"
            :class="{'required': loginSubmitted && !email}"/>
          <span style="display: block; float: left; color: #e3165b; margin-bottom: 20px;"
            v-if="loginSubmitted && !email"> Email is required </span>
        </div>
        <div id ='input-container' style="margin-bottom: 20px;">
          <input style="height: 30px" class="e-input" type="password" placeholder="Enter Your Password"
            v-model="password"
            :class="{'required': loginSubmitted && !password}"/>
          <span style="display: block; float: left; color: #e3165b; margin-bottom: 20px;"
            v-if="loginSubmitted && !password"> Password is required </span>
        </div>
    </div>
    <div v-if="!loginSuccessful">
        <button @click="login"> Sign In </button>
    </div>

    <div v-show="resultsFetchedSuccess" style="width: 100%; margin: 0 auto;" >
        <div v-for="student in studentDetails" :key="student.id">
            <HSPQReport 
                :studentReportDetail="student"
            />
        </div>
    </div>
    <div v-if="accessDenied">
        Access Denied
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import HSPQReport from './HSPQReport';
import LoadingSpinner from "./LoadingSpinner";
import { values } from 'lodash';
import { keys } from 'lodash';
import HSPQStemScoresTable from '../hspq-stem-scores-table.json';

export default {
  name: 'AdminReports',
  data() {
    return {
      userName: '',
      email:  '',
      password: '',
      submitted: false,
      loginSubmitted: false,
      database: null,
      loginSuccessful: false,
      progress: 0,
      showExpanded: false,
      dataCollection: {
        labels: ['Correct', 'Incorrect', 'Not Answered'],
        datasets: [
          {
            backgroundColor: [
              '#41B883',
              '#E46651',
              '#00D8FF'
            ],
            data: [40, 20, 40]
          }
        ]
      },
      studentDetails: [],
      resultsFetchedSuccess: false,
      accessDenied: false,
      errorMessage: '',
      infoMessage: '',
      showProgress: false,
    };
  },
  props: {
    msg: String
  },
  components: {
    HSPQReport,
    LoadingSpinner,
  },
  computed: {
  
    responses() {
          let responses = '';
          if(this.studentDetails) {
            this.studentDetails.forEach(student => {
                responses += "<div style=\"margin: 20px; padding: 20px; border: 1px solid\">";
                responses += "<div style=\"display: flex;\">"
                responses += "<div style=\"font-weight: bold; margin-right: 10px\"> Student Roll No: </div>";
                responses += "<div>" + student.id + "</div>";
                responses += "</div>";
                responses += "<div style=\"display: flex\">";
                responses += "<div style=\"font-weight: bold; margin-right: 10px\"> Marks Obtained in Aptitude Test: </div>";
                responses += "<div>" + student.marks + "</div>";
                responses += "</div>";
                responses += "</div>";
            });
          }
          return responses;
      }
  },
  mounted() {
    this.database = firebase.database();
  },
  methods: {
    login() {
      this.loginSubmitted = true;
      this.errorMessage = false;
      if (this.email && this.password) {
        this.showProgress = true;
        firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(() => {
              this.loginSuccessful = true;
              this.showProgress = false;
          })
          .catch(error => {
              this.errorMessage = error.message;
              this.showProgress = false;
          });
      }
    },
    submit () {
      const dbRef = firebase.database().ref();
      this.errorMessage = '';
      this.infoMessage = ''
      this.showProgress = true;
      dbRef.child("students").get()
        .then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                this.resultsFetchedSuccess = true;
                this.studentDetails = values(snapshot.val());
                this.calculateHSPQScores();
            } else {
                this.infoMessage = "No student report available at this moment" 
            }
            this.showProgress = false;
        }).
        catch((error) => {
           this.errorMessage = error.message;
           this.showProgress = false;
        });
    },
    calculateHSPQScores() {
      this.studentDetails.forEach(studentReportDetail => {
        let gender = studentReportDetail.gender;
        const hspqKeys = keys(studentReportDetail.hspq);
        hspqKeys.forEach(key => {
          const rawScore = studentReportDetail.hspq[key];
          const stenScore = this.calculateStemScore(key, rawScore, gender);
          studentReportDetail.hspq[key] = {
            rawScore,
            stenScore
          }
        });
      });
      console.log(this.studentDetails);
    },
    calculateStemScore(factorKey, rawScore, gender) {
      let currentFactor = HSPQStemScoresTable.factors.find(
          factorStenScores => factorStenScores.factor === factorKey);
      if (gender === 'Boy') {
        return this.calculatePercentile(
          rawScore, currentFactor.stenScores[0], currentFactor.marksValues[0])
      } else if (gender === 'Girl') {
        return this.calculatePercentile(
          rawScore, currentFactor.stenScores[1], currentFactor.marksValues[1])
      }
    }, 
    calculatePercentile(marks, percentileValues, marksValues) {
      let index = marksValues.findIndex(val => {
        if(val) {
          let valSplit = val.split('-');
          if (valSplit.length === 2) {
            let left = Number(valSplit[0]);
            let right = Number(valSplit[1]);
            return marks >= left && marks <= right;
          } else if(valSplit.length === 1) {
            let value = Number(val);
            return value === Math.round(marks);
          }
        } else {
          return false;
        }
      });
      if (index !== -1) {
        return percentileValues[index];
      } else {
        return 0;
      }
    }   
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-vue-inputs/styles/material.css";

.hello {
  margin-top: 60px
}
.wrap {
  box-sizing: border-box;
  margin: 0 auto;
  padding: 20px 10px;
  width: 340px;
}

#input-container .e-input-group {
  margin: 30px 0;
}

.e-input-group-icon:before {
  font-family: e-icons;
}

.e-input-group .e-input-group-icon.e-input-popup-date {
  font-size:16px;
}

.e-input-group.e-small .e-input-group-icon.e-input-popup-date {
  font-size:14px;
}

.e-input-group-icon.e-input-popup-date:before {
  content: "\e901";
}

input.e-input, textarea.e-input, .e-input-group, .e-input-group.e-control-wrapper {
  font-family: "Roboto", "Segoe UI", "GeezaPro", "DejaVu Serif", "sans-serif", "-apple-system", "BlinkMacSystemFont";
  font-size: 18px;
  font-weight: 400;
}

h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.required {
  border-bottom: 2px solid #e3165b;
}

.firebaseui-label {
    margin-right: 20px
}
</style>
