import React, { Component } from "react";
import { Button } from "@mui/material";
import Utils from "./Utils";

class Term extends Component {
  constructor(props) {
    super(props);
    this.state = {
      termId: this.props.termId,
      term: this.props.term,
      apy: this.props.apy,
      status: false,
      temp: "",
    };
  }
  handleText = (e) => {
    e.preventDefault();
    this.setState({
      apy: e.target.value,
    });
  };
  render() {
    let changeApy =
      this.state.status === true ? (
        <input value={this.state.apy} onChange={(e) => this.handleText(e)} />
      ) : (
        <div className="termApy">{this.state.apy + "%"}</div>
      );
    let changeBtn =
      this.state.status === true ? (
        <div className="grBtn">
          <Button
            color="success"
            variant="contained"
            onClick={(e) => {
              this.props.saveApy(e, this.state);
              this.setState({
                status: false,
              });
            }}
          >
            Lưu
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={(e) => {
              e.preventDefault();
              this.setState({
                apy: this.state.temp,
                status: false,
              });
            }}
          >
            Hủy
          </Button>
        </div>
      ) : (
        <div className="grBtn">
          <Button
            variant="contained"
            onClick={(e) => {
              e.preventDefault();
              this.setState({
                status: true,
                temp: this.state.apy,
              });
            }}
          >
            Cập nhật
          </Button>
        </div>
      );
    return (
      <>
        <div key={this.state.termId} className="term">
          <div className="stt">{this.state.termId}</div>
          <div className="stt">{Utils.checkTerm(this.state.term)}</div>
          {changeApy}
          {changeBtn}
        </div>
      </>
    );
  }
}

export default Term;
