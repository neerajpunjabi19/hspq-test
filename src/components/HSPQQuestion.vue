<template>
    <div>
        <div class="options-text"> 
            <div style="display: flex; width: 100%;">
                <div class="hspq-question-number">
                    {{ question.questionNumber }}.
                </div>
                <div v-for="i in 3" :key="i">
                    <div class="hspq-option">
                        <div>
                            <label class="wrapper-hspq flex items-center">
                                <input class="checkbox" type="radio"
                                    :value="String.fromCharCode(i + 96)"
                                    v-model="question.questionYourAnswer"/>
                                <span class="checkmark-radio"></span>
                            </label>
                        </div>
                        <div style="margin-left: 10px">  {{ String.fromCharCode(i + 96) }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['question']
}
</script>
<style scoped>
.hspq-question-number {
    width: 24px;
    margin-right: 5px;
}

.hspq-option {
    margin-right: 25px
}

.wrapper-hspq {
    position: relative;
    cursor: pointer;
    font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-size: 16px;
}

.wrapper-hspq input {
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
 }

 /* On mouse-over, add a grey background color */
 .wrapper-hspq:hover input ~ .checkmark-radio {
    background-color: #ccc;
 }

 .wrapper-hspq:hover input ~ .checkmark-checkbox {
    background-color: #ccc;
 }
    /* When the radio button is checked, add a blue background */
 .wrapper-hspq input:checked ~ .checkmark-radio {
    background-color: #1CD4A7;
 }

 .wrapper-hspq input:checked ~ .checkmark-checkbox {
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
 .wrapper-hspq input:checked ~ .checkmark-radio:after {
    display: block;
 }
 
 .wrapper-hspq input:checked ~ .checkmark-checkbox:after {
    display: block;
 }


/* Style the indicator (dot/circle) */
 .wrapper-hspq .checkmark-radio:after {
    top: 5px;
    left: 5px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
 }

 .wrapper-hspq .checkmark-checkbox:after {
    top: 5px;
    left: 5px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
 }
</style>