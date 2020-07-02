import React, { Component } from 'react';
import '../App.css';

class Countdown extends Component {

  constructor(props) {
    super(props);

    this.state = {
      seconds: Math.floor(this.props.waittime),
      waitTimer: false
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {

        if (this.state.seconds > 0) {
            this.setState(({ seconds }) => ({
                seconds: seconds - 1
            }))
        }
        else {
          clearInterval(this.interval);
          this.props.continueAction();
        }
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        Waiting for {this.state.seconds} seconds before attempting to fetch results ...
      </div>
    );
  }
}
export default Countdown;
