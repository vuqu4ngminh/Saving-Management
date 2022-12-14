import React, { Component } from "react";
import axios from "axios";
import Utils from "./Utils";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { NumericFormat } from "react-number-format";
import { Button, Checkbox } from "@mui/material";
import { toast } from "react-toastify";

class CreateSaving extends Component {
  state = {
    id: "",
    balance: "",
    term: "m1",
    savings: [],
    isConfirmed: false,
    terms: [],
    amount: "",
    amountErr: "",
    phone: "",
    name: "",
  };
  handleChange = (e) => this.setState({ isConfirmed: e.target.checked });
  handleTerm = (e) => {
    this.setState({
      term: e.target.value,
    });
  };
  componentDidMount = async () => {
    let currentId = String(window.location.href).slice(-12);
    const resInfo = await axios.get(
      `http://localhost:8686/api/v1/user/${currentId}`
    );
    const resSavings = await axios.get(
      `http://localhost:8686/api/v1/savings/${currentId}`
    );
    const resTerm = await axios.get("http://localhost:8686/api/v1/terms");
    this.setState({
      id: resInfo.data.data[0].id,
      balance: resInfo.data.data[0].balance,
      savings: resSavings.data.data,
      terms: resTerm.data.data,
      phone: resInfo.data.data[0].phone,
      name: resInfo.data.data[0].name,
    });
    const resToday = await axios.get("http://localhost:8686/api/v1/time");
    this.setState({
      openDate: resToday.data.data,
    });
  };
  formatDay = (timestamp) => {
    const date = new Date(timestamp);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const day = date.getDate();
    return year + "-" + month + "-" + day;
  };
  checkTerm = (term) => {
    for (let i of this.state.terms) {
      if (i.term === term) {
        return Number(i.apy);
      }
    }
  };
  getEndDate = (term, openDate) => {
    let date = new Date(openDate);
    switch (term) {
      case "m1":
        return this.formatDay(date.setMonth(date.getMonth() + 1));
      case "m3":
        return this.formatDay(date.setMonth(date.getMonth() + 3));
      case "m6":
        return this.formatDay(date.setMonth(date.getMonth() + 6));
      case "m12":
        return this.formatDay(date.setMonth(date.getMonth() + 12));
      case "m18":
        return this.formatDay(date.setMonth(date.getMonth() + 18));
      case "m24":
        return this.formatDay(date.setMonth(date.getMonth() + 24));
      case "m36":
        return this.formatDay(date.setMonth(date.getMonth() + 36));
      default:
        break;
    }
  };
  createSaving = async () => {
    if (this.state.isConfirmed === false) {
      toast.error("Ch??a x??c nh???n m??? s??? ti???t ki???m !");
      return;
    }
    let newSavId;
    let newAmount = Number(this.state.amount.replace(/\,/gi, ""));
    if (this.state.savings.length === 0) {
      newSavId = this.state.id + "0";
    } else {
      newSavId = this.state.id + this.state.savings.length;
    }
    if (newAmount < 1000000) {
      this.setState({
        amountErr: "S??? ti???n g???i t???i thi???u l?? 1.000.000",
      });
      return;
    }
    if (newAmount > this.state.balance) {
      this.setState({
        amountErr: "S??? d?? kh??ng ?????",
      });
      return;
    }
    let newBalance = this.state.balance - newAmount;
    let ed = this.getEndDate(this.state.term, this.state.openDate);
    let newApy = this.checkTerm(this.state.term);
    let newSaving = {
      savId: newSavId,
      amount: newAmount,
      apy: newApy,
      term: this.state.term,
      openDate: this.formatDay(this.state.openDate),
      endDate: ed,
      profit: 0,
      nods: 0,
      owner: this.state.id,
    };
    let newUser = {
      id: this.state.id,
      name: this.state.name,
      phone: this.state.phone,
      balance: newBalance,
    };
    await axios.put(
      `http://localhost:8686/api/v1/updateUser/${this.state.id}`,
      newUser
    );
    await axios.post(`http://localhost:8686/api/v1/createSaving`, newSaving);
    toast.success("M??? s??? ti???t ki???m th??nh c??ng !");
    setTimeout(() => {
      window.location.href = `http://localhost:3000/user/${newUser.id}`;
    }, 500);
  };
  render() {
    return (
      <div className="savingForm">
        <div className="CreateSaving">
          <h2>M??? s??? ti???t ki???m</h2>
          <div className="field" style={{ width: "100%", padding: "10px" }}>
            <label>S??? d??:</label>
            <span style={{ fontWeight: "bold" }}>
              {Utils.formatCurrency(this.state.balance)}
            </span>
          </div>
          <div className="inputField" style={{ width: "100%" }}>
            <label>S??? ti???n g???i:</label>
            <NumericFormat
              placeholder="S??? ti???n g???i t???i thi???u l?? 1.000.000"
              value={this.state.amount}
              thousandSeparator={true}
              onValueChange={(values) => {
                const { formattedValue } = values;
                this.setState({ amount: formattedValue, amountErr: "" });
              }}
            />
          </div>
          <div className="messageAmount" style={{ width: "100%" }}>
            {this.state.amountErr}
          </div>
          <div className="inputTerm">
            <label>K??? h???n:</label>
            <div className="inputBox">
              <select
                onChange={(e) => {
                  this.handleTerm(e);
                }}
              >
                <option value={"m1"}>1 th??ng</option>
                <option value={"m3"}>3 th??ng</option>
                <option value={"m6"}>6 th??ng</option>
                <option value={"m12"}> 12 th??ng</option>
                <option value={"m18"}>18 th??ng</option>
                <option value={"m24"}>24 th??ng</option>
                <option value={"m36"}>36 th??ng</option>
              </select>
            </div>
          </div>
          <div className="field" style={{ width: "100%", paddingTop: "20px" }}>
            <div>
              <Checkbox
                checked={this.state.isConfirmed}
                onChange={this.handleChange}
                inputProps={{ "aria-label": "controlled" }}
              />
              <span>Kh??ch h??ng x??c nh???n ?????ng ?? v???i ??i???u kho???n</span>
            </div>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                this.createSaving();
              }}
            >
              X??c nh???n
            </Button>
          </div>
        </div>
        <div className="currentApy">
          <h2>B???ng l??i su???t</h2>
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">STT</TableCell>
                  <TableCell align="left">K??? h???n</TableCell>
                  <TableCell align="left">L??i su???t</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.terms.map((item) => {
                  return (
                    <TableRow key={item.termId}>
                      <TableCell align="left">{item.termId}</TableCell>
                      <TableCell align="left">
                        {Utils.checkTerm(item.term)}
                      </TableCell>
                      <TableCell align="left">{item.apy + "%"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    );
  }
}

export default CreateSaving;
