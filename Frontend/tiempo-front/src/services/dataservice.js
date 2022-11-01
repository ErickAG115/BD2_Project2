import axios from "axios"

const url = 'http://localhost:3000/mariaDB/example';

export default {
  async getEvents() {
    let res = await axios.get("http://localhost:3000/mariaDB/example");
    return res.data;
  },
  async getEventSingle(eventId) {
    let res = await axios.get("http://localhost:3000/mariaDB/example").then(function(response){
      return response.data;
    });
    return res;
  }
}