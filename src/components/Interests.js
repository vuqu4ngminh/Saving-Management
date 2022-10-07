import React, { Component } from "react";
import axios from "axios";
import "../css/index.css";
import Term from "./Term";
import Utils from "./Utils";
import { toast } from "react-toastify";

class Interests extends Component {
  state = {
    terms: [],
  };
  saveApy = async (e,value) => {
    e.preventDefault();
    if(value.apy === ""){
      toast.error("Không được để trống !")
      return;
    }
    if(Utils.checkIsNumber(value.apy) === false){
      toast.error("Lãi suất phải là 1 số !")
      return;
    }
    if(Number(value.apy) < 0){
      toast.error("Lãi suất phải là 1 số dương !")
      return;
    }
    let newApy = {
      term: value.term,
      apy: Number(value.apy)
    }
    await axios.put("http://localhost:8686/api/v1/updateTerms",newApy)
    await axios.put("http://localhost:8686/api/v1/updateSavings",newApy)
    toast.success("Cập nhật thành công !")
  };
  componentDidMount = async () => {
    const rows = await axios.get("http://localhost:8686/api/v1/terms");
    this.setState({
      terms: rows.data.data,
    });
  };
  render() {
    let terms = this.state.terms.map((item) => {
      return (
        <Term key={item.termId} termId={item.termId} apy={item.apy} term={item.term} saveApy={this.saveApy}/>
      );
    });
    return (
      <div className="terms">
        <h2>Quản lý lãi suất</h2>
        {terms}
      </div>
    );
  }
}

export default Interests;
