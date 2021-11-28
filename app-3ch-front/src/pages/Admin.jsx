import {
  AppBar,
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
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
import axios from "axios";
import UserContext from "contexts/UserContext";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Post from "components/Post";
import SubmitButton from "components/Button";
import { Category } from "@mui/icons-material";

const Admin = () => {
  const theme = createTheme();
  const navigator = useNavigate();
  const { user, resetUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(-1);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [targetCategoryId, setTargetCategoryId] = useState(-1);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  // カテゴリ情報の取得
  const getCategories = async () => {
    await axios
      .get("https://localhost:3001/categories?allCnt=true")
      .then((response) => {
        if (response.data.status === "success") {
          setCategories(response.data.categories);
        }
      })
      .catch((e) => {
        console.log("Error");
      });
  };

  // 投稿の取得
  const getPosts = useCallback(async () => {
    const postUrl =
      selectedCategory === -1
        ? "https://localhost:3001/posts"
        : `https://localhost:3001/categories/${selectedCategory}/posts`;

    await axios
      .get(postUrl)
      .then((response) => {
        if (response.data.status === "success") {
          setPosts(response.data.posts);
        }
      })
      .catch((e) => {
        console.log("Error");
      });
  }, [selectedCategory]);

  // カテゴリーの作成
  const createCategory = async (value) => {
    const body = {
      categoryName: value,
    };
    await axios
      .post("https://localhost:3001/categories", body)
      .then((response) => {
        if (response.data.status === "success") {
          load();
        }
      })
      .catch((e) => console.log("Error"));
  };

  // カテゴリーの編集
  const updateCategory = async (value) => {
    const body = {
      categoryName: value,
    };
    await axios
      .patch(`https://localhost:3001/categories/${targetCategoryId}`, body)
      .then((response) => {
        if (response.data.status === "success") {
          load();
        }
      })
      .catch((e) => console.log("Error"));
  };

  // カテゴリーの削除
  const deleteCategory = async () => {
    await axios
      .delete(`https://localhost:3001/categories/${targetCategoryId}`)
      .then((response) => {
        if (response.data.status === "success") {
          setSelectedCategory(-1);
        }
      })
      .catch((e) => console.log("Error"));
  };

  // ロード
  const load = useCallback(async () => {
    setLoading(true);
    await getCategories();
    await getPosts();
    setLoading(false);
  }, [getPosts]);

  // 初期表示
  useEffect(() => {
    load();
  }, [load]);

  // ログアウトしてログイン画面へ遷移
  const logout = () => {
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
      if (enableTextField && !input) {
        setHelperText("入力してください");
        return;
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
              label="カテゴリー"
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
        title="カテゴリーの追加"
        discription="追加したいカテゴリー名を入力してください"
      />
      <CategoryDialog
        open={openEditDialog}
        enableTextField={true}
        onClose={() => setOpenEditDialog(false)}
        onSubmit={(value) => updateCategory(value)}
        title="カテゴリーの編集"
        discription="変更後のカテゴリー名を入力してください"
      />
      <CategoryDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onSubmit={() => deleteCategory()}
        title="カテゴリーの削除"
        discription="カテゴリーを削除します。この操作は取り消せません。"
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
              maxHeight: "600px",
            }}
          >
            <CardContent>
              <Typography variant="h5">カテゴリ</Typography>
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
                              <Chip label={category["count"]} size="small" />
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
              <Tooltip title="カテゴリーを追加する">
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
  );
};

export default Admin;
