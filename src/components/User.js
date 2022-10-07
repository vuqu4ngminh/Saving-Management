import React, { Component } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import Utils from "./Utils";
import { Link } from "react-router-dom";

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      phone: "",
      balance: "",
      savings: [],
      isUser: true,
    };
  }
  componentDidMount = async () => {
    let currentId = String(window.location.href).slice(-12);
    if (Utils.checkIsNumber(currentId) === true) {
      try {
        const resInfo = await axios.get(
          `http://localhost:8686/api/v1/user/${currentId}`
        );
        const resSavings = await axios.get(
          `http://localhost:8686/api/v1/savings/${currentId}`
        );
        this.setState({
          id: resInfo.data.data[0].id,
          name: resInfo.data.data[0].name,
          phone: resInfo.data.data[0].phone,
          balance: resInfo.data.data[0].balance,
          savings: resSavings.data.data,
        });
      } catch (error) {
        this.setState({
          isUser: false,
        });
      }
    } else {
      this.setState({
        isUser: false,
      });
    }
  };

  render() {
    let savings = this.state.savings.map((item, index) => {
      let od = Utils.formatDay(item.openDate);
      let ed = Utils.formatDay(item.endDate);
      return (
        <tbody key={item.savId}>
          <tr>
            <th>{index + 1}</th>
            <th>{Utils.formatCurrency(item.amount)}</th>
            <th>{item.apy + "%"}</th>
            <th>{Utils.checkTerm(item.term)}</th>
            <th>{od}</th>
            <th>{ed}</th>
            <th>{Utils.countDays(item.openDate, item.endDate) - item.nods}</th>
            <th>
              <Button variant="contained" color="error"><Link to={'/user/saving/' + item.savId}>Tất toán trước hạn</Link></Button>
            </th>
          </tr>
        </tbody>
      );
    });
    let header =
      savings.length === 0 ? (
        <h3>Khách hàng chưa có khoản tiết kiệm</h3>
      ) : (
        <div className="savings">
          <h3>Các khoản tiết kiệm:</h3>
          <table>
            <tbody>
              <tr>
                <th>STT</th>
                <th>Số tiền</th>
                <th>Lãi suất</th>
                <th>Kỳ hạn</th>
                <th>Ngày mở</th>
                <th>Ngày kết thúc</th>
                <th>Số ngày còn lại</th>
                <th></th>
              </tr>
            </tbody>
            {savings}
          </table>
        </div>
    );
    let user = this.state.isUser === true ? (
        <div className="client">
          <h3>Thông tin khách hàng:</h3>
          <div className="field">
            <label>Họ và tên khách hàng:</label>
            <span>{this.state.name}</span>
          </div>
          <div className="field">
            <label>Căn cước công dân:</label>
            <span>{this.state.id}</span>
          </div>
          <div className="field">
            <label>Số điện thoại:</label>
            <span>{this.state.phone}</span>
          </div>
          <div className="field">
            <label>Số dư:</label>
            <span>{Utils.formatCurrency(this.state.balance)}</span>
          </div>
          <div className="actionUser">
            <Button variant="contained" color="primary">
              <Link to={'/user/update/' + this.state.id}>Cập nhật thông tin</Link>
            </Button>
            <Button variant="contained" color="success">
              <Link to={'/user/saving/open/' + this.state.id}>Mở sổ tiết kiệm</Link>
            </Button>
            <Button variant="contained" color="error">
              <Link to={'/user/delete/' + this.state.id}>Đóng tài khoản khách hàng</Link>
            </Button>
          </div>
          {header}
        </div>
      ) : (
        <div className="notFound">
          <h1>Người dùng không tồn tại</h1>
        </div>
    );
    return (
      <>
        {user}
      </>
    );
  }
}

export default User;
