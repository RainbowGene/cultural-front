<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      :showCancel="true"
      @close="dialogConfig.show = false"
      width="95%"
    >
      <div class="edit-post">
        <el-form
          :model="formData"
          :rules="rules"
          ref="formDataRef"
          class="post-panel"
          label-width="60px"
        >
          <div class="post-editor">
            <el-card :body-style="{ padding: '5px' }">
              <template #header>
                <div class="post-editor-title">
                  <span>正文</span>
                  <div class="change-editor-type">
                    <span class="iconfont icon-change" @click="changeEditor">
                      切换为{{
                        editorType == 0 ? "markdown编辑器" : "富文本编辑器"
                      }}
                    </span>
                  </div>
                </div>
              </template>
              <!--input输入-->
              <el-form-item prop="content" label-width="0">
                <EditorHtml
                  :height="htmlEditorHeight"
                  v-if="editorType == 0"
                  v-model="formData.content"
                >
                </EditorHtml>
                <EditorMarkdown
                  :height="markdownHeight"
                  v-if="editorType == 1"
                  v-model="formData.markdownContent"
                  @htmlContent="setHtmlContent"
                >
                </EditorMarkdown>
              </el-form-item>
            </el-card>
          </div>
          <div class="post-setting">
            <el-card :body-style="{ padding: '5px' }">
              <template #header>
                <span>设置</span>
              </template>
              <div class="setting-inner">
                <!--input输入-->
                <el-form-item label="标题" prop="title">
                  <el-input
                    clearable
                    :maxlength="150"
                    placeholder="提示信息"
                    v-model="formData.title"
                  ></el-input>
                </el-form-item>
                <el-form-item label="栏目" prop="columnId">
                  <el-cascader
                    placeholder="请选择栏目"
                    :options="columnList"
                    :props="columnProps"
                    clearable
                    v-model="formData.columnId"
                    :style="{ width: '100%' }"
                    @change="handleColSelect"
                  />
                </el-form-item>
                <el-form-item label="封面" prop="cover">
                  <CoverUpload v-model="formData.cover"></CoverUpload>
                </el-form-item>
                <!--textarea输入-->
                <el-form-item label="摘要" prop="summary">
                  <el-input
                    clearable
                    placeholder="提示信息"
                    type="textarea"
                    :rows="5"
                    :maxlength="200"
                    resize="none"
                    show-word-limit
                    v-model="formData.summary"
                  ></el-input>
                </el-form-item>
              </div>
            </el-card>
          </div>
        </el-form>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessageBox } from "element-plus";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const api = {
  loadColumn: "/content/columnList",
  postArticle: "/post/postArticle", // 发文
  // updateArticle: "/post/updateArticle", // 修改文章
};

const markdownHeight = window.innerHeight - 80 - 60;
const htmlEditorHeight = window.innerHeight - 80 - 140;

const dialogConfig = ref({
  show: false,
  title: "新增文章",
  buttons: [
    {
      type: "primary",
      text: "保存",
      click: (e) => {
        submitForm();
      },
    },
  ],
});

const formData = ref({});
const formDataRef = ref();
const rules = {
  title: [{ required: true, message: "请输入文章标题" }],
  columnId: [{ required: true, message: "请选择栏目" }],
  content: [{ required: true, message: "请输入正文" }],
};

const showEdit = (data) => {
  dialogConfig.value.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    if (data.articleId == null) {
      dialogConfig.value.title = "新增文章";
      formData.value = {};
    } else {
      dialogConfig.value.title = "修改文章";
      formData.value = Object.assign({}, data);
      if (data.cover) {
        // 设置封面
        formData.value.cover = { imageUrl: data.cover };
      }
    }
  });
};

//设置markdown编辑器的富文本信息
const setHtmlContent = (htmlContent) => {
  formData.value.content = htmlContent;
};

watch(
  () => route,
  (newVal, oldVal) => {
    if (
      newVal.path.indexOf("/editPost") != -1 ||
      newVal.path.indexOf("/newPost") != -1
    ) {
      articleId.value = newVal.params.articleId;
      getArticleDetail();
    }
  },
  { immediate: true, deep: true }
);

defineExpose({
  showEdit,
});

const emit = defineEmits(["reload"]);
const submitForm = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData.value);
    delete params.postTime;
    // 提交信息
    params.editorType = editorType.value;
    // 设置编辑器类型
    //获取内容
    const contentText = params.content.replace(/<(?!img).*?>/g, "");
    if (contentText == "") {
      proxy.message.warning("正文不能为空");
      return;
    }
    //封面
    if (!(params.cover instanceof File)) {
      delete params.cover;
    }
    // return console.log(params);
    let result = await proxy.Request({
      url: api.postArticle,
      params,
    });
    if (!result) {
      return;
    }
    dialogConfig.value.show = false;
    proxy.Message.success("保存成功!");
    emit("reload");
  });
};

//栏目信息
const columnProps = {
  multiple: false,
  checkStrictly: true,
  value: "columnId",
  label: "columnName",
};
const columnList = ref([]);
const loadColumnList = async () => {
  let result = await proxy.Request({
    url: api.loadColumn,
  });
  if (!result) {
    return;
  }
  columnList.value = result.data;
};
loadColumnList();

//编辑器类型 0：富文本  1:markdown
const editorType = ref(0);
const changeEditor = () => {
  proxy.Confirm("切换编辑器会清空正在编辑的内容，确定要切换吗？", () => {
    editorType.value = editorType.value == 0 ? 1 : 0;
    formData.value.content = "";
    formData.value.markdownContent = "";
    proxy.VueCookies.set("editorType", editorType.value, -1);
  });
};

// 绑定栏目
const handleColSelect = (e) => {
  formData.value.columnId = e[e.length - 1];
};
</script>

<style lang="scss" scoped>
.check-span-item {
  float: left;
  margin-right: 10px;
  line-height: 20px;
}

.edit-post {
  .post-panel {
    display: flex;

    .el-card__header {
      padding: 10px;
    }

    .post-editor {
      flex: 1;

      .post-editor-title {
        display: flex;
        justify-content: space-between;

        .change-editor-type {
          .iconfont {
            cursor: pointer;
            color: var(--link);
            font-size: 14px;
          }
        }
      }
    }

    .post-setting {
      margin-left: 10px;
      width: 380px;

      .setting-inner {
        max-height: calc(100vh - 120px);
        overflow: auto;

        .el-form-item {
          align-items: flex-start;
        }
      }

      .tips {
        color: #797979;
        font-size: 13px;
      }
    }
  }
}
</style>
