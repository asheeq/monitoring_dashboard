import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import {Line} from 'react-chartjs-2';
import './App.css';

const client = new W3CWebSocket('ws://127.0.0.1:8765');
console.log(client);

// If Max is greater than 10^7 -> Display in Mb
// If Max is greater than 10^4 -> Display in Kb
// Else display in bytes

class App extends Component {

  constructor() {
    super()
    this.state = {
      stats: {
        Received: [],
        Transmitted: [],
        Ip: null
      }
    }
    //this.calculateBandwidth = this.calculateBandwidth.bind(this)
  }

  componentDidMount() {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      const {Received, Transmitted, Ip} = JSON.parse(message.data);
      const stats = {...this.state.stats};
      stats.Received = [...stats.Received];
      stats.Transmitted = [...stats.Transmitted];
      stats.Received.push(Received);
      stats.Transmitted.push(Transmitted);
      stats.Ip = Ip;
      this.setState({stats: stats});
    };
  }
  
  calculateBandwidth = (data) => {
    console.log(data)
    if(data[data.length - 1] > 10**7){
      data[data.length - 1] = [data.length - 1] / 10**7;
      return data
    }
    else if(data[data.length - 1]> 10**4){
      data[data.length - 1] = [data.length - 1] / 10**4;
      return data
    }
    return data;
  }
  
  render() {
    const stats = this.state.stats;
    const received = {
      labels: ['Download Bandwidth'],
      datasets: [
        {
          label: stats.Ip,
          fill: false,
          lineTension: 0.5,
          borderColor: 'red',
          borderWidth: 2,
          data: this.calculateBandwidth(stats.Received)
        }
      ]
    };

    const transmitted = {
      labels: ['Upload Bandwidth'],
      datasets: [
        {
          label: stats.Ip,
          fill: false,
          lineTension: 0.5,
          borderColor: 'blue',
          borderWidth: 2,
          data: this.calculateBandwidth(stats.Transmitted)
        }
      ]
    };

    return (
      <>
        <header className="header">
            <h2>Monitoring Dashboard</h2>
        </header>
        <div className="stock-container" >
            <Line
                data={received}
                options={{
                  title:{
                    display:true,
                    text:'Download Bandwidth',
                    fontSize:20
                },
                legend:{
                    display:true,
                    position:'right'
                }
            }}
            />
            <Line
                data={transmitted}
                options={{
                  title:{
                      display:true,
                      text:'Upload Bandwidth',
                      fontSize:20
                  },
                  legend:{
                      display:true,
                      position:'right'
                  }
            }}
            />
      </div>
    </>
    );
  }
}

export default App;