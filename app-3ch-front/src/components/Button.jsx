import { CircularProgress, Box, Button as MUIButton } from "@mui/material";
import { useEffect, useState } from "react";

const Button = ({ fullWidth, LinkComponent, onClick, to, children }) => {
  const [loading, setLoading] = useState(false);
  const [mount, setMount] = useState(true);

  useEffect(() => {
    return () => {
      setMount(false);
    };
  }, []);

  const handleButtonClick = async () => {
    if (!loading) {
      setLoading(true);
      await onClick();
      if (mount) setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", alignItems: "center" }}>
      <Box sx={{ position: "relative" }}>
        <MUIButton
          fullWidth={fullWidth}
          variant="contained"
          disabled={loading}
          {...(onClick && { onClick: handleButtonClick })}
          {...(LinkComponent && { LinkComponent: LinkComponent, to: to })}
        >
          {children}
        </MUIButton>
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: "-12px",
              marginLeft: "-12px",
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default Button;
