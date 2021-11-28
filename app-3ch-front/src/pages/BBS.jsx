import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  createTheme,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import UserContext from "contexts/UserContext";
import Post from "components/Post";
import SubmitButton from "components/Button";
import { useSnackbar } from "notistack";

function BBS() {
  const theme = createTheme();
  const { user, resetUser } = useContext(UserContext);
  const navigator = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const snackbarOptions = { vertical: "top", horizontal: "right" };
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [loading, setLoading] = useState(false);

  const initialErrors = {
    name: false,
    mail: false,
    title: false,
    body: true,
    all: true,
  };
  const initialErrorMessages = {
    name: "",
    mail: "",
    title: "",
    body: "",
  };

  const [errors, setErrors] = useState(initialErrors);
  const [errorMessages, setErrorMessages] = useState(initialErrorMessages);
  const inputRefs = {
    name: useRef(null),
    mail: useRef(null),
    title: useRef(null),
    body: useRef(null),
  };

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
    errors.all = errors.name || errors.mail || errors.title || errors.body;

    setErrors(Object.assign({}, errors));
    setErrorMessages(Object.assign({}, errorMessages));
  };

  // 入力欄の初期化
  const initializeInput = () => {
    // 名前とメールは連続投稿のために消さない
    setTitle("");
    setBody("");
    // エラー状態のクリア
    setErrors(Object.assign({}, initialErrors));
    setErrorMessages(Object.assign({}, initialErrorMessages));
  };

  // 画面項目のロード
  const load = useCallback(async () => {
    setLoading(true);
    await getPosts();
    await getCategories();
    setLoading(false);
  }, []);

  // 投稿の取得
  const getPosts = async () => {
    await axios
      .get("https://localhost:3001/posts")
      .then((response) => {
        if (response.data.status === "success") {
          setPosts(response.data.posts);
        }
      })
      .catch((e) => {
        console.log("Error");
      });
  };

  // カテゴリーの取得
  const getCategories = async () => {
    await axios
      .get("https://localhost:3001/categories")
      .then((response) => {
        if (response.data.status === "success") {
          setCategories(response.data.categories);
          if (response.data.categories.length > 0) {
            setCategoryId(response.data.categories[0]["id"]);
          }
        }
      })
      .catch((e) => {
        console.log("Error");
      });
  };

  // 投稿の作成
  const sendPost = async () => {
    if (categories.length === 0) {
      enqueueSnackbar(
        "カテゴリーの登録がありません。管理者へ連絡してください。",
        {
          variant: "error",
          anchorOrigin: snackbarOptions,
        },
      );
      return;
    }
    if (errors.all) {
      enqueueSnackbar("入力エラーがあります", {
        variant: "error",
        anchorOrigin: snackbarOptions,
      });
      return;
    }
    const postBody = {
      anonymousId: user.uid ?? "",
      name,
      mail,
      title,
      body,
    };
    await axios
      .post(`https://localhost:3001/categories/${categoryId}/posts`, postBody)
      .then((response) => {
        if (response.data.status === "success") {
          load();
          initializeInput();
          enqueueSnackbar("投稿しました", {
            variant: "success",
            anchorOrigin: snackbarOptions,
          });
        }
      })
      .catch((e) => {
        enqueueSnackbar("投稿に失敗しました", {
          variant: "error",
          anchorOrigin: snackbarOptions,
        });
      });
  };

  // 投稿を非表示にする
  const changeHidden = async (postId) => {
    const body = { hidden: true };
    await axios
      .patch(`https://localhost:3001/posts/${postId}`, body)
      .then((response) => {
        if (response.data.status === "success") {
          load();
          enqueueSnackbar("非表示にしました", {
            variant: "success",
            anchorOrigin: snackbarOptions,
          });
        }
      })
      .catch((e) => {
        enqueueSnackbar("操作に失敗しました", {
          variant: "error",
          anchorOrigin: snackbarOptions,
        });
      });
  };

  // 画面更新処理
  useEffect(() => {
    load();
  }, [load]);

  // ログアウトしてログイン画面へ遷移
  const logout = () => {
    resetUser();
    navigator("/top");
  };

  // ログイン画面へ遷移
  const login = () => {
    navigator("/top");
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box>
          <Card
            variant="outlined"
            sx={{ margin: theme.spacing(1), width: "400px" }}
          >
            <CardContent>
              <Typography variant="subtitle1">
                後から自分の投稿を非表示にする場合は匿名ログインしてください。
              </Typography>
              <FormControl fullWidth sx={{ marginTop: 1 }}>
                <InputLabel id="category-label">カテゴリー</InputLabel>
                <Select
                  labelId="catogory-label"
                  value={categoryId}
                  label="カテゴリー"
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category["id"]} value={category["id"]}>
                      {category["category_name"]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="名前"
                type="text"
                value={name}
                inputRef={inputRefs.name}
                error={errorMessages.name !== ""}
                helperText={errorMessages.name}
                sx={{ margin: "10px 0px 0px 0px" }}
                size="small"
                onChange={(e) => {
                  setName(e.target.value);
                  validation("name");
                }}
              />
              <TextField
                fullWidth
                label="メールアドレス"
                type="text"
                value={mail}
                inputRef={inputRefs.mail}
                error={errorMessages.mail !== ""}
                helperText={errorMessages.mail}
                size="small"
                sx={{ margin: "10px 0px 0px 0px" }}
                onChange={(e) => {
                  setMail(e.target.value);
                  validation("mail");
                }}
              />
              <TextField
                fullWidth
                label="件名"
                type="text"
                value={title}
                inputRef={inputRefs.title}
                error={errorMessages.title !== ""}
                helperText={errorMessages.title}
                sx={{ margin: "10px 0px 0px 0px" }}
                onChange={(e) => {
                  setTitle(e.target.value);
                  validation("title");
                }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="本文"
                type="text"
                value={body}
                inputRef={inputRefs.body}
                error={errorMessages.body !== ""}
                helperText={errorMessages.body}
                sx={{ margin: "10px 0px 0px 0px" }}
                onChange={(e) => {
                  setBody(e.target.value);
                  validation("body");
                }}
                required
              />
            </CardContent>
            <CardActions>
              <SubmitButton fullWidth onClick={sendPost}>
                投稿する
              </SubmitButton>
            </CardActions>
          </Card>
        </Box>
        <Stack
          sx={{
            display: "flex",
            width: "400px",
            height: "900px",
            overflowY: "auto",
          }}
        >
          {posts
            .filter((post) => !post.hidden)
            .map((post, index) => (
              <Post
                key={index}
                postId={post["id"]}
                category={post["category_name"]}
                title={post.title}
                name={post.name}
                mail={post.mail}
                onClickHidden={(postId) => changeHidden(postId)}
                enableHidden={
                  user.uid !== null ? user.uid === post["anonymous_id"] : false
                }
              >
                {post.body}
              </Post>
            ))}
        </Stack>
      </Container>
    </>
  );
}

export default BBS;
