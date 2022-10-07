import React, { Component } from "react";
import Utils from "./Utils";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button, Checkbox } from "@mui/material";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

class DeleteUser extends Component {
  state = {
    id: "",
    name: "",
    phone: "",
    balance: "",
    savings: [],
    refund: "",
    isConfirmed: false,
  };
  handleChange = (e) => this.setState({ isConfirmed: e.target.checked });
  delete = async () => {
    if (this.state.isConfirmed === false) {
      toast.error("Chưa xác nhận đóng tài khoản !");
      return;
    }
    let uid = this.state.id
    let savs = [...this.state.savings];
    if (savs.length !== 0) {
      for (let sav of savs) {
        await axios.delete(`http://localhost:8686/api/v1/deleteSaving/${sav.savId}`);
      }
    }
    await axios.delete(`http://localhost:8686/api/v1/deleteUser/${uid}`);
    setTimeout(() => toast.success("Đóng tài khoản thành công !"), 500);
  };
  componentDidMount = async () => {
    let currentId = String(window.location.href).slice(-12);
    const resInfo = await axios.get(
      `http://localhost:8686/api/v1/user/${currentId}`
    );
    const resSavings = await axios.get(
      `http://localhost:8686/api/v1/savings/${currentId}`
    );
    let savings = [...resSavings.data.data];
    let ref = resInfo.data.data[0].balance;
    for (let sav of savings) {
      let ap = sav.amount + sav.profit;
      ref += ap;
    }
    this.setState({
      id: resInfo.data.data[0].id,
      name: resInfo.data.data[0].name,
      phone: resInfo.data.data[0].phone,
      balance: resInfo.data.data[0].balance,
      savings: resSavings.data.data,
      refund: ref,
    });
  };
  render() {
    let savings = this.state.savings.map((item) => {
      return (
        <TableRow key={item.savId}>
          <TableCell align="left">{item.savId}</TableCell>
          <TableCell align="left">{Utils.formatDay(item.openDate)}</TableCell>
          <TableCell align="left">
            {Utils.formatCurrency(item.amount + item.profit)}
          </TableCell>
        </TableRow>
      );
    });
    let checkSav =
      this.state.savings.length === 0 ? (
        <></>
      ) : (
        <div className="savField">
          <h2>Các khoản tiết kiệm</h2>
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Mã số</TableCell>
                  <TableCell align="left">Ngày mở</TableCell>
                  <TableCell align="left">Tiền gốc + lãi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{savings}</TableBody>
            </Table>
          </TableContainer>
        </div>
      );
    let confirm =
      this.state.isConfirmed === true ? (
        <Link to={"/user"}>Đóng tài khoản</Link>
      ) : (
        <span>Đóng tài khoản</span>
      );
    return (
      <div className="DeleteUser">
        <h2>Đóng tài khoản</h2>
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
        {checkSav}
        <div className="total">
          <h2>Tổng số tiền trả lại khách hàng: </h2>
          <h2>{Utils.formatCurrency(this.state.refund)}</h2>
        </div>
        <div className="field">
          <h2 style={{ color: "red" }}>
            Lưu ý: Sau khi đóng tài khoản, thao tác không thể hoàn lại
          </h2>
        </div>
        <div className="field">
          <div>
            <Checkbox
              checked={this.state.isConfirmed}
              onChange={this.handleChange}
              inputProps={{ "aria-label": "controlled" }}
            />
            <span>Khách hàng xác nhận và chịu hoàn toàn trách nhiệm</span>
          </div>
          <Button
            variant="contained"
            color="error"
            onClick={() => this.delete()}
          >
            {confirm}
          </Button>
        </div>
      </div>
    );
  }
}

export default DeleteUser;
