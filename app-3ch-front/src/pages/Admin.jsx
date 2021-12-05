import {
  AppBar,
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Container,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { axios, api } from "common/axios";
import UserContext from "contexts/UserContext";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Post from "components/Post";
import SubmitButton from "components/Button";
import { useSnackbar } from "notistack";

const Admin = () => {
  const theme = createTheme();
  const navigator = useNavigate();
  const { resetUser } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const snackbarOptions = { vertical: "top", horizontal: "right" };
  const [initialLogin, setInitialLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(-1);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [targetCategoryId, setTargetCategoryId] = useState(-1);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  // ログインチェック（ロードのたびに呼び出される）
  const loginCheck = async () => {
    return await axios({ api: api.loginCheck });
  };

  // カテゴリ情報の取得
  const getCategories = async () => {
    await axios({ api: api.getCategories })
      .then((response) => {
        if (response.data.success) {
          setCategories(response.data.categories);
        }
      })
      .catch((e) => {
        console.log("Error");
      });
  };

  // 投稿の取得
  const getPosts = useCallback(async () => {
    const resourceId = selectedCategory === -1 ? undefined : selectedCategory;

    await axios({ api: api.getPosts, resourceId: resourceId })
      .then((response) => {
        if (response.data.success) {
          setPosts(response.data.posts);
        }
      })
      .catch((e) => {
        console.log("Error");
      });
  }, [selectedCategory]);

  // カテゴリの作成
  const createCategory = async (value) => {
    const body = {
      categoryName: value,
    };
    await axios({ api: api.createCategory, data: body })
      .then((response) => {
        if (response.data.success) {
          load();
          enqueueSnackbar("カテゴリを作成しました", {
            variant: "success",
            anchorOrigin: snackbarOptions,
          });
        }
      })
      .catch((e) => console.log("Error"));
  };

  // カテゴリの編集
  const updateCategory = async (value) => {
    const body = {
      categoryName: value,
    };
    await axios({
      api: api.updateCategory,
      resourceId: targetCategoryId,
      data: body,
    })
      .then((response) => {
        if (response.data.success) {
          load();
          enqueueSnackbar("カテゴリ名を変更しました", {
            variant: "success",
            anchorOrigin: snackbarOptions,
          });
        }
      })
      .catch((e) => console.log("Error"));
  };

  // カテゴリの削除
  const deleteCategory = async () => {
    await axios({ api: api.deleteCategory, resourceId: targetCategoryId })
      .then((response) => {
        if (response.data.success) {
          if (selectedCategory === -1) {
            load();
          } else {
            setSelectedCategory(-1);
          }
          enqueueSnackbar("カテゴリを削除しました", {
            variant: "success",
            anchorOrigin: snackbarOptions,
          });
        }
      })
      .catch((e) => console.log("Error"));
  };

  // ロード
  const load = useCallback(async () => {
    setLoading(true);
    let unauthorize = false;
    await loginCheck()
      .then((response) => {
        if (response.data.success && response.data["user_type"] === "admin") {
        } else {
          unauthorize = true;
        }
      })
      .catch((e) => (unauthorize = true));

    if (unauthorize) {
      resetUser();
      navigator("/admin/login");
    } else {
      if (initialLogin) {
        setInitialLogin(false);
      } else {
        await getCategories();
        await getPosts();
        setLoading(false);
      }
    }
  }, [getPosts, initialLogin, resetUser, navigator]);

  // 初期表示
  useEffect(() => {
    load();
  }, [load]);

  // ログアウトしてログイン画面へ遷移
  const logout = async () => {
    await axios({ api: api.signOut })
      .then((response) => {
        if (response.data.status === "success") {
          enqueueSnackbar("ログアウトしました", {
            variant: "success",
            anchorOrigin: snackbarOptions,
          });
        }
      })
      .catch((e) => {
        enqueueSnackbar("ログアウトに失敗しました", {
          variant: "error",
          anchorOrigin: snackbarOptions,
        });
      });
    resetUser();
    navigator("/admin/login");
  };

  const CategoryDialog = ({
    open,
    title,
    enableTextField,
    discription,
    onClose,
    onSubmit,
  }) => {
    const [input, setInput] = useState("");
    const [helperText, setHelperText] = useState("");

    const onClick = async () => {
      // 入力チェック
      setHelperText("");
      if (enableTextField && (!input || input.trim() === "")) {
        setHelperText("入力必須です（空欄のみの入力もできません）");
        return;
      } else if (input.trim() !== "" && input.length > 50) {
        setHelperText("カテゴリ名は50文字以内で入力してください");
        return;
      }
      // 重複チェック
      if (input.trim() !== "") {
        const count = categories.filter(
          (category) => category["category_name"] === input,
        );
        if (count.length > 0) {
          setHelperText("すでに登録済みのカテゴリです");
          return;
        }
      }
      await onSubmit(input);
      onClose();
    };

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{discription}</DialogContentText>
          {enableTextField && (
            <TextField
              autoFocus
              label="カテゴリ"
              fullWidth
              value={input}
              error={helperText !== ""}
              helperText={helperText}
              variant="standard"
              onChange={(e) => setInput(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <SubmitButton onClick={onClick} fullWidth>
            OK
          </SubmitButton>
          <Button onClick={onClose} fullWidth>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <>
      {initialLogin ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
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
                  3ch 管理者機能
                </Typography>
                <Button color="success" variant="contained" onClick={logout}>
                  ログアウト
                </Button>
              </Toolbar>
            </AppBar>
          </Box>
          <CategoryDialog
            open={openAddDialog}
            enableTextField={true}
            onClose={() => setOpenAddDialog(false)}
            onSubmit={(value) => createCategory(value)}
            title="カテゴリの追加"
            discription="追加したいカテゴリ名を入力してください"
          />
          <CategoryDialog
            open={openEditDialog}
            enableTextField={true}
            onClose={() => setOpenEditDialog(false)}
            onSubmit={(value) => updateCategory(value)}
            title="カテゴリの編集"
            discription="変更後のカテゴリ名を入力してください"
          />
          <CategoryDialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
            onSubmit={() => deleteCategory()}
            title="カテゴリの削除"
            discription="カテゴリを削除します。この操作は取り消せません。"
          />
          <Container
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box>
              <Card
                variant="outlined"
                sx={{
                  margin: theme.spacing(1),
                  width: "400px",
                  maxHeight: "500px",
                }}
              >
                <CardHeader title="カテゴリ" />
                <CardContent sx={{ maxHeight: "300px", overflowY: "auto" }}>
                  <List>
                    {categories.map((category) => (
                      <ListItem
                        key={category["id"]}
                        {...(category["id"] !== -1 && {
                          secondaryAction: (
                            <>
                              <Tooltip title="編集する">
                                <IconButton
                                  edge="end"
                                  aria-label="edit"
                                  onClick={() => {
                                    setTargetCategoryId(category["id"]);
                                    setOpenEditDialog(true);
                                  }}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="削除する">
                                <IconButton
                                  edge="end"
                                  aria-label="delete"
                                  onClick={() => {
                                    setTargetCategoryId(category["id"]);
                                    setOpenDeleteDialog(true);
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          ),
                        })}
                        disablePadding
                      >
                        <ListItemButton
                          selected={selectedCategory === category["id"]}
                          onClick={() => setSelectedCategory(category["id"])}
                        >
                          <ListItemText
                            primary={
                              <>
                                {category["category_name"]}&nbsp;
                                <Tooltip title="全件数">
                                  <Chip
                                    label={category["count"]}
                                    size="small"
                                  />
                                </Tooltip>
                                &nbsp;
                                <Tooltip title="非表示件数">
                                  <Chip
                                    icon={<VisibilityOffOutlinedIcon />}
                                    label={category["hidden_count"]}
                                    size="small"
                                  />
                                </Tooltip>
                              </>
                            }
                          ></ListItemText>
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <CardActions
                  sx={{
                    display: "flex",
                    justifyContent: "right",
                  }}
                >
                  <Tooltip title="カテゴリを追加する">
                    <IconButton
                      aria-label="add category"
                      onClick={() => setOpenAddDialog(true)}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
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
              {posts.map((post, index) => (
                <Post
                  key={index}
                  postId={post["id"]}
                  category={post["category_name"]}
                  title={post.title}
                  name={post.name}
                  mail={post.mail}
                  enableHidden={post.hidden}
                  onlyVisibleHidden={true}
                >
                  {post.body}
                </Post>
              ))}
            </Stack>
          </Container>
        </>
      )}
    </>
  );
};

export default Admin;
