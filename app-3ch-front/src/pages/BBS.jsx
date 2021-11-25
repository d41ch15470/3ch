import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import axios from "axios";
import UserContext from "contexts/UserContext";

function BBS() {
  const { user, resetUser } = useContext(UserContext);
  const navigator = useNavigate();

  const sendGet = async () => {
    // await axios
    //   .get("https://localhost:3001/auth")
    //   .then((response) => {
    //     setResult(response.data.user_id);
    //   })
    //   .catch((e) => {
    //     setResult("ERROR");
    //   });
  };

  const logout = () => {
    resetUser();
    navigator("/top");
  };

  const login = () => {
    navigator("/top");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            3ch
          </Typography>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              color: user.userType === "anonymous" ? "pink" : "yellow",
              display: { xs: "none", sm: "block" },
              mr: 2,
            }}
          >
            {user.userType === "anonymous" && "未ログイン"}
            {user.userType === "user" && "匿名ログイン中"}
            {user.userType === "admin" && "管理者ログイン中"}
          </Typography>
          {user.userType === "anonymous" ? (
            <Button color="success" variant="contained" onClick={login}>
              ログイン
            </Button>
          ) : (
            <Button color="success" variant="contained" onClick={logout}>
              ログアウト
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default BBS;
