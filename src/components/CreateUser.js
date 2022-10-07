import React, { Component } from "react";
import Utils from "./Utils";
import { NumericFormat } from "react-number-format";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

class CreateUser extends Component {
  state = {
    id: "",
    name: "",
    phone: "",
    balance: "",
    idErr: "",
    nameErr: "",
    phoneErr: "",
    balanceErr: "",
  };
  handleText = (e, type) => {
    e.preventDefault();
    switch (type) {
      case "id":
        this.setState({
          id: e.target.value,
          idErr: "",
        });
        break;
      case "name":
        this.setState({
          name: e.target.value.toUpperCase(),
          nameErr: "",
        });
        break;
      case "phone":
        this.setState({
          phone: e.target.value,
          phoneErr: "",
        });
        break;
      default:
        break;
    }
  };
  createUser = async (e) => {
    e.preventDefault();
    let newUser = {
      id: this.state.id.replace(/\s/g, ""),
      name: this.state.name,
      phone: this.state.phone.replace(/\s/g, ""),
      balance: this.state.balance.replace(/\,/gi, ""),
    };
    // Number(this.state.balance.replace(/\,/gi, ""))
    // /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
    let status = true;
    let reg = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    if (newUser.id === "") {
      this.handleError("idErr", "Không được để trống");
      status = false;
    }
    if (newUser.name === "") {
      this.handleError("nameErr", "Không được để trống");
      status = false;
    }
    if (newUser.phone === "") {
      this.handleError("phoneErr", "Không được để trống");
      status = false;
    }
    if (newUser.balance === "") {
      newUser.balance = 0
    }
    if (Utils.checkIsNumber(newUser.id) === false || newUser.id.length !== 12) {
      this.handleError("idErr", "Định dạng CCCD không phù hợp");
      status = false;
    }
    if (reg.test(newUser.name) === false) {
      this.handleError("nameErr", "Tên không được chứa ký tự đặc biệt và số");
      status = false;
    }
    if (
      (newUser.phone.length !== 10) ||
      Utils.checkIsNumber(newUser.phone) === false
    ) {
      this.handleError("phoneErr", "Số điện thoại phải là định dạng gồm 10 số");
      status = false;
    }
    console.log(newUser.balance);
    if (Number(newUser.balance) < 50000 && Number(newUser.balance) !== 0) {
      this.handleError("balanceErr", "Số tiền tối thiểu phải nạp là 50.000");
      status = false;
    }
    if (status === true) {
      const resId = await axios.get(
        `http://localhost:8686/api/v1/user/${newUser.id}`
      );
      if (resId.data.data.length !== 0) {
        this.handleError("idErr", "CCCD đã được đăng ký");
        status = false;
      }
      const resPhone = await axios.get(
        `http://localhost:8686/api/v1/user/${newUser.phone}`
      );
      if (resPhone.data.data.length !== 0) {
        this.handleError("phoneErr", "Số điện thoại đã được đăng ký");
        status = false;
      }
      if (status === true) {
        newUser.balance = Number(this.state.balance.replace(/\,/gi, ""));
        newUser.name = this.state.name.trim();
        await axios.post(`http://localhost:8686/api/v1/createUser`, newUser);
        toast.success("Thêm người dùng thành công !");
        setTimeout(() => {
          window.location.href = `http://localhost:3000/user/${newUser.id}`;
        }, 500);
      }
    }
  };
  handleError = (field, message) => {
    switch (field) {
      case "idErr":
        this.setState({
          idErr: message,
        });
        break;
      case "nameErr":
        this.setState({
          nameErr: message,
        });
        break;
      case "phoneErr":
        this.setState({
          phoneErr: message,
        });
        break;
      case "balanceErr":
        this.setState({
          balanceErr: message,
        });
        break;
      default:
        break;
    }
  };
  render() {
    return (
      <div className="CreateUser">
        <h3>Thêm khách hàng mới</h3>
        <div className="inputField">
          <label>Họ và tên khách hàng:</label>
          <input
            placeholder="Nhập họ và tên không dấu không chứa ký tự đặc biệt và số"
            value={this.state.name}
            onChange={(e) => this.handleText(e,"name")}
          />
        </div>
        <div className="messageName">{this.state.nameErr}</div>
        <div className="inputField">
          <label>Căn cước công dân:</label>
          <input
            placeholder="Nhập CCCD loại 12 số"
            value={this.state.id}
            onChange={(e) => this.handleText(e, "id")}
          />
        </div>
        <div className="messageId">{this.state.idErr}</div>
        <div className="inputField">
          <label>Số điện thoại:</label>
          <input
            placeholder="Số điện thoại gồm 10 số"
            value={this.state.phone}
            onChange={(e) => this.handleText(e, "phone")}
          />
        </div>
        <div className="messagePhone">{this.state.phoneErr}</div>
        <div className="inputField">
          <label>Số tiền nạp vào:</label>
          <NumericFormat
            placeholder="Số tiền nạp tối thiểu là 50.000"
            value={this.state.balance}
            thousandSeparator={true}
            onValueChange={(values) => {
              const { formattedValue } = values;
              this.setState({ balance: formattedValue, balanceErr: "" });
            }}
          />
        </div>
        <div className="messageBalance">{this.state.balanceErr}</div>
        <div className="createUserBtn">
          <Button
            variant="contained"
            onClick={(e) => {
              this.createUser(e);
            }}
          >
            Thêm
          </Button>
        </div>
      </div>
    );
  }
}

export default CreateUser;
