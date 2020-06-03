import React, { Component } from "react";
import '../App.css';
import TestDefaultValues from '../includes/TestDefaultValues.js';
import Select from 'react-select';
import { Button } from 'react-bootstrap';

class Selects extends Component {

  constructor(props) {
    super(props);

    let search = window.location.search;
    let params = new URLSearchParams(search);
    let source = params.get('source');

    this.state = {
      error: null,
      isLoaded: false,
      sourceOption: source,
      nodeoptions: [],
      destOption: "",
      sErr: false,
      dErr: false
    };

    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.handleSourceChange = this.handleSourceChange.bind(this);
    this.handleDestChange = this.handleDestChange.bind(this);
    this.handleSourceError = this.handleSourceError.bind(this);
    this.handleDestError = this.handleDestError.bind(this);
  }

  handleSourceError = () => {
    if (this.state.sourceOption === '' || this.state.sourceOption == null) {
      this.setState({
        sErr: true
      }, () => {
        this.props.addformerror('select-source');
      });
    }
    else {
      this.setState({
        sErr: false
      }, () => {
        this.props.removeformerror('select-source');
      });
    }
  }

  handleDestError = () => {
    if (this.state.destOption === '' || this.state.destOption == null) {
      this.setState({
        dErr: true
      }, () => {
        this.props.addformerror('select-dest');
      });
    }
    else {
      this.setState({
        dErr: false
      }, () => {
        this.props.removeformerror('select-dest');
      });
    }
  }

  handleToggleClick() {
    let revSource = this.state.destOption;
    let revDest = this.state.sourceOption;
    this.setState(state => ({
      sourceOption: revSource,
      destOption: revDest,
    }), async () => {
      await this.handleDestError();
      await this.handleSourceError();
      let initialSOval = '';
      if(typeof this.state.sourceOption === 'object' && this.state.sourceOption !== null) {
        initialSOval = this.state.sourceOption.value;
      }
      this.props.handleformdatachange('select-source', initialSOval);
      let initialDOval = '';
      if(typeof this.state.destOption === 'object' && this.state.destOption !== null) {
        initialDOval = this.state.destOption.value;
      }
      this.props.handleformdatachange('select-dest', initialDOval);
    });
  }

  handleDestChange = async destOption => {
    await this.setState({
      destOption
    });
    this.handleDestError();
    this.props.handleformdatachange('select-dest', destOption.value);
  };

  handleSourceChange = async sourceOption => {
    await this.setState({
      sourceOption
    });
    this.handleSourceError();
    this.props.handleformdatachange('select-source', this.state.sourceOption.value);
  };

  componentDidMount() {
    let apiurl = TestDefaultValues.apiurl_nodes;
    fetch(apiurl)
      .then(res => res.json())
      .then(
        (items) => {
          let options = items.rows.map(item => ({ label: item.name,  value: item.id}));
          options.sort(function(a, b) {
            var labelA = a.label.toUpperCase();
            var labelB = b.label.toUpperCase();
            if (labelA < labelB) {
              return -1;
            }
            if (labelA > labelB) {
              return 1;
            }
            return 0;
          });
          this.setState({
            isLoaded: true,
            nodeoptions: options,
            sourceOption: options.filter(option => option.value === this.state.sourceOption)[0]
          }, async () => {
                await this.handleDestError();
                await this.handleSourceError();
                let initialval = '';
                if(typeof this.state.sourceOption === 'object' && this.state.sourceOption !== null) {
                  initialval = this.state.sourceOption.value;
                }
                this.props.handleformdatachange('select-source', initialval);
              });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {

    const { error, isLoaded, nodeoptions, sourceOption, destOption } = this.state;
    if (error) {
      return <div>Error select</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {

      return (
          <fieldset>
            <legend>Nodes</legend>
            <div className="container">
              <div className="row">
                <div className="col-md-4">
                  Source:
                  <Select
                    placeholder="Select source end-point"
                    name= { "select-source" }
                    className= {`select-source-container ${this.state.sErr ? 'errorborder' : ''}`}
                    options= { nodeoptions }
                    onChange={this.handleSourceChange}
                    size = { 10 }
                    value= {sourceOption} />
                </div>
                <div className="col-md-4 toggle-selects">
                  <Button
                    onClick={this.handleToggleClick}
                    variant="primary">
                    Toggle choices
                  </Button>
                </div>
                <div className="col-md-4">
                  Destination:
                  <Select
                    placeholder="Select destination end-point"
                    name={"select-dest"}
                    className= {`select-dest-container ${this.state.dErr ? 'errorborder' : ''}`}
                    options= { nodeoptions }
                    onChange={this.handleDestChange}
                    value={destOption } />
                </div>
              </div>
            </div>
          </fieldset>
      );
    }
  }
}

export default Selects;
