<template>
  <div class="hello">
    <img width="100" height="100" alt="Vue logo" src="https://i.postimg.cc/FsPMfw0c/apti-logo.png">
    <LoadingSpinner v-if="showProgress"/>
    <h1>Welcome</h1>
    <div class="wrap" v-if="errorMessage" >
      <div class="error">{{ errorMessage }} </div>
    </div>
    <div class ='wrap' v-if="!loginSuccessful">
        <div id ='input-container' style="margin-bottom: 20px;">
          <input style="height: 30px" class="e-input" type="text" placeholder="Enter Your Email"
            v-model="email"
            :class="{'required': loginSubmitted && !email}"/>
          <span style="display: block; float: left; color: #e3165b; margin-bottom: 20px;"
            v-if="loginSubmitted && !email"> Email is required </span>
        </div>
        <div id ='input-container'>
          <input style="height: 30px" class="e-input" type="password" placeholder="Enter Your Password"
            v-model="password"
            :class="{'required': loginSubmitted && !password}"/>
          <span style="display: block; float: left; color: #e3165b; margin-bottom: 20px;"
            v-if="loginSubmitted && !password"> Password is required </span>
        </div>
    </div>
    <div v-if="!loginSuccessful" class="wrap">
          <button @click="login"> Sign In </button>
        </div>
    <div class ='wrap' v-if="loginSuccessful && inputDetails">
        <div class ='input-container'>
          <input style="height: 30px" class="e-input" type="text" placeholder="Enter Your Name"
            v-model="student.name"
            :class="{'required': submitted && !student.name}"/>
        </div>
        <div class ='input-container'>
          <input style="height: 30px" class="e-input" type="text" placeholder="Enter Your Roll No"
            v-model="student.rollNo"
            :class="{'required': submitted && !student.rollNo}"/>
        </div>
        <div class ='input-container'>
          <div class="options-text"> 
              <div class="label-div"> Select your grade:</div>
              <div style="display: flex; width: 100%;"
                :class="{'required': submitted && !student.grade}">
                  <div v-for="grade in grades" :key="grade" style="width: max-content"
                  class='spread-options'> 
                      <label class="wrapper flex items-center">
                          {{grade}}th
                          <input class="checkbox" type="radio"
                              :value="grade"
                              v-model="student.grade"/>
                          <span class="checkmark-radio"></span>
                      </label>
                  </div>
              </div>
          </div>
        </div>
        <div class ='input-container'>
          <div class="options-text"> 
              <div class="label-div"> Select your Gender:</div>
              <div style="display: flex; width: 100%;"
                :class="{'required': submitted && !student.gender}">
                  <div v-for="gender in genders" :key="gender" style="width: max-content"
                  class='spread-options'> 
                      <label class="wrapper flex items-center">
                          {{ gender }}
                          <input class="checkbox" type="radio"
                              :value="gender"
                              v-model="student.gender"/>
                          <span class="checkmark-radio"></span>
                      </label>
                  </div>
              </div>
          </div>
        </div>
    </div>
    
    <div v-if="inputDetails">
      <button @click="submit"> Next </button>
    </div>
    
  </div>
</template>


<script>
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import LoadingSpinner from './LoadingSpinner'
import { findKey, isNull } from 'lodash';

export default {
  name: 'WelcomePage',
  data() {
    return {
      email: '',
      password: '',
      userName: '',
      user: '',
      loginSuccessful: false,
      submitted: false,
      loginSubmitted: false,
      errorMessage: '',
      showProgress: false,
      inputDetails: false,
      testSelection: false,
      student: {
        name: null,
        rollNo: null,
        grade: null,
        gender: null
      },
      grades: [9, 10, 11, 12],
      genders: ['Boy', 'Girl'],
    };
  },
  props: {
    msg: String
  },
  mounted() {
    
  },
  components: {
    LoadingSpinner,
  },
  methods: {
    selectTest() {
      if(this.validateInputs()) {
        this.errorMessage = '';
        this.inputDetails = false;
        this.testSelection = true;
      }
    },
    onTestSelection(val) {
      this.selectedTest = val;
    },
    validateInputs() {
      if (findKey(this.student, isNull)) {
        this.errorMessage = 'Please enter all the required information.';
        return false;
      }

      const nameRegex = /^[a-zA-Z\s]*$/;
      if(!nameRegex.test(this.student.name)) {
        this.errorMessage = 'Name should contain only alphabets and spaces.';
        return false;
      }
      return true;
    },
    validateTestSelection() {
      if (this.selectedTest === '') {
        this.errorMessage = 'Please select a test.';
        return false;
      }
      return true;
    },
    submit () {
      this.submitted = true;
      this.errorMessage = '';

      if(!this.validateInputs()) {
        return;
      }

      // const dbRef = firebase.database().ref();
      
      // this.showProgress = true;
      //dbRef.child("students").child(this.student.name).get().then((snapshot) => {
      //  if (snapshot.exists()) {
      //    let existingStudent = snapshot.val();
      //    if (!existingStudent.testStarted) {
      //      firebase.database().ref('students/' + this.student.name).update({
      //        testStarted: true
      //      }).then(() => {
        
            this.$router.push({ 
              name: 'hspq', 
              params: { 
                student: this.student,
                user: this.user
              }
            });
        
        //      }).catch((error) => {
        //        this.showProgress = false;
        //        this.errorMessage = error.message;
        //      });
        //  } else {
        //    this.showProgress = false;
        //    this.errorMessage = 'The Aptitude Test was already started for this student.';
        //  }
        //} else {
        //  this.$router.push({ 
        //    name: 'section', 
        //    params: { 
        //      student: this.student,
        //      user: this.user
        //    }
        //  });
          //this.showProgress = false;
          //this.errorMessage = 'Name not found in our records. Please check the name and try again.';
      //  }
      //}).catch((error) => {
      //  this.showProgress = false;
      //  this.errorMessage = error.message;
      //});
    },
    login() {
      this.loginSubmitted = true;
      this.errorMessage = '';
      if (this.email && this.password) {
        this.showProgress = true;
        firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then((userCredential) => {
              this.loginSuccessful = true;
              this.showProgress = false;
              this.user = userCredential.user;
              this.inputDetails = true;
          })
          .catch(error => {
              this.showProgress = false;
              this.errorMessage = error.message;
          });
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

.label-div {
  float: left;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.input-container {
  margin-bottom: 20px;
}
</style>
