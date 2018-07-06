import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            country: 'sweden',
            city: 'stockholm',
            region: 'kungsholmen',
            weather: null
        }
    }
    componentDidMount(){
        const query = `{
                weather(country:"${this.state.country}", city:"${this.state.city}", region:"${this.state.region}"){
                    forecast {
                        times {
                            from
                            temperature,
                            symbol {
                                name
                                icon
                            }
                        }
                    }
                }
            }`;
        fetch(`http://localhost:8080/weather?query=${query}`)
            .then(r => r.json())
            .then(({data}) => {
                this.setState({weather: data.weather})
            })
    }
  render() {
      const { weather } = this.state
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Weather in { this.state.city } - { this.state.region }</h1>
        </header>
        <main>
            {weather && 
                weather.forecast.times.map((time, indx) => {
                    const from = new Date(time.from)
                    return <div className="time" style={{'backgroundImage': `url(${time.symbol.icon})`}} key={`time-${indx}`}>
                            <span>{from.toDateString()} {from.toLocaleTimeString()}</span>
                            <span>{time.symbol.name} {time.temperature}&deg;</span>
                        </div>
                })}
        </main>
      </div>
    );
  }
}

export default App;
