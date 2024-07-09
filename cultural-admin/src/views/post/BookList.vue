<template>
    <div>
      <div class="top-panel">
        <el-card class="box-card">
          <el-form :model="searchForm" label-width="70px" label-position="right">
            <el-row>
              <el-col :span="7">
                <el-form-item label="书名">
                  <el-input
                    clearable
                    placeholder="支持模糊搜索"
                    v-model.trim="searchForm.bookNameFuzzy"
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
                  v-has="proxy.PermissionCode.book.edit"
                  >发布电子书</el-button
                >
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </div>
      <el-card class="table-data-card">
        <template #header>
          <span>电子书列表</span>
        </template>
        <Table
          ref="tableInfoRef"
          :columns="books"
          :fetch="loadDataList"
          :dataSource="tableData"
          :options="tableOptions"
          :extHeight="tableOptions.extHeight"
          rowKey="bookId"
        >
          <template #slotOperation="{ index, row }">
            <div class="row-op-panel">
              <a
                class="a-link"
                href="javascript:void(0)"
                @click.prevent="showEdit(row)"
                v-has="proxy.PermissionCode.book.edit"
                >修改</a
              >
              <a
                class="a-link"
                href="javascript:void(0)"
                @click.prevent="delBook(row)"
                v-has="proxy.PermissionCode.book.del_batch"
                >删除</a
              >
            </div>
          </template>
        </Table>
      </el-card>
      <!-- 新增/修改 -->
      <BookEdit
        ref="bookEditRef"
        @reload="loadDataList"
      ></BookEdit>
    </div>
  </template>
  
  <script setup>
  import BookEdit from "./BookEdit.vue";
  import { ref, reactive, getCurrentInstance, nextTick } from "vue";
  const { proxy } = getCurrentInstance();
  
  const api = {
    loadBook: "/post/bookList",
    delBook: "/post/delBook",
  };
  
  const searchForm = ref({});
  const tableData = ref({});
  const tableOptions = ref({
    extHeight: 125,
  });
  
  const books = [
    { label: "电子书ID", prop: "bookId" },
    { label: "书名", prop: "bookName" },
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
      url: api.loadBook,
      params,
    });
    if (!result) {
      return;
    }
    tableData.value = Object.assign({}, result.data);
  };
  
  // 删除标签
  const delBook = (data) => {
    proxy.Confirm(`确定要删除${data.bookName}吗？`, async () => {
      let result = await proxy.Request({
        url: api.delBook,
        params: {
          bookId: data.bookId,
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
  
  const bookEditRef = ref();
  const showEdit = (data = {}) => {
    bookEditRef.value.showEdit(Object.assign({}, data));
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
  