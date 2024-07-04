<template>
  <div>
    <div class="top-panel">
      <el-card class="box-card">
        <el-form :model="searchForm" label-width="70px" label-position="right">
          <el-row>
            <el-col :span="7">
              <el-form-item label="标题">
                <el-input
                  clearable
                  placeholder="支持模糊搜索"
                  v-model.trim="searchForm.titleFuzzy"
                  @keyup.enter.native="loadDataList"
                  class="password-input"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :style="{ paddingLeft: '10px' }">
              <el-button type="success" @click="loadDataList()">查询</el-button>
              <el-button
                type="primary"
                @click="showEdit()"
                v-has="proxy.PermissionCode.article.edit"
                >发布文章</el-button
              >
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <el-card class="table-data-card">
      <template #header>
        <span>文章列表</span>
      </template>
      <Table
        ref="tableInfoRef"
        :columns="articles"
        :fetch="loadDataList"
        :dataSource="tableData"
        :options="tableOptions"
        :extHeight="tableOptions.extHeight"
        rowKey="articleId"
      >
        <template #slotOperation="{ index, row }">
          <div class="row-op-panel">
            <a
              class="a-link"
              href="javascript:void(0)"
              @click.prevent="showEdit(row)"
              v-has="proxy.PermissionCode.article.edit"
              >修改</a
            >
            <a
              class="a-link"
              href="javascript:void(0)"
              @click.prevent="delArticle(row)"
              v-has="proxy.PermissionCode.article.del"
              >删除</a
            >
          </div>
        </template>
      </Table>
    </el-card>
    <!-- 新增/修改 -->
    <ArticleEdit
      ref="articleEditRef"
      @reload="loadDataList"
    ></ArticleEdit>
  </div>
</template>

<script setup>
import ArticleEdit from "./ArticleEdit.vue";
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  loadArticle: "/post/articleList",
  delArticle: "/post/delArticle",
};

const searchForm = ref({});
const tableData = ref({});
const tableOptions = ref({
  extHeight: 125,
});

const articles = [
  { label: "文章ID", prop: "articleId" },
  { label: "标题", prop: "title" },
  { label: "发布人", prop: "userName" },
  { label: "创建时间", prop: "postTime" },
  { width: 100, label: "操作", scopedSlots: "slotOperation" },
];

const tableInfoRef = ref();
const currentRow = ref({});
const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  };
  Object.assign(params, searchForm.value);
  let result = await proxy.Request({
    url: api.loadArticle,
    params,
  });
  if (!result) {
    return;
  }
  tableData.value = Object.assign({}, result.data);
};

// 删除标签
const delArticle = (data) => {
  proxy.Confirm(`确定要删除${data.articleId}吗？`, async () => {
    let result = await proxy.Request({
      url: api.delArticle,
      params: {
        articleId: data.articleId,
      },
    });
    if (!result) {
      return;
    }
    proxy.Message.success("删除成功!");
    currentRow.value = {};
    loadDataList();
  });
};

const articleEditRef = ref();
const showEdit = (data = {}) => {
  articleEditRef.value.showEdit(Object.assign({}, data));
};
</script>

<style lang="scss" scoped>
.detail-tree-panel {
  height: calc(100vh - 273px);
  overflow: auto;
  width: 100%;
}

.right-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 18px;
}
</style>
