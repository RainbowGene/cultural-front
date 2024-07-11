const PermissionCode = {
  home: "home",
  menu: {
    edit: "settings_menu_edit",
  },
  role: {
    edit: "settings_role_edit",
    del: "settings_role_del",
  },
  account: {
    edit: "settings_account_edit",
    del: "settings_account_del",
    updatePwd: "settings_account_update_password",
    updateStatus: "settings_account_op_status",
  },
  column: {
    edit: "content_col_edit",
    del: "content_col_del",
    updateStatus: "content_col_op_status",
    list: "content_col_list",
  },
  area: {
    edit: "content_area_edit",
    del: "content_area_del",
    list: "content_area_list",
  },
  tag: {
    edit: "content_tag_edit",
    del: "content_tag_del",
    list: "content_tag_list",
  },
  article: {
    edit: "post_article_edit",
    del: "post_article_del",
    list: "post_article_list",
    del_batch: "post_article_del_batch",
  },
  book: {
    edit: "post_book_edit", // 上传电子书
    list: "post_book_list",
    del_batch: "post_book_op_status",
  },
  carousel: {
    edit: "post_carousel_edit",
    list: "post_carousel_list",
    del: "post_carousel_del",
  },
};

export default PermissionCode;
