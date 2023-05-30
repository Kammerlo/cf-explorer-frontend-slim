import React, { useState } from "react";
import { Box, CircularProgress, IconButton, useTheme } from "@mui/material";
import { useLocalStorage } from "react-use";
import { ReactComponent as BookmarkIcon } from "../../../commons/resources/icons/Bookmark.svg";
import { ReactComponent as Bookmarked } from "../../../commons/resources/icons/Bookmarked.svg";
import { addBookmark, deleteBookmark } from "../../../commons/utils/userRequest";
import { NETWORK, NETWORK_TYPES } from "../../../commons/utils/constants";
import useToast from "../../../commons/hooks/useToast";
import useAuth from "src/commons/hooks/useAuth";

interface BookmarkButtonProps {
  keyword: string;
  type: Bookmark["type"];
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ keyword, type }) => {
  const { isLoggedIn } = useAuth();
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>("bookmark", []);
  const theme = useTheme();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const bookmark = (bookmarks || []).find((r) => r.keyword === `${keyword}`);
  const updateBookmark = async () => {
    if (!isLoggedIn) {
      if (!bookmark) {
        setBookmarks([...(bookmarks || []), { keyword: `${keyword}`, type, network: NETWORK_TYPES[NETWORK] }]);
        toast.success("Add bookmark successfully!");
      } else {
        setBookmarks((bookmarks || []).filter((b) => b.keyword !== `${keyword}`));
        toast.success("Delete bookmark successfully!");
      }
    }

    if (isLoggedIn)
      try {
        setLoading(true);
        if (!bookmark) {
          if ((bookmarks || [])?.length < 2000) {
            const { data } = await addBookmark({
              keyword,
              type,
              network: NETWORK_TYPES[NETWORK]
            });
            setBookmarks([...(bookmarks || []), data]);
            toast.success("Add bookmark successfully!");
          } else {
            toast.error("Maximum bookmarks is 2000!");
          }
        } else {
          try {
            deleteBookmark(bookmark?.id || 0);
            setBookmarks((bookmarks || []).filter((b) => b.keyword !== `${keyword}`));
            toast.success("Delete bookmark successfully!");
          } catch (error) {
            toast.error("Something went wrong!");
          }
        }
      } catch (error) {
        toast.error("Something went wrong!");
      } finally {
        setLoading(false);
      }
  };

  return (
    <Box>
      <Box mx={1} component={IconButton} style={{ width: 45, height: 45 }} onClick={updateBookmark}>
        {loading ? (
          <CircularProgress size={"30px"} />
        ) : bookmark ? (
          <Bookmarked />
        ) : (
          <BookmarkIcon fill={theme.palette.text.hint} />
        )}
      </Box>
    </Box>
  );
};

export default BookmarkButton;
