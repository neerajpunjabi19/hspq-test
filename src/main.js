import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import WelcomePage from './components/WelcomePage.vue'
import CreateUser from './components/CreateUser.vue'
import ThankYou from './components/ThankYou.vue'
import TestSelection from './components/TestSelection'
import HSPQQuestions from './components/HSPQQuestions'
import AdminReports from './components/AdminReports.vue'
import firebase from 'firebase/app';
import VueEllipseProgress from 'vue-ellipse-progress';
import VModal from 'vue-js-modal';

Vue.use(VueRouter);
Vue.use(VueEllipseProgress);
Vue.use(VModal);
Vue.config.productionTip = false

const routes = [
  { path: '/', name: 'home', component: WelcomePage },
  { path: '/thank-you', name: 'thank-you', component: ThankYou },
  { path: '/test-selection', name: 'test-selection', component: TestSelection },
  { path: '/admin-reports', name: 'admin-reports', component: AdminReports },
  { path: '/hspq', name: 'hspq', component: HSPQQuestions },
  { path: '/add-user', name: 'create-user', component: CreateUser },
];

const firebaseConfig = {
  apiKey: "AIzaSyBf9EDrc2ydQl9Y0fUtGYXEu3DfGB4vAj8",
  authDomain: "hspq-test.firebaseapp.com",
  projectId: "hspq-test",
  storageBucket: "hspq-test.appspot.com",
  messagingSenderId: "731171217115",
  appId: "1:731171217115:web:8d47efef41067c6ea336fe",
  measurementId: "G-F5QESJ2P40",
  databaseURL: "https://hspq-test-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

firebase.initializeApp(firebaseConfig);

const router = new VueRouter({
  mode: 'history',
  routes // short for `routes: routes`
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
