<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}

button {
  background-color: rgb(0, 119, 207); /* Blue */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
}



/* Customize the label (the wrapper) */
  .wrapper {
    display: block;
    position: relative;
    padding-left: 25px;
    padding-right: 23px;
    margin-bottom: 6px;
    cursor: pointer;
    font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-size: 16px;
  }
/* Hide the browser's default radio button */
 .wrapper input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
 }
 /* Create a custom radio button */
 .checkmark-radio {
    position: absolute;
    top: 0;
    left: 0;
    height: 18px;
    width: 18px;
    border-radius: 50%;
    background-color: #eee;
    border: 1px solid #ccc;
    margin-top: -2px;
 }

 /* Create a custom checkbox */
.checkmark-checkbox {
  position: absolute;
  top: 0;
  left: 0;
  height: 18px;
  width: 18px;
  border-radius: 2px;
  background-color: #eee;
  border: 1px solid #ccc;
  margin-top: -2px;
}
 /* On mouse-over, add a grey background color */
 .wrapper:hover input ~ .checkmark-radio {
    background-color: #ccc;
 }

 .wrapper:hover input ~ .checkmark-checkbox {
    background-color: #ccc;
 }
    /* When the radio button is checked, add a blue background */
 .wrapper input:checked ~ .checkmark-radio {
    background-color: #1CD4A7;
 }

 .wrapper input:checked ~ .checkmark-checkbox {
    background-color: #1CD4A7;
 }

    /* Create the indicator (the dot/circle - hidden when not checked) */
 .checkmark-radio:after {
    content: "";
    position: absolute;
    display: none;
 }

.checkmark-checkbox:after {
    content: "";
    position: absolute;
    display: none;
 }

 /* Show the indicator (dot/circle) when checked */
 .wrapper input:checked ~ .checkmark-radio:after {
    display: block;
 }
 
 .wrapper input:checked ~ .checkmark-checkbox:after {
    display: block;
 }


/* Style the indicator (dot/circle) */
 .wrapper .checkmark-radio:after {
    top: 5px;
    left: 5px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
 }

 .wrapper .checkmark-checkbox:after {
    top: 5px;
    left: 5px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
 }

 .error {
    padding: 20px;
    color: #D8000C;
    background-color: #FFD2D2;
    margin-bottom: 20px;
 }

 .info {
    padding: 20px;
    color: #059;
    background-color: #BEF;
    margin-bottom: 20px;
 }

 .overlay {
    background-color: white;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    pointer-events: none;
    opacity: 0.5;
 }

 .loading-spinner {
    position: fixed;
    top: 40%;
    left: 47%;
 }

.loading-spinner circle {
      fill: rgb(0, 119, 207)
   }

.vm--modal {
   width: 700px !important;
   height: 200px !important;
   padding: 3%;
   text-align: left;
}

  .interest-inventory-questions-div {
      border: 1px solid black;
      height: 520px;
      width: 100%;
      overflow-y: auto;
      flex: 1
  }

  textarea:focus {
    outline: none !important;
}

.language-usage-quesn-part {
   display: flex;
    width: 20% !important;
}
</style>
