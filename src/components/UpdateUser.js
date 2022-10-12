import React, { Component } from "react";
import Utils from "./Utils";
import { NumericFormat } from "react-number-format";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link } from "react-router-dom";

class UpdateUser extends Component {
  state = {
    id: "",
    name: "",
    phone: "",
    withdraw: "",
    deposit: "",
    idErr: "",
    nameErr: "",
    phoneErr: "",
    withdrawErr: "",
    depositErr: "",
    balance: "",
    currentId: "",
    currentPhone: "",
    savings: []
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
        let cname = e.target.value.toUpperCase();
        this.setState({
          name: cname,
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
      case "withdrawErr":
        this.setState({
          withdrawErr: message,
        });
        break;
      case "depositErr":
        this.setState({
          depositErr: message,
        });
        break;
      default:
        break;
    }
  };
  updateUser = async (e) => {
    e.preventDefault();
    let newUser = {
      id: this.state.id.replace(/\s/g, ""),
      name: this.state.name,
      phone: this.state.phone.replace(/\s/g, ""),
      balance: this.state.balance,
      withdraw: this.state.withdraw.replace(/\,/gi, ""),
      deposit: this.state.deposit.replace(/\,/gi, ""),
    };
    // Number(this.state.balance.replace(/\,/gi, ""))
    // /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
    let status = true;
    let reg = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    if (newUser.withdraw === "") {
      newUser.withdraw = 0;
    }
    if (newUser.deposit === "") {
      newUser.deposit = 0;
    }
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
    if (Utils.checkIsNumber(newUser.id) === false || newUser.id.length !== 12) {
      this.handleError("idErr", "Định dạng CCCD không phù hợp");
      status = false;
    }
    if (reg.test(newUser.name) === false) {
      this.handleError("nameErr", "Tên không được chứa ký tự đặc biệt");
      status = false;
    }
    if (
      newUser.phone.length !== 10 ||
      Utils.checkIsNumber(newUser.phone) === false
    ) {
      this.handleError("phoneErr", "Số điện thoại phải là định dạng gồm 10 số");
      status = false;
    }
    if (Number(newUser.withdraw) < 100000 && Number(newUser.withdraw) !== 0) {
      this.handleError("withdrawErr", "Số tiền rút tối thiểu là 100.000");
      status = false;
    }
    if (Number(newUser.withdraw) > Number(newUser.balance)) {
      this.handleError("withdrawErr", "Số dư không đủ");
      status = false;
    }
    if (Number(newUser.deposit) < 50000 && Number(newUser.deposit) !== 0) {
      this.handleError("depositErr", "Số tiền nạp tối thiểu là 50.000");
      status = false;
    }
    if (status === true) {
      if (newUser.id !== this.state.currentId) {
        const resInfo = await axios.get(
          `http://localhost:8686/api/v1/user/${newUser.id}`
        );
        if (resInfo.data.data.length !== 0) {
          this.handleError("idErr", "CCCD đã được đăng ký");
          status = false;
        }
      }
      if (newUser.phone !== this.state.currentPhone) {
        const resPhone = await axios.get(
          `http://localhost:8686/api/v1/user/${newUser.phone}`
        );
        if (resPhone.data.data.length !== 0) {
          this.handleError("phoneErr", "Số điện thoại đã được đăng ký");
          status = false;
        }
      }
    }

    if (status === true) {
      let newBalance =
        Number(newUser.balance) -
        Number(newUser.withdraw) +
        Number(newUser.deposit);
      newUser.name = this.state.name.trim();
      newUser.balance = newBalance;
      this.setState({
        newId: newUser.id,
      });
      let newSavings = [...this.state.savings]
      for(let i = 0;i < newSavings.length;i++){
        let oldSavId = newSavings[i].savId;
        await axios.delete(`http://localhost:8686/api/v1/deleteSaving/${oldSavId}`);
        let item = newSavings[i]
        item.savId = newUser.id + String(i);
        item.owner = newUser.id;
        
        await axios.post(`http://localhost:8686/api/v1/createSaving`, item);
      }
      
      await axios.put(
        `http://localhost:8686/api/v1/updateUser/${this.state.oldId}`,
        newUser
      );
      let mes = "Cập nhật thành công !";
      toast.success(mes);
      setTimeout(() => {
        window.location.href = `http://localhost:3000/user/${newUser.id}`;
      }, 500);
    }
  };
  componentDidMount = async () => {
    let currentId = String(window.location.href).slice(-12);
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
      oldId: currentId,
      currentId: resInfo.data.data[0].id,
      currentPhone: resInfo.data.data[0].phone,
      savings: resSavings.data.data
    });
  };
  render() {

    return (
      <div className="CreateUser">
        <h2>Cập nhật thông tin</h2>
        <div className="inputField">
          <label>Họ và tên khách hàng:</label>
          <input
            placeholder="Nhập họ và tên không dấu không chứa ký tự đặc biệt và số"
            value={this.state.name}
            onChange={(e) => this.handleText(e, "name")}
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
            placeholder="Nhập số điện thoại gồm 10 số"
            value={this.state.phone}
            onChange={(e) => this.handleText(e, "phone")}
          />
        </div>
        <div className="messagePhone">{this.state.phoneErr}</div>
        <h2>Nạp / Rút tiền</h2>
        <div className="inputField">
          <label>Số tiền nạp vào:</label>
          <NumericFormat
            placeholder="Số tiền nạp tối thiểu là 50.000"
            value={this.state.deposit}
            thousandSeparator={true}
            onValueChange={(values) => {
              const { formattedValue } = values;
              this.setState({ deposit: formattedValue, depositErr: "" });
            }}
          />
        </div>
        <div className="messageDeposit">{this.state.depositErr}</div>
        <div className="inputField">
          <label>Số tiền rút ra:</label>
          <NumericFormat
            placeholder="Số tiền rút tối thiểu là 100.000"
            value={this.state.withdraw}
            thousandSeparator={true}
            onValueChange={(values) => {
              const { formattedValue } = values;
              this.setState({ withdraw: formattedValue, withdrawErr: "" });
            }}
          />
        </div>
        <div className="messageWithdraw">{this.state.withdrawErr}</div>
        <div className="createUserBtn">
          <Button
            variant="contained"
            color="success"
            onClick={(e) => {
              this.updateUser(e);
            }}
          >
            Cập nhật
          </Button>
          <Button variant="contained" color="error">
            <Link to={"/user/" + this.state.oldId}>Hủy</Link>
          </Button>
        </div>
      </div>
    );
  }
}

export default UpdateUser;
