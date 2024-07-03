<template>
  <div>
    <div class="top-panel">
      <el-card class="box-card">
        <el-form :model="searchForm" label-width="70px" label-position="right">
          <el-row>
            <el-col :span="7">
              <el-form-item label="标签名">
                <el-input
                  clearable
                  placeholder="支持模糊搜索"
                  v-model.trim="searchForm.tagNameFuzzy"
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
                v-has="proxy.PermissionCode.tag.edit"
                >新增标签</el-button
              >
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <el-card class="table-data-card">
      <template #header>
        <span>标签列表</span>
      </template>
      <Table
        ref="tableInfoRef"
        :columns="tags"
        :fetch="loadDataList"
        :dataSource="tableData"
        :options="tableOptions"
        :extHeight="tableOptions.extHeight"
        rowKey="tagId"
      >
        <template #slotOperation="{ index, row }">
          <div class="row-op-panel">
            <a
              class="a-link"
              href="javascript:void(0)"
              @click.prevent="showEdit(row)"
              v-has="proxy.PermissionCode.tag.edit"
              >修改</a
            >
            <a
              class="a-link"
              href="javascript:void(0)"
              @click.prevent="delTag(row)"
              v-has="proxy.PermissionCode.tag.del"
              >删除</a
            >
          </div>
        </template>
      </Table>
    </el-card>
    <!-- 新增/修改 -->
    <TagEdit ref="tagEditRef" @reload="loadDataList"></TagEdit>
  </div>
</template>

<script setup>
import TagEdit from "./TagEdit.vue";
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  loadTag: "/content/tagList",
  delTag: "/content/delTag",
};

const searchForm = ref({});
const tableData = ref({});
const tableOptions = ref({
  extHeight: 125,
});

const tags = [
  { label: "标签名", prop: "tagName" },
  { label: "颜色", prop: "tagColor" },
  { label: "创建时间", prop: "createTime" },
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
    url: api.loadTag,
    params,
  });
  if (!result) {
    return;
  }
  tableData.value = Object.assign({}, result.data);
};

// 删除标签
const delTag = (data) => {
  proxy.Confirm(`确定要删除${data.tagName}吗？`, async () => {
    let result = await proxy.Request({
      url: api.delRole,
      params: {
        tagId: data.tagId,
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

const tagEditRef = ref();
const showEdit = (data = {}) => {
  tagEditRef.value.showEdit(Object.assign({}, data));
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
