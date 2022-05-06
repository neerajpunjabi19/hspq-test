<template>
    <div class='test-selection-container'>
        <div class="options-text"> 
            <div class="label-div"> Select a test to continue:</div>
            <div style="width: 30%; margin: 0 auto; padding: 30px">
                <div v-for="test in tests" :key="test" style="width: max-content; margin-top: 20px"
                class='spread-options'> 
                    <label class="wrapper flex items-center">
                        {{ test }}
                        <input class="checkbox" type="radio"
                            :value="test"
                            v-model="selectedTest"/>
                        <span class="checkmark-radio"></span>
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            selectedTest: ''
        }
    },
    watch: {
        selectedTest(newVal) {
            this.$emit('on-test-select', newVal);
        }
    },
    props: ['tests']
}
</script>
<style scoped>
.test-selection-container {
    margin: 0 auto;
    width: 30%;
}
</style>