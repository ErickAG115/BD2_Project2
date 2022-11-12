<template>
  <div class="home">
    <h1>{{event}}</h1>   
  </div>
</template>

<script>
import EventService from '@/services/dataservice.js';

import axios from "axios";

const url = 'http://localhost:3000/mariaDB/example';

export default {
  name: 'Home',
  data() {
    // NEW - initialize the event object
    return {
      event: []
    }
  },
  created() {
    //this.getEventSingle(); // NEW - call getEventData() when the instance is created
  },
  // NEW
  mounted() {
    axios.get("http://localhost:3000/mariaDB/example").then((response)=>{
     this.event=response.data;
    });
    console.log(this.event);
  
  }
}

</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>
