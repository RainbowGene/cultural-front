<template>
  <div>
    <div class="top-panel">
      <el-card class="box-card">
        <el-form :model="searchForm" label-width="70px" label-position="right">
          <el-row>
            <!-- <el-col :span="7">
              <el-form-item label="栏目名">
                <el-input
                  clearable
                  placeholder="支持模糊搜索"
                  v-model.trim="searchForm.columnNameFuzzy"
                  @keyup.enter.native="loadDataList"
                  class="password-input"
                ></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="6" :style="{ paddingLeft: '10px' }">
              <!-- <el-button type="success" @click="loadDataList()">查询</el-button> -->
              <el-button
                type="primary"
                @click="showEdit()"
                v-has="proxy.PermissionCode.column.edit"
                >新增栏目</el-button
              >
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <el-card class="table-data-card">
      <template #header>
        <span>栏目列表</span>
      </template>
      <Table
        ref="tableInfoRef"
        :columns="columns"
        :fetch="loadDataList"
        :dataSource="tableData"
        :options="tableOptions"
        :extHeight="tableOptions.extHeight"
        rowKey="columnId"
      >
        <template #slotStatus="{ index, row }">
          <span :class="row.status ? 'text-green' : 'text-red'">{{
            row.status ? "已启用" : "已隐藏"
          }}</span>
        </template>
        <template #slotOperation="{ index, row }">
          <div class="row-op-panel">
            <a
              class="a-link"
              href="javascript:void(0)"
              @click.prevent="showEdit(row)"
              v-has="proxy.PermissionCode.column.edit"
              >修改</a
            >
            <a
              :class="!row.status ? 'text-green' : 'text-red'"
              @click.prevent="changeAccountStatus(row)"
              v-has="proxy.PermissionCode.column.updateStatus"
              >{{ !row.status ? "启用" : "隐藏" }}</a
            >
            <a
              class="a-link"
              href="javascript:void(0)"
              @click.prevent="delColumn(row)"
              v-has="proxy.PermissionCode.column.del"
              >删除</a
            >
          </div>
        </template>
      </Table>
      <!-- <el-table
        :data="mockData"
        style="width: 100%; margin-bottom: 20px"
        row-key="columnId"
        default-expand-all
      >
        <el-table-column prop="columnId" label="ID" />
        <el-table-column prop="columnName" label="栏目名" />
        <el-table-column prop="status" label="状态" />
      </el-table> -->
    </el-card>
    <!-- 新增/修改 -->
    <ColumnEdit ref="ColumnEditRef" @reload="loadDataList"></ColumnEdit>
  </div>
</template>

<script setup>
import ColumnEdit from "./ColumnEdit.vue";
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  columnList: "/content/columnList",
  saveColumn: "/content/saveColumn",
  delColumn: "/content/delColumn",
  opColStatus: "/content/opColStatus",
  changeSort: "/content/changeSort",
};

const searchForm = ref({});
const tableData = ref({ list: [] });
const tableOptions = ref({
  extHeight: 125,
});

// const mockData = {
//   list: [
//     {
//       columnId: 1,
//       columnName: "栏目1",
//       status: 1,
//     },
//     {
//       columnId: 2,
//       columnName: "栏目2",
//       status: 1,
//       children: [
//         {
//           columnId: 4,
//           columnName: "栏目4",
//           status: 1,
//         },
//       ],
//     },
//     {
//       columnId: 3,
//       columnName: "栏目3",
//       status: 1,
//     },
//   ],
// };

const columns = [
  {
    label: "ID",
    prop: "columnId",
    width: 80,
  },
  //   {
  //     label: "封面",
  //     prop: "columnCover",
  //     scopedSlots: "imgPathSlot",
  //     width: 150,
  //   },
  { label: "栏目名称", prop: "columnName" },
  { label: "状态", prop: "status", scopedSlots: "slotStatus" },
  {
    label: "操作",
    prop: "type",
    width: 200,
    scopedSlots: "slotOperation",
  },
];

const tableInfoRef = ref();
const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  };
  Object.assign(params, searchForm.value);
  let result = await proxy.Request({
    url: api.columnList,
    params,
  });
  if (!result) {
    return;
  }
  //   Object.assign(tableData.value, result.data);
  tableData.value.list = result.data;
};

// 修改状态
const changeAccountStatus = (data) => {
  let status = data.status == 0 ? 1 : 0;
  let info = status == 0 ? "禁用" : "启用";
  proxy.Confirm(`确定要${info + data.columnName}吗？`, async () => {
    let result = await proxy.Request({
      url: api.opColStatus,
      params: {
        columnId: data.columnId,
        status: status,
      },
    });
    if (!result) {
      return;
    }
    proxy.Message.success("操作成功!");
    loadDataList();
  });
};

// 删除栏目
const delColumn = (data) => {
  proxy.Confirm(`确定要删除${data.columnName}吗？`, async () => {
    let result = await proxy.Request({
      url: api.delColumn,
      params: {
        columnId: data.columnId,
      },
    });
    if (!result) {
      return;
    }
    proxy.Message.success("删除成功!");
    loadDataList();
  });
};

const ColumnEditRef = ref();
const showEdit = (data = {}) => {
  ColumnEditRef.value.showEdit(Object.assign({}, data));
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

.text-red {
  color: red;
  cursor: pointer;
}
.text-green {
  color: green;
  cursor: pointer;
}
</style>
