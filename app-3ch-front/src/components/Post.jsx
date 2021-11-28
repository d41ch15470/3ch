import { useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const Post = ({
  postId,
  category,
  title,
  name,
  mail,
  enableHidden,
  onlyVisibleHidden,
  onClickHidden,
  children,
}) => {
  const theme = createTheme();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Dialog onClose={() => setDialogOpen(false)} open={dialogOpen}>
        <DialogContent>この投稿を非表示にしますか？</DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogOpen(false);
              onClickHidden(postId);
            }}
          >
            OK
          </Button>
          <Button onClick={() => setDialogOpen(false)}>CANCEL</Button>
        </DialogActions>
      </Dialog>
      <Card variant="outlined" sx={{ margin: theme.spacing(1), flexShrink: 0 }}>
        <CardHeader
          title={title}
          subheader={name}
          {...(enableHidden && onlyVisibleHidden
            ? {
                action: (
                  <Tooltip title="非表示の投稿">
                    <VisibilityOffOutlinedIcon />
                  </Tooltip>
                ),
              }
            : enableHidden && {
                action: (
                  <Tooltip title="非表示にする">
                    <IconButton
                      aria-label="hidden"
                      onClick={() => setDialogOpen(true)}
                    >
                      <VisibilityOffOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                ),
              })}
          sx={{ paddingBottom: "0px" }}
        />
        <CardContent sx={{ paddingTop: "0px", paddingBottom: "0px" }}>
          <Typography variant="subtitle2">{mail}</Typography>
          <Typography variant="body1">{children}</Typography>
        </CardContent>
        <CardActions>
          <Chip label={category} size="small" />
        </CardActions>
      </Card>
    </>
  );
};

export default Post;
