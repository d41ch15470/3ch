import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  createTheme,
  TextField,
} from "@mui/material";
import { useContext, useEffect, useState, useRef } from "react";
import UserContext from "contexts/UserContext";
import Button from "components/Button";
import axios from "axios";
import { useNavigate } from "react-router";
import { useSnackbar } from "notistack";

const AdminLogin = () => {
  const theme = createTheme();
  const navigator = useNavigate();
  const { user, setUser, resetUser } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const snackbarOptions = { vertical: "top", horizontal: "right" };
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    userId: true,
    password: true,
    all: true,
  });
  const [errorMessages, setErrorMessages] = useState({
    userId: "",
    password: "",
  });
  const inputRefs = {
    userId: useRef(null),
    password: useRef(null),
  };

  // 初期表示の時点でアカウント情報をクリアする
  useEffect(() => {
    resetUser();
  }, []);

  // バリデーション
  const validation = (target) => {
    const ref = inputRefs[target].current;
    let errorMessage = "";

    if (ref && !ref.validity.valid) {
      errorMessage = ref.validationMessage;
    }
    errors[target] = errorMessage !== "";
    errorMessages[target] = errorMessage;

    // 全エラー
    errors.all = errors.userId || errors.password;

    setErrors(Object.assign({}, errors));
    setErrorMessages(Object.assign({}, errorMessages));
  };

  const loginAdmin = async () => {
    if (errors.all) {
      enqueueSnackbar("入力エラーがあります", {
        variant: "error",
        anchorOrigin: snackbarOptions,
      });
      return;
    }
    const body = {
      userId,
      password,
      user_type: "admin",
    };
    await axios
      .post("https://localhost:3001/auth/sign_in", body)
      .then((response) => {
        user.uid = response.data.data["uid"];
        user.accessToken = response.headers["access-token"];
        user.client = response.headers["client"];
        user.tokenType = response.headers["token-type"];
        user.expiry = response.headers["expiry"];
        user.userType = response.data.data["user_type"];
        setUser(Object.assign({}, user));
        navigator("/admin");
      })
      .catch((e) => {
        enqueueSnackbar("ログインに失敗しました", {
          variant: "error",
          anchorOrigin: snackbarOptions,
        });
      });
  };

  return (
    <Container sx={{ display: "flex", justifyContent: "center" }}>
      <Box sx={{ marginTop: theme.spacing(10), width: "400px" }}>
        <Card variant="outlined" sx={{ margin: theme.spacing(1) }}>
          <CardHeader sx={{ textAlign: "center" }} title="管理者ログイン" />
          <CardContent>
            <TextField
              fullWidth
              label="ログインID"
              type="text"
              value={userId}
              sx={{ margin: "10px 0px 0px 0px" }}
              onChange={(e) => {
                setUserId(e.target.value);
                validation("userId");
              }}
              inputRef={inputRefs.userId}
              error={errorMessages.userId !== ""}
              helperText={errorMessages.userId}
              required
            />
            <TextField
              fullWidth
              label="パスワード"
              type="text"
              value={password}
              sx={{ margin: "10px 0px 0px 0px" }}
              onChange={(e) => {
                setPassword(e.target.value);
                validation("password");
              }}
              inputRef={inputRefs.password}
              error={errorMessages.password !== ""}
              helperText={errorMessages.password}
              required
            />
          </CardContent>
          <CardActions>
            <Button fullWidth onClick={loginAdmin}>
              ログイン
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Container>
  );
};

export default AdminLogin;
