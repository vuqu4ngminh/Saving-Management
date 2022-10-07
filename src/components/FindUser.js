import React, { Component } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Utils from "./Utils";
import CreateUser from "./CreateUser";
import axios from "axios";
import { Button } from "@mui/material";

class FindUser extends Component {
  state = {
    value: "",
  };
  changeText = (e) => {
    e.preventDefault();
    this.setState({
      value: e.target.value,
    });
  };
  // find user
  findUser = async (e) => {
    e.preventDefault();
    let text = this.state.value.replace(/\s/g, "");
    if (text === "" || !Utils.checkIsNumber(text)) {
      toast.error("Hãy nhập CCCD !");
      return;
    } else {
      try {
        const resInfo = await axios.get(
          `http://localhost:8686/api/v1/user/${text}`
        );
        if (resInfo.data.data.length === 0) {
          toast.error("Khách hàng không tồn tại !");
          return;
        }
      } catch (error) {
        return
      }
    }
    window.location.href = `http://localhost:3000/user/${text}`;
  };
  render() {
    return (
      <div className="FindUser">
        <h3>Tìm người dùng:</h3>
        <form>
          <input
            className="input"
            value={this.state.value}
            onChange={(e) => this.changeText(e)}
            placeholder={"Nhập CCCD"}
          />
          <Button variant="contained" onClick={(e) => this.findUser(e)}>Tìm</Button>
        </form>
        <CreateUser />
      </div>
    );
  }
}

export default FindUser;
