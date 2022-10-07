import React, { Component } from "react";
import axios from "axios";
import { Button, Checkbox } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import Utils from "./Utils";
import { toast } from "react-toastify";

function withParams(Component) {
  return (props) => <Component {...props} params={useParams()} />;
}

class DeleteSaving extends Component {
  state = {
    balance: "",
    id: "",
    savId: "",
    nods: "",
    profit: "",
    amount: "",
    openDate: "",
    endDate: "",
    term: "",
    apy: "",
    confirmed: false,
  };
  handleChange = (e) => this.setState({ confirmed: e.target.checked });
  componentDidMount = async () => {
    let { savId } = this.props.params;
    const res = await axios.get(`http://localhost:8686/api/v1/saving/${savId}`);
    const resInfo = await axios.get(
      `http://localhost:8686/api/v1/user/${res.data.data[0].owner}`
    );
    this.setState({
      user: resInfo.data.data[0],
    });
    this.setState({
      id: res.data.data[0].owner,
      savId: res.data.data[0].savId,
      amount: res.data.data[0].amount,
      profit: res.data.data[0].profit,
      apy: res.data.data[0].apy,
      term: res.data.data[0].term,
      nods: res.data.data[0].nods,
      openDate: res.data.data[0].openDate,
      endDate: res.data.data[0].endDate,
      balance: resInfo.data.data[0].balance,
    });
  };
  delete = async () => {
    if (this.state.confirmed === false) {
      toast.error("Chưa xác nhận tất toán !");
      return;
    }
    let newUser = this.state.user;
    newUser.balance += this.state.amount + this.state.profit;
    await axios.put(
      `http://localhost:8686/api/v1/updateUser/${this.state.id}`,
      newUser
    );
    let id = this.state.savId
    await axios.delete(`http://localhost:8686/api/v1/deleteSaving/${id}`);
    setTimeout(() => toast.success("Tất toán thành công !"), 500);
  };
  render() {
    let link =
      this.state.confirmed === true ? (
        <Link to={"/user/" + this.state.id}>Tất Toán</Link>
      ) : (
        <span>Tất toán</span>
      );
    return (
      <div className="deleteSaving">
        <h2>Tất toán khoản tiết kiệm</h2>
        <div className="field">
          <label>Ngày mở:</label>
          <span>{Utils.formatDay(this.state.openDate)}</span>
        </div>
        <div className="field">
          <label>Lãi suất:</label>
          <span>{this.state.apy + "%"}</span>
        </div>
        <div className="field">
          <label>Số ngày còn lại:</label>
          <span>
            {String(
              Utils.countDays(this.state.openDate, this.state.endDate) -
                this.state.nods
            )}
          </span>
        </div>
        <div className="field">
          <label>Số tiền sẽ nhận được:</label>
          <h4>{Utils.formatCurrency(this.state.amount + this.state.profit)}</h4>
        </div>
        <div className="field">
          <h3>Lưu ý: Sau khi tất toán, thao tác không thể hoàn lại</h3>
        </div>
        <div className="field">
          <div>
            <Checkbox
              checked={this.state.confirmed}
              onChange={this.handleChange}
              inputProps={{ "aria-label": "controlled" }}
            />
            <span>Khách hàng xác nhận và chịu hoàn toàn trách nhiệm</span>
          </div>
          <div className="delBtn">
            <Button
              variant="contained"
              color="error"
              onClick={() => this.delete()}
            >
              {link}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default withParams(DeleteSaving);
