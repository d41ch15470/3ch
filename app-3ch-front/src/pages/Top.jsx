import { useNavigate, Link } from "react-router-dom";
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
import { useSnackbar } from "notistack";

const Top = () => {
  const theme = createTheme();
  const navigator = useNavigate();
  const { user, setUser, resetUser } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const snackbarOptions = { vertical: "top", horizontal: "right" };
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isCreate, setIsCreate] = useState(false);

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
  }, [resetUser]);

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

  // ログイン
  const loginAnonymous = async () => {
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
      userType: "user",
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
        navigator("/");
      })
      .catch((e) => {
        enqueueSnackbar("ログインに失敗しました", {
          variant: "error",
          anchorOrigin: snackbarOptions,
        });
      });
  };

  // 匿名ID取得
  const getAnonymousId = async () => {
    await axios
      .get("https://localhost:3001/auth/")
      .then((response) => {
        // 入力欄の初期化
        setPassword("");
        setIsCreate(true);
        setUserId(response.data["user_id"]);
        // エラー状態の初期化
        errors.userId = false;
        errors.password = true;
        errors.all = true;
        errorMessages.userId = "";
        errorMessages.password = "";
        setErrors(Object.assign({}, errors));
        setErrorMessages(Object.assign({}, errorMessages));
      })
      .catch((e) => {
        enqueueSnackbar("匿名ID取得に失敗しました", {
          variant: "error",
          anchorOrigin: snackbarOptions,
        });
      });
  };

  // サインアップ
  const signUp = async () => {
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
      user_type: "user",
    };
    await axios
      .post("https://localhost:3001/auth/", body)
      .then((response) => {
        if (response.data.status === "success") {
          enqueueSnackbar("サインアップしました", {
            variant: "success",
            anchorOrigin: snackbarOptions,
          });
          setIsCreate(false);
        } else {
          enqueueSnackbar("サインアップに失敗しました", {
            variant: "error",
            anchorOrigin: snackbarOptions,
          });
          setIsCreate(false);
        }
      })
      .catch((e) => {
        enqueueSnackbar(
          "サインアップに失敗しました。もう一度試してください。",
          {
            variant: "error",
            anchorOrigin: snackbarOptions,
          },
        );
        setIsCreate(false);
      });
  };

  return (
    <Container sx={{ display: "flex", justifyContent: "center" }}>
      <Box sx={{ marginTop: theme.spacing(10), width: "400px" }}>
        <Card variant="outlined" sx={{ margin: theme.spacing(1) }}>
          <CardHeader sx={{ textAlign: "center" }} title="匿名ログインしない" />
          <CardContent>
            ログインせずに利用する場合は、投稿の非表示機能が利用できません。
          </CardContent>
          <CardActions>
            <Button fullWidth LinkComponent={Link} to="/">
              匿名ログインせずに利用する
            </Button>
          </CardActions>
        </Card>
        <Card variant="outlined" sx={{ margin: theme.spacing(1) }}>
          <CardHeader sx={{ textAlign: "center" }} title="匿名ログインする" />
          <CardContent>
            自分の投稿を非表示にすることができます。
            <TextField
              fullWidth
              label="匿名ID"
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
              disabled={isCreate}
              required
            />
            <TextField
              fullWidth
              label="パスワード"
              type="password"
              value={password}
              sx={{ margin: "10px 0px 0px 0px" }}
              onChange={(e) => {
                setPassword(e.target.value);
                validation("password");
              }}
              inputProps={{ minLength: isCreate ? 6 : 0 }}
              inputRef={inputRefs.password}
              error={errorMessages.password !== ""}
              helperText={errorMessages.password}
              required
            />
          </CardContent>
          <CardActions>
            {isCreate ? (
              <>
                <Button fullWidth onClick={signUp}>
                  サインアップ
                </Button>
                <Button
                  fullWidth
                  onClick={() => {
                    errors.userId = true;
                    errors.password = true;
                    errors.all = true;
                    errorMessages.userId = "";
                    errorMessages.password = "";
                    setErrors(Object.assign({}, errors));
                    setErrorMessages(Object.assign({}, errorMessages));
                    setUserId("");
                    setPassword("");
                    setIsCreate(false);
                  }}
                >
                  キャンセル
                </Button>
              </>
            ) : (
              <>
                <Button fullWidth onClick={loginAnonymous}>
                  ログイン
                </Button>
                <Button
                  fullWidth
                  onClick={async () => {
                    await getAnonymousId();
                  }}
                >
                  匿名アカウント作成
                </Button>
              </>
            )}
          </CardActions>
        </Card>
      </Box>
    </Container>
  );
};

export default Top;
